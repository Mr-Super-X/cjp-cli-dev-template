import remAdaptationPlugin from './remAdaptationPlugin'
import autoImportGlobalComponentPlugin from './autoImportGlobalComponentPlugin'
import autoImportGlobalDirectivePlugin from './autoImportGlobalDirectivePlugin'
import addVConsoleToEnvPlugin from './addVConsoleToEnvPlugin'

// 暴露一个install方法，在use该方法时会自动传入app、options
// 可以使用app.use来注册插件
const install = (app, options) => {
  app.use(remAdaptationPlugin) // rem适配插件
  app.use(autoImportGlobalComponentPlugin) // 自动导入并注册全局组件插件
  app.use(autoImportGlobalDirectivePlugin) // 自动导入并注册全局指令插件
  app.use(addVConsoleToEnvPlugin) // 给匹配环境添加vconsole调试工具插件
}

export default install
