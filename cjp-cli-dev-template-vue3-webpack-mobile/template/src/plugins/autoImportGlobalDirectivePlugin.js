// 自动导入@directives目录下的所有指令文件并全局注册
const requireComponents = require.context('@directives', true, /\.js$/)

const autoImportGlobalDirectivePlugin = {
  install(Vue) {
    requireComponents.keys().forEach(directive => {
      // 获取指令实例
      const Directive = requireComponents(directive).default

      // 注册全局指令
      Vue.use(Directive)
    })
  },
}

export default autoImportGlobalDirectivePlugin
