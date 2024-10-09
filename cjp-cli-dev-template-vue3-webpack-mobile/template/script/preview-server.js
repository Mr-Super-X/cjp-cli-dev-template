/**
 * 启动一个静态服务器，用于预览生产包代码，确保部署一致性，
 * 也可以在公司内网不通的情况下，本地启动服务给UI和产品确认效果（连接相同wifi即可）
 */

// 安装并引入dotenv，指定需要写入环境变量的文件，否则process.env将读取不到自定义的环境变量
const dotenv = require('dotenv').config({ path: '.env.production' }) // 这里我们只预览生产包，所以只需要引入生产配置
const express = require('express')
const path = require('path')
const os = require('os')

// 获取本机WALN IPv4地址
const getLocalWalnIPv4 = function () {
  var ipv4 = ''
  var ifaces = os.networkInterfaces() // 所有类型的适配器和全部内容

  for (var dev in ifaces) {
    ifaces[dev].forEach(function (details, alias) {
      if (dev === 'WLAN') {
        // 判断需要获取IP的适配器
        if (details.family == 'IPv4') {
          // 判断是IPV4还是IPV6 还可以通过alias去判断
          ipv4 = details.address // 取addressIP地址
          return
        }
      }
    })
  }

  return ipv4 || '127.0.0.1'
}

const app = express()
const port = 3000
const ip = getLocalWalnIPv4()

// 设置静态资源前缀
const publicPath = process.env.VUE_APP_PUBLICPATH
// 获取静态资源输出目录
const outputDir = process.env.VUE_APP_OUTPUT_DIR

// 设置静态资源目录
app.use(publicPath, express.static(path.join(__dirname, `${outputDir}${publicPath}`)))

// 所有路由指向index.html
app.get(`${publicPath}/*`, (req, res) => {
  res.sendFile(path.join(__dirname, `${outputDir}${publicPath}/`, 'index.html'))
})

// 启动服务
app.listen(port, ip, () => {
  console.log(`预览服务器已启动，按住ctrl单击链接进行访问： \n\n http://${ip}:${port}${publicPath}`)
})
