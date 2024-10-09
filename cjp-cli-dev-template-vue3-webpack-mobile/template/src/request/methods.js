import axios from './axiosConfig.js'
import exponentialCompensation from './exponentialCompensation.js'

/**
 * axios默认请求方法
 * @param config object 配置对象，参考axios.config，文档链接：http://www.axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE
 * @returns promise 返回值与直接调用axios的返回一致，包含config、data、headers、request、status、statusText等信息，
 * 查看axios响应结构文档：http://www.axios-js.com/zh-cn/docs/#%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84
 * @example
 * import { request } from '@/request/index'
 *
 * request({
 *   url: '/api/demo',
 *   method: 'post',
 *   data: {}, // post请求传data
 *   ...,
 * }).then(res => {
 *
 * })
 */
export const request = (config = {}) => {
  const options = {
    ...config,
  }

  // 将axios进行包装
  const REQUEST = exponentialCompensation(axios)
  return REQUEST(options)
}

/**
 * get请求方法
 * @param url string 请求url 必传
 * @param params object 请求参数对象 非必传
 * @param config object 配置覆盖对象 非必传，参考axios.config，文档链接：http://www.axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE
 * @returns promise 返回值与直接调用axios的返回一致，包含config、data、headers、request、status、statusText等信息，
 * 查看axios响应结构文档：http://www.axios-js.com/zh-cn/docs/#%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84
 * @example
 * import { get } from '@/request/index'
 *
 * get('/api/demo').then(res => {})
 * get('/api/demo', params).then(res => {})
 * get('/api/demo', params, config).then(res => {})
 */
export const get = (url, params = {}, config = {}) => {
  const method = 'get'
  const options = {
    url,
    params, // get请求传params，参数会拼在url后面，必须是一个无格式对象(plain object)或 URLSearchParams 对象
    ...config,
  }

  const GET = exponentialCompensation(axios.get, method)
  return GET(options)
}

/**
 * post请求方法
 * @param url string 请求url 必传
 * @param data object 请求参数对象 非必传
 * @param config object 配置覆盖对象 非必传，参考axios.config，文档链接：http://www.axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE
 * @returns promise 返回值与直接调用axios的返回一致，包含config、data、headers、request、status、statusText等信息，
 * 查看axios响应结构文档：http://www.axios-js.com/zh-cn/docs/#%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84
 * @example
 * import { post } from '@/request/index'
 *
 * post('/api/demo').then(res => {})
 * post('/api/demo', data).then(res => {})
 * post('/api/demo', data, config).then(res => {})
 */
export const post = (url, data = {}, config = {}) => {
  const method = 'post'
  const options = {
    url,
    data,
    ...config,
  }

  const POST = exponentialCompensation(axios.post, method)
  return POST(options)
}

/**
 * put请求方法
 * @param url string 请求url 必传
 * @param data object 请求参数对象 非必传
 * @param config object 配置覆盖对象 非必传，参考axios.config，文档链接：http://www.axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE
 * @returns promise 返回值与直接调用axios的返回一致，包含config、data、headers、request、status、statusText等信息，
 * 查看axios响应结构文档：http://www.axios-js.com/zh-cn/docs/#%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84
 * @example
 * import { put } from '@/request/index'
 *
 * put('/api/demo').then(res => {})
 * put('/api/demo', data).then(res => {})
 * put('/api/demo', data, config).then(res => {})
 */
export const put = (url, data = {}, config = {}) => {
  const method = 'put'
  const options = {
    url,
    data,
    ...config,
  }

  const PUT = exponentialCompensation(axios.put, method)
  return PUT(options)
}

/**
 * delete请求方法
 * @description delete是系统关键字，因此用了deletes来重命名
 * @param url string 请求url 必传
 * @param params object 请求参数对象 非必传
 * @param config object 配置覆盖对象 非必传，参考axios.config，文档链接：http://www.axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE
 * @returns promise 返回值与直接调用axios的返回一致，包含config、data、headers、request、status、statusText等信息，
 * 查看axios响应结构文档：http://www.axios-js.com/zh-cn/docs/#%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84
 * @example
 * import { deletes } from '@/request/index'
 *
 * deletes('/api/demo').then(res => {})
 * deletes('/api/demo', params).then(res => {})
 * deletes('/api/demo', params, config).then(res => {})
 */
export const deletes = (url, params = {}, config = {}) => {
  const method = 'delete'
  const options = {
    url,
    params,
    ...config,
  }

  const DELETE = exponentialCompensation(axios.delete, method)
  return DELETE(options)
}

/**
 * head请求方法
 * @param url string 请求url 必传
 * @param params object 请求参数对象 非必传
 * @param config object 配置覆盖对象 非必传，参考axios.config，文档链接：http://www.axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE
 * @returns promise 返回值与直接调用axios的返回一致，包含config、data、headers、request、status、statusText等信息，
 * 查看axios响应结构文档：http://www.axios-js.com/zh-cn/docs/#%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84
 * @example
 * import { head } from '@/request/index'
 *
 * head('/api/demo').then(res => {})
 * head('/api/demo', params).then(res => {})
 * head('/api/demo', params, config).then(res => {})
 */
export const head = (url, params = {}, config = {}) => {
  const method = 'head'
  const options = {
    url,
    params,
    ...config,
  }

  const HEAD = exponentialCompensation(axios.head, method)
  return HEAD(options)
}

/**
 * options请求方法
 * @param url string 请求url 必传
 * @param params object 请求参数对象 非必传
 * @param config object 配置覆盖对象 非必传，参考axios.config，文档链接：http://www.axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE
 * @returns promise 返回值与直接调用axios的返回一致，包含config、data、headers、request、status、statusText等信息，
 * 查看axios响应结构文档：http://www.axios-js.com/zh-cn/docs/#%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84
 * @example
 * import { options } from '@/request/index'
 *
 * options('/api/demo').then(res => {})
 * options('/api/demo', params).then(res => {})
 * options('/api/demo', params, config).then(res => {})
 */
export const options = (url, params = {}, config = {}) => {
  const method = 'options'
  const options = {
    url,
    params,
    ...config,
  }

  const OPTIONS = exponentialCompensation(axios.options, method)
  return OPTIONS(options)
}

/**
 * patch请求方法
 * @param url string 请求url 必传
 * @param data object 请求参数对象 非必传
 * @param config object 配置覆盖对象 非必传，参考axios.config，文档链接：http://www.axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE
 * @returns promise 返回值与直接调用axios的返回一致，包含config、data、headers、request、status、statusText等信息，
 * 查看axios响应结构文档：http://www.axios-js.com/zh-cn/docs/#%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84
 * @example
 * import { patch } from '@/request/index'
 *
 * patch('/api/demo').then(res => {})
 * patch('/api/demo', data).then(res => {})
 * patch('/api/demo', data, config).then(res => {})
 */
export const patch = (url, data = {}, config = {}) => {
  const method = 'patch'
  const options = {
    url,
    data, // get请求传params，参数会拼在url后面，必须是一个无格式对象(plain object)或 URLSearchParams 对象
    ...config,
  }

  const PATCH = exponentialCompensation(axios.patch, method)
  return PATCH(options)
}
