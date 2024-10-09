import allRoutes from './dynamicRoutes.js' // 自动化动态引入所有路由
import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken, setToken } from '@utils/index.js'

// 路由数组配置
const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  ...allRoutes,
]

/**
 * 创建一个可以被 Vue 应用程序使用的路由实例
 * @method createRouter(options: RouterOptions): Router
 * @link 参考：https://next.router.vuejs.org/zh/api/#createrouter
 */
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 如果页面已经有了滚动位置，则保持它
      return savedPosition
    } else {
      // 如果没有滚动位置，则返回顶部
      return { top: 0 }
    }
  },
})

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  /**
   * 业务流程是在粤政易小程序中首次打开时进入首页home（不会带token），然后触发接口401，
   * 调用第三方登录接口得到回调地址，此时的回调地址中带有token，将该url中的token保存到cookie中。
   * 如果是网页中直接访问页面，则会在登录接口中直接将token设置到cookie中。
   * 同理，如果在网页中访问页面url后面带了token，也能直接访问。
   */
  const urlToken = to.query.token // 路由守卫中使用location.search拿不到数据，需要使用to来获取
  // 如果url中存在token，则保存到cookie中
  if (urlToken) setToken(urlToken)
  // 从cookie中获取token
  const token = getToken()

  // 判断是否前往登录页
  const isLoginPage = to.path === '/login'

  // 有token的处理分支
  if (token) {
    // 如果已登录并尝试访问登录页，重定向到首页
    if (isLoginPage) {
      return next('/home')
    }
    // 否则允许访问其他页面
    return next()
  }

  // 无 token 的处理
  // 继续访问页面，当页面调用接口401之后会自动重定向到登录页
  next()
})

export default router
