import Cookies from 'js-cookie'

/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
export const Local = {
  // 设置永久缓存
  set(key, val) {
    window.localStorage.setItem(key, JSON.stringify(val))
  },
  // 获取永久缓存
  get(key) {
    let json = window.localStorage.getItem(key)
    return JSON.parse(json)
  },
  // 移除永久缓存
  remove(key) {
    window.localStorage.removeItem(key)
  },
  // 移除全部永久缓存
  clear() {
    window.localStorage.clear()
  },
}

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
  // 设置临时缓存
  set(key, val) {
    window.sessionStorage.setItem(key, JSON.stringify(val))
  },
  // 获取临时缓存
  get(key) {
    let json = window.sessionStorage.getItem(key)
    return JSON.parse(json)
  },
  // 移除临时缓存
  remove(key) {
    window.sessionStorage.removeItem(key)
  },
  // 移除全部临时缓存
  clear() {
    window.sessionStorage.clear()
  },
}

/**
 * cookies
 * @method set 设置cookie
 * @method get 获取cookie
 * @method remove 移除cookie
 * @method clear 移除全部cookie
 */
export const Cookie = {
  // 设置cookies
  set(key, val, options) {
    Cookies.set(key, val, options)
  },
  // 获取cookies
  get(key) {
    return Cookies.get(key)
  },
  // 移除cookies
  remove(key, options) {
    Cookies.remove(key, options)
  },
  // 移除全部cookies
  clear() {
    clearCookies()
  },
}

/**
 * 清除所有cookie
 */
export function clearCookies() {
  document.cookie.split(';').forEach(c => {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
  })
}
