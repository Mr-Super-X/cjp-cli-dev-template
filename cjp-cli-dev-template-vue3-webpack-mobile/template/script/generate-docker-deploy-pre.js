/**
 * 预发布环境每次都需要上传镜像包然后docker load、docker tag、......觉得很繁琐，索性封装一个脚本来解决问题
 * 脚本配置在package.json的scripts中，在npm run docker:build时执行
 * 最终会在deploy目录中生成一个deploy-pre.sh脚本文件
 *
 * 使用：
 *
 * 登录预发布堡垒机上传镜像tar压缩包之后再上传这个脚本文件，然后执行sh deploy-pre.sh命令
 */
const fs = require('fs')
const path = require('path')
const packageJson = require('../package.json')

// 读取package.json配置
const { name, version } = packageJson

// 数广镜像仓库地址
const sgRegistry = 'registry.dg.com/d4'
// 本地构建镜像名称
const imageName = `${name}`
// 镜像包文件后缀
const imageExt = 'tar'
// 镜像包cpu架构
const imageArc = 'arm64'
// 预发布堡垒机镜像仓库地址
const preRegistry = '10.167.42.21:18081/gsm'
// 以当前时间作为新的tag
const timeTag = formatDate()
// 预发布镜像和tag
const preImage = `${preRegistry}/${imageName}:${timeTag}`
// 预发布docker-compose配置文件路径
const composeFilePath = '/yyzt/yaml/server-compose.yaml'
// 预发布docker-compose配置文件备份路径
const composeFileBakPath = '/yyzt/bak/server-compose.yaml'

// 完整镜像压缩包名
const imageFullName = `${imageName}-v${version}-${imageArc}.${imageExt}`

// 脚本模板内容
const scriptTemplate = `#!/bin/sh

# 该文件由npm run create-deploy:pre命令生成，无需手动修改
# 导入镜像
docker load --input ${imageFullName}
# 输出导入成功
echo '导入镜像成功'
# 修改镜像tag
docker tag ${sgRegistry}/${imageName}:${version}-${imageArc} ${preImage}
# 输出修改成功
echo '修改镜像tag成功'
# 推送镜像
docker push ${preImage}
# 输出推送后的镜像包，便于后续复制修改docker-compose.yml
echo 'push镜像成功，完整镜像名为：${preImage}'
# 备份配置文件，所有的项目都在这个文件中，要是不小心搞坏了还没有备份就嗝屁了
cp ${composeFilePath} ${composeFileBakPath}.bak-${timeTag}
# 输出备份成功
echo '备份server-compose.yaml成功'
# 检测server-compose.yaml是否有以下内容，匹配成功会有输出，否则中断执行
grep -E 'image: ${preRegistry}/${imageName}:[0-9]{8,14}' ${composeFilePath} && echo "匹配成功，找到: $(grep -E 'image: ${preRegistry}/${imageName}:[0-9]{8,14}' ${composeFilePath})" || { echo "未匹配到内容，程序中断"; exit 1; }
# 修改server-compose.yaml -E参数表示开启正则表达式
sed -i -E 's|image: ${preRegistry}/${imageName}:[0-9]{8,14}|image: ${preRegistry}/${imageName}:${timeTag}|' ${composeFilePath}
# 输出修改成功
echo '修改server-compose.yaml成功'
# 重启服务
cd /yyzt && sh run.sh
# 输出重启成功
echo '服务重启成功，预发布页面访问地址为：http://19.25.35.216:19511/wr-portal-mobile/ 您稍后可以打开页面强刷重试'
`

try {
  // 定义动态文件名
  const shFileName = `deploy-pre_${name}_v${version}`
  // 同步写入文件
  fs.writeFileSync(path.join(__dirname, `../deploy/auto-generate/${shFileName}.sh`), scriptTemplate)
  // 输出日志
  console.log(`预发布部署脚本生成成功，生成路径为：${path.join(__dirname, `../deploy/auto-generate/${shFileName}.sh`)}`)
} catch (error) {
  console.error('预发布部署脚本生成失败:', error)
}

/**
 * 简单格式化时间为YYYYMMDDhhmmss
 */
function formatDate() {
  var d = new Date(new Date()),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(),
    hour = d.getHours(),
    minute = d.getMinutes(),
    second = d.getSeconds()

  return [year, addZero(month), addZero(day), addZero(hour), addZero(minute), addZero(second)].join('')
}

// 格式化数字为两位数，如1 -> 01
function addZero(num) {
  return num < 10 ? '0' + num : num
}
