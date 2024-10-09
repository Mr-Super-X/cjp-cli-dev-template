/**
 * 该文件主要用于生成动态的给docker-compose.yml使用的环境变量，变量会写入/docker/.env中
 */

const path = require('path')
const fs = require('fs')
const packageJson = require(path.resolve(__dirname, '../../package.json'))

// 读取package.json的version字段
const version = packageJson.version

const envFilePath = path.resolve(__dirname, '.env')

// 写入的变量内容
const content = `# 以下环境变量均为执行npm run docker:compose-up动态写入，无需手动修改

# package.json版本号
APP_VERSION=${version}
`
// 将内容写入 .env 文件
fs.writeFileSync(envFilePath, content)
