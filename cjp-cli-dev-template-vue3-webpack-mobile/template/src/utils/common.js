// 只放全局使用的公共util，一般是写好了就很少再去修改的方法放在这，否则建议放在hooks中
import { showToast } from 'vant'
import 'vant/lib/toast/style/index.js'
import { Cookie } from './storage.js'

/**
 * 获取token
 * @returns string
 */
export function getToken() {
  const token = Cookie.get('TSP-PORTAL-WEB-TOEKN')
  // 后端规定Authorization字段必传，就算没有内容也必须要有空字符串，否则接口会报错
  return token || ''
}

/**
 * 设置token
 * @returns
 */
export function setToken(token) {
  Cookie.set('TSP-PORTAL-WEB-TOEKN', token)
}

/**
 * 判断是否在粤政易app中打开页面
 * @returns {boolean}
 */
export function isInYzyApp() {
  return window.navigator.userAgent.includes('wxwork')
}

/**
 * 验证环境变量
 * @param env .env.xxx中自定义的VUE_APP_ENV变量
 * @returns boolean
 */
export function verifyENV(env) {
  return [env].includes(process.env?.VUE_APP_ENV)
}

/**
 * 显示vant toast
 * @param {*} msg 弹出的文字信息
 * @param {*} options vant toast配置
 */
export function toast(msg, options = {}) {
  const defaultConfig = Object.assign(
    {},
    {
      message: msg,
      position: 'center',
    },
    options
  )

  showToast(defaultConfig)
}

/**
 * 获取文件名
 * @param pathStr string 格式如：/src/components/Demo.vue
 * @param ext boolean 默认false，不带后缀，开启后返回带后缀的文件名
 * @returns string 返回Demo.vue | Demo
 * @example
 * getFilename('/src/components/Demo.vue')
 * getFilename('/src/components/Demo.vue', true)
 */
export function getFilename(pathStr, ext = false) {
  if (ext) {
    return pathStr.replace(/[^/]*[/]+/g, '')
  } else {
    return pathStr.replace(/(.*\/)*([^.]+).*/gi, '$2')
  }
}

/**
 * 对象深克隆
 * @param obj 源对象
 * @returns 克隆后的对象
 */
export function deepClone(obj) {
  let newObj
  try {
    newObj = Array.isArray(obj) ? [] : {}
  } catch (error) {
    newObj = {}
  }
  for (let attr in obj) {
    if (obj[attr] && typeof obj[attr] === 'object') {
      newObj[attr] = deepClone(obj[attr])
    } else {
      newObj[attr] = obj[attr]
    }
  }
  return newObj
}

/**
 * 判断两个对象是否相同
 * @param a 要比较的对象一
 * @param b 要比较的对象二
 * @returns 相同返回 true，反之则反
 */
export function isObjectValueEqual(a, b) {
  if (!a || !b) return false
  let aProps = Object.getOwnPropertyNames(a)
  let bProps = Object.getOwnPropertyNames(b)
  if (aProps.length != bProps.length) return false
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i]
    let propA = a[propName]
    let propB = b[propName]
    if (!b.hasOwnProperty(propName)) return false
    if (propA instanceof Object) {
      if (!isObjectValueEqual(propA, propB)) return false
    } else if (propA !== propB) {
      return false
    }
  }
  return true
}

/**
 * 转换对象为formData
 * @param {*} obj
 * @returns formData
 */
export function transformObjToFormData(obj) {
  const formData = new FormData()
  Object.keys(obj).forEach(key => {
    formData.append(key, obj[key])
  })
  return formData
}

/**
 * 获取url参数
 * @param {*} param 参数名称
 * @returns 参数值
 */
export function getUrlSearchParams(param) {
  const search = location.search
  const params = new URLSearchParams(search)
  const value = params.get(param) || ''

  return value
}
