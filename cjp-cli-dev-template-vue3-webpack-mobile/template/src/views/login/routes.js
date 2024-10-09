// 导出当前页面的路由配置
export default [
  {
    path: '/login', // 路由访问路径（'/' + '路由名'）
    name: 'login', // 路由组件名称
    component: () => import(/* webpackChunkName: "login" */ './index.vue'), // 按需引入组件，提高首屏加载速度
    meta: {
      title: '登录', // 路由中文名称
    },
  },
]
