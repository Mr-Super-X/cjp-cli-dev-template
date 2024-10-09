import { Cookie, sha256 } from '@/utils/index.js'
import { thirdPartyLogin } from './commonApi.js'

/**
 * 策略模式
 * http错误处理集合，根据状态码来处理
 */
export default {
  400() {
    // 错误时返回的 message
    return '错误请求'
  },
  401() {
    handle401Error()
    // 错误时返回的 message
    return '未授权，请重新登录'
  },
  403() {
    // 错误时返回的 message
    return '拒绝访问'
  },
  404() {
    // 错误时返回的 message
    return '请求错误，未找到该资源'
  },
  405() {
    // 错误时返回的 message
    return '请求方法未允许'
  },
  408() {
    // 错误时返回的 message
    return '请求超时'
  },
  500() {
    // 错误时返回的 message
    return '服务器端出错'
  },
  501() {
    // 错误时返回的 message
    return '网络未实现'
  },
  502() {
    // 错误时返回的 message
    return '网络错误'
  },
  503() {
    // 错误时返回的 message
    return '服务不可用'
  },
  504() {
    // 错误时返回的 message
    return '网关超时'
  },
  505() {
    // 错误时返回的 message
    return 'http版本不支持该请求'
  },
}

/**
 * 处理401错误
 */
function handle401Error() {
  // 401错误时清除cookie
  Cookie.clear()

  // 如果当前运行环境为本地开发环境，则直接跳转登录页而不是调接口再跳转回调地址
  if (process.env.VUE_APP_ENV.includes('dev')) {
    // 这里不能使用vue-router跳转，useRouter是Composition API 的一部分，只能在setup函数内部调用
    location.href = '/#/login'
    return
  }

  /**
   * 调用第三方登录接口，该接口后端会判断user-agent，如果带有wxwork字符标识则表示在小程序中，
   * 会返回小程序的登录链接，如果没带则表示在浏览器环境中，会返回h5的登录页地址，
   * 由当前请求接口的域名和端口决定回调的域名端口+跳转路径
   */
  const timestamp = Date.now()
  const nonce = Math.random().toString()
  // 获取回调path
  const redirectPath = location.href
  thirdPartyLogin(
    {
      redirectUri: redirectPath,
    },
    {
      headers: {
        'x-tsp-paasid': process.env.VUE_APP_SSO_PAASID,
        'x-tsp-signature': sha256(timestamp + process.env.VUE_APP_SSO_PAAS_TOKEN + nonce + timestamp).toUpperCase(),
        'x-tsp-timestamp': timestamp,
        'x-tsp-nonce': nonce,
      },
    }
  ).then(url => {
    // 得到url并跳转
    url = url.replace(/&amp;/g, '&')
    location.href = url
  })
}
