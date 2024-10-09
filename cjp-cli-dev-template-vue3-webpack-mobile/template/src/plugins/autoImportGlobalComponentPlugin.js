// 自动导入@components目录下的所有vue组件并全局注册
const requireComponents = require.context('@components', true, /\.vue$/)

const autoImportGlobalComponentPlugin = {
  install(Vue) {
    requireComponents.keys().forEach(component => {
      // 获取组件实例
      const Component = requireComponents(component).default

      // 获取组件文件名，例如 MyComponent.vue => MyComponent
      const componentName = component
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')

      // 注册全局组件
      Vue.component(componentName, Component)
    })
  },
}

export default autoImportGlobalComponentPlugin
