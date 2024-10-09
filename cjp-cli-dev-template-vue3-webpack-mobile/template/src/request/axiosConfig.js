// axios配置文件

import axios from 'axios'
import qs from 'qs'
import { getToken } from '@/utils/index.js'
import httpErrorHandle from './httpErrorHandle'

// baseUrl
const baseURL = () => {
  return process.env.VUE_APP_API_MODULE
}

// axios配置
// 文档：http://www.axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE
const config = {
  // `url` 是用于请求的服务器 URL
  url: '',

  // `method` 是创建请求时使用的方法
  method: 'get', // default

  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: baseURL(),

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  // transformRequest: [
  //   function (data, headers) {
  //     // 对 data 进行任意转换处理
  //     // return data instanceof FormData ? data : qs.stringify(data, { arrayFormat: 'indices' })
  //     // return JSON.stringify(data)
  //   },
  // ],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  // transformResponse: [
  //   function (data) {
  //     // 对 data 进行任意转换处理
  //     return JSON.parse(data)
  //   },
  // ],

  // `headers` 是即将被发送的自定义请求头
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'Content-Type': 'application/json',
  },

  // `params` 是即将与请求一起发送的 URL 参数
  // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  params: {},

  // `paramsSerializer` 是一个负责 `params` 序列化的函数
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function (params) {
    // indices: false 将数组参数格式化成a=xx&a=xx
    return qs.stringify(params, { indices: false })
    // return qs.stringify(params, { arrayFormat: 'brackets' })
  },

  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  // 在没有设置 `transformRequest` 时，必须是以下类型之一：
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属：FormData, File, Blob
  // - Node 专属： Stream
  data: {},

  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
  // 如果请求话费了超过 `timeout` 的时间，请求将被中断
  timeout: 3000,

  // `withCredentials` 表示跨域请求时是否需要在请求中携带cookie
  withCredentials: false, // default

  // `adapter` 允许自定义处理请求，以使测试更轻松
  // 返回一个 promise 并应用一个有效的响应 (查阅 [response docs](#response-api)).
  // adapter: function (config: any) {

  // },

  // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
  // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
  // auth: {},

  // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default

  // `responseEncoding` 表示用于解码响应数据的编码
  // 注意：忽略"stream"或客户端请求的"responseType"
  responseEncoding: 'utf8', // default

  // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` 是携带 xsrf token 值的 http 标头的名称
  xsrfHeaderName: 'X-XSRF-TOKEN', // default

  // `onUploadProgress` 允许为上传处理进度事件
  // 注意：配置中不能使用这个函数，否则会导致mock环境下报错
  // TypeError: request.upload.addEventListener is not a function
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` 允许为下载处理进度事件
  onDownloadProgress: function (progressEvent) {
    // 对原生进度事件的处理
  },

  // `maxContentLength` 定义允许的响应内容的最大尺寸
  maxContentLength: undefined,

  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
  validateStatus: function (status) {
    return status >= 200 && status < 300 // default
  },

  // `maxRedirects` 定义在 node.js 中 follow 的最大重定向数目
  // 如果设置为0，将不会 follow 任何重定向
  maxRedirects: 5, // default

  // `socketPath` 定义要在 node.js 中使用的 UNIX 套接字
  // 例如 '/var/run/docker.sock' 向 docker 守护进程发送请求
  // 只能指定 `socketPath` 或 `proxy`
  // 如果两者都指定，则使用 `socketPath`
  socketPath: null, // default

  // `httpAgent` 和 `httpsAgent` 分别在 node.js 中用于定义在执行 http 和 https 时使用的自定义代理。允许像这样配置选项：
  // `keepAlive` 默认没有启用
  // httpAgent: new http.Agent({ keepAlive: true }),
  // httpsAgent: new https.Agent({ keepAlive: true }),

  // 'proxy' 定义代理服务器的主机名称和端口
  // `auth` 表示 HTTP 基础验证应当用于连接代理，并提供凭据
  // 这将会设置一个 `Proxy-Authorization` 头，覆写掉已有的通过使用 `header` 设置的自定义 `Proxy-Authorization` 头。
  // proxy: {
  // host: '127.0.0.1',
  // port: 9000,
  // auth: {
  //   username: '',
  //   password: ''
  // }
  // },

  // `cancelToken` 指定用于取消请求的 cancel token
  // 文档：http://www.axios-js.com/zh-cn/docs/#%E5%8F%96%E6%B6%88
  // cancelToken: new CancelToken(function (cancel) {
  // })
}

// 创建axios实例
const instance = axios.create(config)

// 请求拦截
// config 代表发起请求的参数的实体
instance.interceptors.request.use(
  config => {
    // 由于token是在点击登录之后设置的（异步），每次请求前再获取，这样无论token何时更新都能正确添加到请求头中
    const token = getToken()
    // 如果Authorization已存在，说明存在自定义Auth（如获取验证码会传rsa加密内容），否则默认使用token作为Authorization
    const isAuthorization = config.headers.Authorization
    config.headers.Authorization = isAuthorization || token

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
    if (error?.response) {
      const httpStatusCode = error.response.status
      // 获取 http 状态码错误处理对应的消息
      const result = httpErrorHandle[httpStatusCode] && httpErrorHandle[httpStatusCode]()
      const message = result || '未知错误'
      error.message = message

      window.console.error(error.message) // 服务器响应类用error弹出错误信息
    }

    return Promise.reject(error)
  }
)

export default instance
