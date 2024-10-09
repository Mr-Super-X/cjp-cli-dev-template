// 导出当前页面的路由配置
export default [
  {
    path: '/home', // 路由访问路径（'/' + '路由名'）
    name: 'home', // 路由组件名称
    component: () => import(/* webpackChunkName: "home" */ './index.vue'), // 按需引入组件，提高首屏加载速度
    meta: {
      title: '智慧水利', // 路由中文名称
    },
  },
]
