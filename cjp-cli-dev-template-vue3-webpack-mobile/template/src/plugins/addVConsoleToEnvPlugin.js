import VConsole from 'vconsole'

// 给匹配环境添加vconsole调试工具
const envs = ['test']

/**
 * 给匹配环境添加vconsole调试工具插件
 */
const addVConsoleToEnvPlugin = {
  install(vue, options) {
    if (envs.includes(process.env.VUE_APP_ENV)) {
      const vConsole = new VConsole()
      window.console = vConsole.log
    }
  },
}

export default addVConsoleToEnvPlugin
