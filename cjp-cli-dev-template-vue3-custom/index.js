// 第三方库
const inquirer = require("inquirer"); // 用于终端交互
const fse = require("fs-extra"); // 用于清空文件夹和写入文件操作
const ejs = require("ejs"); // 用于渲染ejs模板
const { glob } = require("glob"); // 用于shell模式匹配文件

// 内置库
const cp = require("child_process");

// 白名单命令，不在此白名单中的命令都需要确认是否执行，防止用户插入风险操作，如：rm -rf等
const COMMAND_WHITELIST = require("./commandWhitelist");

// 代码来源于cjp-cli-dev/commands/init/lib/index.js 下载和渲染逻辑
async function install(options) {
  const projectPrompts = [];
  // 自定义项目模板需要额外增加描述信息填写
  const descriptionPrompt = {
    type: "input",
    name: "description",
    default: "",
    message: "请输入项目描述：",
    validate: function (v) {
      const done = this.async();

      setTimeout(() => {
        if (!v) {
          done(`请输入项目描述信息`);
          return;
        }

        done(null, true);
      }, 0);
    },
  };
  projectPrompts.push(descriptionPrompt);
  // 获取用户输入结果
  const projectInfoInput = await inquirer.prompt(projectPrompts);

  const { sourcePath, targetPath, projectInfo, templateInfo } = options;

  // 存入projectInfo中，提供给ejs使用
  projectInfo.description = projectInfoInput.description;

  try {
    // 确保这两个目录都存在，如果不存在会自动创建
    fse.ensureDirSync(sourcePath);
    fse.ensureDirSync(targetPath);
    // 拷贝模板代码到当前目录
    fse.copySync(sourcePath, targetPath);

    // ejs忽略文件夹，默认node_modules，可在数据库中配置ignore属性（数组）
    const templateIgnore = templateInfo.ignore || [];
    const ignore = ["**/node_modules/**", ...templateIgnore];
    // 模板安装完成后进行ejs渲染，替换掉ejs变量
    await ejsRender({ ignore, targetPath, projectInfo, templateInfo });

    // 模板安装完成后执行安装和启动模板
    const { installCommand, startCommand } = templateInfo;

    // 执行安装命令
    const installResult = await parsingCommandExec(
      installCommand,
      "installCommand",
      `检测到installCommand存在，执行：${installCommand}`
    );

    if (installResult === 0) {
      console.log("依赖安装成功");
    } else {
      // 抛出错误，阻断后面执行
      throw new Error("依赖安装失败");
    }

    // 执行启动命令
    await parsingCommandExec(
      startCommand,
      "startCommand",
      `检测到startCommand存在，执行：${startCommand}`
    );
  } catch (err) {
    // 如果报错，抛出错误
    throw err;
  }
}

// 使用ejs渲染模板
async function ejsRender(options = {}) {
  const { targetPath: cwd, projectInfo } = options;

  try {
    // 获取匹配的文件
    const files = await glob("**", {
      cwd,
      ignore: options.ignore || "node_modules/**", // 忽略内容
      nodir: true, // 不要文件夹
      dot: true, // 包含隐藏文件
    });

    if (!files || files.length === 0) {
      throw new Error("glob没有匹配到文件");
    }

    // 遍历文件并渲染 EJS 模板
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(cwd, file);
        try {
          const result = await ejs.renderFile(filePath, projectInfo, {});
          // 写入渲染后的结果
          fse.writeFileSync(filePath, result);
        } catch (err) {
          throw new Error(`EJS 渲染文件 ${filePath} 出错: ${err.message}`);
        }
      })
    );
  } catch (err) {
    // 捕获并处理所有错误
    console.error("ejsRender 执行出错：", err.message);
    throw err; // 抛出错误，以便外部调用处理
  }
}

/**
 * 解析并执行命令
 * @param {*} command 命令内容，如npm install、npm run dev
 * @param {*} field 接口数据中配置命令的字段名，如installCommand、startCommand
 * @param {*} logInfo 提示信息
 * @returns
 */
async function parsingCommandExec(command, field, logInfo) {
  // 命令不存在直接return
  if (!command) {
    console.log(`${field} 不存在，请查看数据库是否存在该配置`);
    return;
  }
  // 打印提示信息
  console.log(logInfo);
  // 解析命令并执行
  const cmds = command.split(" ");
  const cmd = checkCommandInWhitelist(cmds[0]);
  const args = cmds.slice(1); // 从索引1开始到数组结束的所有元素
  const result = await spawnAsync(cmd, args, {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  return result;
}

// 检查命令是否在白名单
function checkCommandInWhitelist(command) {
  if (!COMMAND_WHITELIST.includes(command)) {
    // 如果命令不在白名单
    throw new Error(
      `命令 ${command} 不在白名单中，可能存在风险，已阻止程序运行`
    );
  }

  return command;
}

// 兼容windows和MacOS
function spawn(command, args, options) {
  const win32 = process.platform === "win32";

  const cmd = win32 ? "cmd" : command;
  const cmdArgs = win32 ? ["/c"].concat(command, args) : args;

  return cp.spawn(cmd, cmdArgs, options || {});
}

function spawnAsync(command, args, options) {
  return new Promise((resolve, reject) => {
    const p = spawn(command, args, options)

    p.on('error', reject)
    p.on('exit', resolve)
  });
}

module.exports = install;
