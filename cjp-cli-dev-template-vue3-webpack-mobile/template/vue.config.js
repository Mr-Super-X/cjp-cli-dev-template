// -------- 配置自动按需导入vant组件 start ---------
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { VantResolver } = require('@vant/auto-import-resolver')
// -------- 配置自动按需导入vant组件 end ---------
const { defineConfig } = require('@vue/cli-service')
const { resolve } = require('path')

// 验证VUE_APP_ENV环境方法
function verifyENV(env) {
  return [env].includes(process.env?.VUE_APP_ENV)
}
const isProd = verifyENV('production')

// 所有的webpack配置均可通过vue inspect > output.js命令来查看
// https://cli.vuejs.org/zh/guide/webpack.html#%E5%AE%A1%E6%9F%A5%E9%A1%B9%E7%9B%AE%E7%9A%84-webpack-%E9%85%8D%E7%BD%AE
module.exports = defineConfig({
  transpileDependencies: true, // 如果设置为 true，node_modules 中的所有依赖项都将由 Babel 转译 // 参考：https://zhuanlan.zhihu.com/p/374101233
  lintOnSave: false, // 设置为true时保存代码会触发eslint
  publicPath: process.env.VUE_APP_PUBLICPATH, // 部署应用包时的基础URL（静态资源前缀）
  outputDir: `${process.env.VUE_APP_OUTPUT_DIR}${process.env.VUE_APP_PUBLICPATH}`, // 将打包文件输出到如/deploy/nginx/html/wr-portal-mobile中
  css: {
    loaderOptions: {
      // 配置全局scss变量支持
      // 文档：https://cli.vuejs.org/zh/guide/css.html#%E5%90%91%E9%A2%84%E5%A4%84%E7%90%86%E5%99%A8-loader-%E4%BC%A0%E9%80%92%E9%80%89%E9%A1%B9
      scss: {
        additionalData: `
          @use "~@styles/scss/variable.scss" as *;
        `,
      },
    },
  },
  // 配置对象写法
  configureWebpack: {
    cache: { type: 'filesystem' },
    output: {
      // 可以覆盖vue默认的output配置
      filename: 'js/[name].[contenthash:8].bundle.js', // 对打包后的bundle进行命名，[name]会取entry中的文件名
      chunkFilename: 'js/[name].[contenthash:8].chunk.js', // 对打包后的chunk进行命名，[name]会取webpackChunkName
    },
    // 生产环境需要考虑是否开启，开发环境推荐使用source-map或者eval-cheap-module-source-map
    // source-map能获得最全面的报错和代码调试能力，但会拖慢热更新；eval-cheap-module-source-map能获得相对全面的报错和代码调试能力，且热更新更快
    devtool: isProd ? false : 'eval-cheap-module-source-map',
    plugins: [
      // -------- 配置自动按需导入vant组件 start ---------
      AutoImport.default({
        dts: false, // 设置为 false 以禁止生成ts文件 auto-imports.d.ts，主要是为了防止提交代码时eslint --fix报错
        resolvers: [VantResolver()],
      }),
      Components.default({
        dts: false, // 设置为 false 以禁止生成ts文件 components.d.ts，主要是为了防止提交代码时eslint --fix报错
        resolvers: [VantResolver()],
      }),
      // -------- 配置自动按需导入vant组件 end ---------
    ],
    optimization: {
      /**
       * Webpack的一个优化功能，用于将代码分割成更小的块，以便更好地利用浏览器的缓存机制，提升加载速度
       * 通过 splitChunks 插件，将代码分割成不同的块，能够显著减少每次加载时需要下载的数据量，提高页面加载速度
       * vendors 缓存组：将来自 node_modules 中的第三方库和工具打包成一个单独的块（chunk-vendors），可以利用浏览器缓存，避免重复下载
       * common 缓存组：将多次引用的公共模块打包成一个单独的块（chunk-common），避免重复加载和提升缓存利用率
       */
      splitChunks: {
        chunks: 'all', // 指定哪些块应该被优化。在这里，'all' 表示将优化所有的块，包括初始化块和异步块
        /**
         * 这是配置具体的代码分组规则，用于告诉Webpack如何决定将哪些模块打包成单独的块
         */
        cacheGroups: {
          /**
           * 命名为 vendors 的缓存组，用于将来自 node_modules 文件夹的模块打包成一个名为 chunk-vendors 的块
           */
          vendors: {
            name: 'chunk-vendors', // 指定打包后的块的名称为 chunk-vendors
            test: /[\\/]node_modules[\\/]/, // 使用正则表达式来匹配位于 node_modules 文件夹中的模块
            priority: -10, // 设置优先级，负数表示优先级较高。在多个缓存组之间竞争时，优先级高的会被优先打包
            chunks: 'initial', // 指定仅包括初始化块。意味着仅将入口点引入的模块打包到此 vendors 块中
          },
          /**
           * 命名为 common 的缓存组，用于将至少被引入两次的模块打包成一个名为 chunk-common 的块
           */
          common: {
            name: 'chunk-common', // 指定打包后的块的名称为 chunk-common
            minChunks: 2, // 指定一个模块至少被引入两次时，才会被打包到这个 common 块中
            priority: -20, // 设置优先级比 vendors 更低，确保 vendors 在竞争时优先被打包
            chunks: 'initial', // 指定仅包括初始化块
            reuseExistingChunk: true, // 如果当前模块已经存在于其它块中，则重用该块，而不是创建新的块
          },
        },
      },
      /**
       * 场景：当我们为output.chunkFilename设置包含contenthash的名称时，假设A模块引用了B模块，此时A模块记录了B模块名称的
       * hash值，当修改B模块的内容重新打包后B模块的hash值变了，虽然A模块的内容没有修改，但是由于A模块引用了B模块，此时
       * A模块也会被重新打包生成，这显然是不可取的，因此需要解决，而解决方案就是runtimeChunk配置，runtimeChunk的作用就是
       * 通过将当前模块记录其它模块的hash单独打包成一个runtimeChunk文件，这个文件就会记录好之前在A模块中记录的B模块
       * 的hash值，再次修改B模块的内容时只会重新生成B模块和runtimeChunk文件，这样就能保障其他模块的缓存持久化不出问题。
       *
       * 通过将 optimization.runtimeChunk 设置为 object，对象中可以设置只有 name 属性，
       * 其中属性值可以是名称或者返回名称的函数，用于为 runtime chunks 命名。
       */
      runtimeChunk: {
        name: entrypoint => `runtimechunk~${entrypoint.name}`,
      },
    },
    /**
     * 解析模块的规则
     */
    resolve: {
      /**
       * 配置解析模块路径别名
       *
       * 优点：简写路径、减少递归解析
       * 缺点：没有代码提示（配合vscode插件+设置可以解决）、可能会导致tree-shaking失效
       *
       * 全面解释：http://webpack.wuhaolin.cn/4%E4%BC%98%E5%8C%96/4-1%E7%BC%A9%E5%B0%8F%E6%96%87%E4%BB%B6%E6%90%9C%E7%B4%A2%E8%8C%83%E5%9B%B4.html
       */
      alias: {
        '@': resolve(__dirname, 'src'),
        '@views': resolve(__dirname, 'src/views'),
        '@router': resolve(__dirname, 'src/router'),
        '@img': resolve(__dirname, 'src/assets/images'),
        '@styles': resolve(__dirname, 'src/assets/styles'),
        '@components': resolve(__dirname, 'src/components'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@request': resolve(__dirname, 'src/request'),
        '@store': resolve(__dirname, 'src/store'),
        '@types': resolve(__dirname, 'src/types'),
        '@constant': resolve(__dirname, 'src/constant'),
        '@plugins': resolve(__dirname, 'src/plugins'),
        '@directives': resolve(__dirname, 'src/directives'),
        '@theme': resolve(__dirname, 'src/theme'),
        '@mock': resolve(__dirname, 'mock'),
      },
      /**
       * 配置省略文件名的后缀规则
       *
       * 在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试询问文件是否存在，
       * 默认是extensions: ['.js', '.json']
       * 也就是说当遇到 require('./data') 这样的导入语句时，Webpack 会先去寻找 ./data.js 文件，
       * 如果该文件不存在就去寻找 ./data.json 文件，如果还是找不到就报错。
       *
       * 如果这个列表越长，或者正确的后缀在越后面，就会造成尝试的次数越多，所以 resolve.extensions 的配置也会影响到构建的性能。
       * 在配置 resolve.extensions 时你需要遵守以下几点，以做到尽可能的优化构建性能：
       *
       * 1.后缀尝试列表要尽可能的小，不要把项目中不可能存在的情况写到后缀尝试列表中。
       * 2.频率出现最高的文件后缀要优先放在最前面，以做到尽快的退出寻找过程。
       * 3.在源码中写导入语句时，要尽可能的带上后缀，从而可以避免寻找过程。例如在你确定的情况下把
       * require('./data') 写成 require('./data.json')
       */
      extensions: ['.js', '.jsx', '.vue', '.json'],
    },
    /**
     * 防止将某些import的包打包到最终的bundle中，例如jquery
     *
     * 做法：
     * 1.在webpack配置中设置externals，配置规则为【忽略的库名: npm项目包名】
     * 2.将如jquery之类的包放在cdn，在index.html中通过script引入
     *
     * 这样在代码中import $ from 'jquery'时就不会再打包jquery，
     * 并且能够正常使用jquery
     */
    externals: {
      // jquery: 'jQuery', // 拒绝jQuery被打包
    },
  },
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
      Object.assign(definitions[0], {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false', // 消除警告：Feature flag __VUE_PROD_HYDRATION_MISMATCH_DETAILS__ is not explicitly defined.
      })
      return definitions
    })
  },
  /**
   * 开发服务器devServer：用来自动化编译、自动刷新、自动打开浏览器等
   * 启动命令：webpack serve （webpack-cli推荐）
   * 特点：没有输出，只会在内存中编译
   */
  devServer: {
    // 代理url
    proxy: {
      [`^${process.env.VUE_APP_API_MODULE}`]: {
        // target: 'http://172.16.32.34:38880',
        target: 'http://10.2.161.159:38880',
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_API_MODULE}(uaa|usrc|msgc|docc|cmc|portal|abic-admin)/(.*)$`]:
            '/services/am-$1/$1/$2',
        },
      },
      [`^${process.env.VUE_APP_API_MODULE}bpm`]: {
        // target: 'http://172.16.32.34:38880',
        target: 'http://10.2.161.159:38880',
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_API_MODULE}bpm/(.*)$`]: '/services/am-flowc/flowc/$1',
        },
      },
      [`${process.env.VUE_APP_PATHNAME}tm/abic`]: {
        target: 'http://210.76.82.18/mz-portal/tm/abic',
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_PATHNAME}tm/abic`]: '',
        },
      },
    },
    compress: true, // 启动gzip压缩
    host: '0.0.0.0', // 主机地址，设置0.0.0.0之后既可以通过localhost访问，也可以通过本机ip地址访问页面，便于快速分享给UI和产品看效果
    port: 9000, // 端口号
    hot: true, // 热更新
    open: true, // 自动打开默认浏览器预览页面
    client: {
      webSocketURL: 'ws://0.0.0.0:9000/ws',
    },
  },
})
