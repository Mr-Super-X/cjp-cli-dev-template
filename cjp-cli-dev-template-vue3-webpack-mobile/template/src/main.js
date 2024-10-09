import { createApp } from 'vue'
import App from './App.vue' // 入口vue组件
import pinia from './store' // store
import router from './router' // 路由
import plugins from './plugins' // 引入全局插件（项目里自动注册的操作均由插件完成，如：自动注册全局组件、自动注册全局指令等）
import VPage from './layout/index.vue' // 引入全局公共布局组件

import 'normalize.css' // 保持各浏览器样式统一
import '@styles/css/reset.css' // 引入全局重置样式
import '@styles/css/common.css' // 引入全局公共样式
import '@styles/scss/common.scss' // 引入全局公共样式（scss）

const app = createApp(App)

app.component('VPage', VPage) // 注册全局布局组件

app.use(pinia).use(router).use(plugins).mount('#app')
