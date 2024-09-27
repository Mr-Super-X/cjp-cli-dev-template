// 第三方库
const fse = require("fs-extra"); // 用于清空文件夹和写入文件操作
const ejs = require("ejs"); // 用于渲染ejs模板
const cSpawn = require("cross-spawn"); // 用来解决node内置的spawn在windows上运行路径解析错误问题
const readPkgUp = require("read-pkg-up"); // 用于查找根目录下的package.json
const semver = require("semver"); // 用于判断版本号
const { glob } = require("glob"); // 用于shell模式匹配文件

// 代码来源于cjp-cli-dev/commands/add/lib/index.js 下载和渲染逻辑
async function install(options) {
  const { templatePath, targetPath, pageTemplate } = options;

  try{
    // 将模板路径的所有文件拷贝到目标路径中
    fse.copySync(templatePath, targetPath);
    // 使用ejs渲染目标路径中的文件
    await ejsRender({ targetPath, pageTemplate });
    // 如果拷贝的模板中有依赖外部node_modules包，需要检查和合并依赖
    // 合并依赖完成后自动帮用户重新安装依赖
    await mergeDependencies({ templatePath, targetPath });
  } catch (err) {
    // 如果报错，抛出错误
    throw err;
  }
}

// 如果拷贝的模板中有依赖外部node_modules包，需要检查和合并依赖
async function mergeDependencies(options = {}) {
  // 处理依赖合并问题
  // 场景一：模板中存在依赖，项目中不存在（拷贝依赖）
  // 场景二：模板中存在依赖，项目中也存在（不会拷贝依赖，但是在脚手架中给予提示，让开发者手动处理）
  const { templatePath, targetPath } = options;
  // 获取package.json readPkgUp.sync会返回{ packageJson, path }
  const templatePkg = readPkgUp.sync({
    cwd: templatePath,
    normalize: false,
  });
  const targetPkg = readPkgUp.sync({
    cwd: targetPath,
    normalize: false,
  });

  // 获取依赖dependencies
  const templateDependencies = templatePkg.packageJson.dependencies || {};
  const targetDependencies = targetPkg.packageJson.dependencies || {};

  // 将对象转化为数组
  const templateDependenciesArr = objectToArray(templateDependencies);
  const targetDependenciesArr = objectToArray(targetDependencies);

  // 实现dependencies的diff
  const newDependencies = dependenciesDiff(
    templateDependenciesArr,
    targetDependenciesArr
  );

  // 将合并后的依赖写入到目标路径的package.json中dependencies里
  targetPkg.packageJson.dependencies = arrayToObject(newDependencies);
  fse.writeJsonSync(targetPkg.path, targetPkg.packageJson, { spaces: 2 }); // 写入package.json并给两个字符的缩进

  // 帮用户合并完依赖之后也自动帮用户安装好依赖（安装路径为当前项目package.json所在目录，通过path.dir来获得）
  await execCommand("npm install", path.dirname(targetPkg.path));
}

// 使用ejs渲染模板
async function ejsRender(options = {}) {
  const { targetPath, pageTemplate } = options;
  const { pageName, ignore } = pageTemplate;

  try {
    // 获取匹配的文件
    const files = await glob("**", {
      cwd: targetPath,
      ignore: ignore || "**/node_modules/**", // 忽略内容
      nodir: true, // 不要文件夹
      dot: true, // 包含隐藏文件
    });

    if (!files || files.length === 0) {
      throw new Error("glob没有匹配到文件");
    }

    // 遍历文件并渲染 EJS 模板
    await Promise.all(
      files.map(async (file) => {
        // 获取文件真实路径
        const filePath = path.join(targetPath, file);
        try {
          // 第二个参数是ejs渲染所需要的变量，如 <%= name %>
          const result = await ejs.renderFile(
            filePath,
            {
              name: pageName,
            },
            {}
          );
          // 写入渲染后的结果
          fse.writeFileSync(filePath, result);
        } catch (err) {
          throw new Error(`EJS 渲染文件 ${filePath} 出错: ${err.message}`);
        }
      })
    );
  } catch (err) {
    // 捕获并处理所有错误
    log.error("ejsRender 执行出错：", err.message);
    throw err; // 抛出错误，以便外部调用处理
  }
}

// 异步执行命令
async function execCommand(command, cwd) {
  let result;
  if (!command) {
    throw new Error("命令不存在！");
  }
  // npm install => ['npm', 'install']
  const commandArr = command.split(" ");
  const cmd = commandArr[0];
  const args = commandArr.slice(1);
  result = await spawnAsync(cmd, args, { stdio: "inherit", cwd });

  if (result !== 0) {
    throw new Error(`${command} 命令执行失败！`);
  }
  return result;
}

function objectToArray(o) {
  const arr = [];
  Object.keys(o).forEach((key) => {
    arr.push({
      key,
      value: o[key],
    });
  });

  return arr;
}

function arrayToObject(a) {
  const obj = {};
  a.forEach((item) => {
    obj[item.key] = item.value;
  });

  return obj;
}

function dependenciesDiff(templateDepArr, targetDepArr) {
  const result = [...targetDepArr];
  templateDepArr.forEach((templateDep) => {
    // 找出重复的依赖
    const duplicatedDep = targetDepArr.find(
      (targetDep) => templateDep.key === targetDep.key
    );

    // 场景一：模板中存在依赖，项目中不存在（拷贝依赖）
    // 将不重复的依赖push到目标dependencies中
    if (!duplicatedDep) {
      console.log("检测到新的依赖：", templateDep);
      result.push(templateDep);
    } else {
      console.log("检测到重复依赖：", duplicatedDep);

      // 场景二：模板中存在依赖，项目中也存在（不会拷贝依赖，但是在脚手架中给予提示，让开发者手动处理）
      // 对版本的上限进行比较，上限不一样就提示
      const templateRange = semver.validRange(templateDep.value).split("<")[1];
      const targetRange = semver.validRange(duplicatedDep.value).split("<")[1];
      if (templateRange !== targetRange) {
        console.warn(
          `${templateDep.key} 依赖冲突 \n模板依赖版本：${templateDep.value} \n本地依赖版本：${duplicatedDep.value} \n请手动处理冲突依赖版本为您希望使用的版本`
        );
      }
    }
  });
  return result;
}

// 兼容windows和MacOS
function spawn(command, args, options) {
  return cSpawn(command, args, options || {});
}

function spawnAsync(command, args, options) {
  return new Promise((resolve, reject) => {
    const p = spawn(command, args, options);

    p.on("error", reject);
    p.on("exit", resolve);
  });
}

module.exports = install;
