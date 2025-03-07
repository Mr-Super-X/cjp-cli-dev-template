import axios from './axiosConfig'
import type { AxiosRequestConfig } from 'axios'
import windowIt from './windowIt'
import { WINDOW_IT_TIME } from '@constant/index'

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
export const request = (config: AxiosRequestConfig) => {
  const options: AxiosRequestConfig = {
    ...config,
  }

  // 将axios进行包装
  const REQUEST = windowIt(axios, WINDOW_IT_TIME)
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
export const get = (url: string, params?: object, config?: AxiosRequestConfig) => {
  const method = 'get'
  const options: AxiosRequestConfig = {
    url,
    params, // get请求传params，参数会拼在url后面，必须是一个无格式对象(plain object)或 URLSearchParams 对象
    ...config,
  }

  const GET = windowIt(axios.get, WINDOW_IT_TIME, method)
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
export const post = (url: string, data?: object, config?: AxiosRequestConfig) => {
  const method = 'post'
  const options: AxiosRequestConfig = {
    url,
    data,
    ...config,
  }

  const POST = windowIt(axios.post, WINDOW_IT_TIME, method)
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
export const put = (url: string, data?: object, config?: AxiosRequestConfig) => {
  const method = 'put'
  const options: AxiosRequestConfig = {
    url,
    data,
    ...config,
  }

  const PUT = windowIt(axios.put, WINDOW_IT_TIME, method)
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
export const deletes = (url: string, params?: object, config?: AxiosRequestConfig) => {
  const method = 'delete'
  const options: AxiosRequestConfig = {
    url,
    params,
    ...config,
  }

  const DELETE = windowIt(axios.delete, WINDOW_IT_TIME, method)
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
export const head = (url: string, params?: object, config?: AxiosRequestConfig) => {
  const method = 'head'
  const options: AxiosRequestConfig = {
    url,
    params,
    ...config,
  }

  const HEAD = windowIt(axios.head, WINDOW_IT_TIME, method)
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
export const options = (url: string, params?: object, config?: AxiosRequestConfig) => {
  const method = 'options'
  const options: AxiosRequestConfig = {
    url,
    params,
    ...config,
  }

  const OPTIONS = windowIt(axios.options, WINDOW_IT_TIME, method)
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
export const patch = (url: string, data?: object, config?: AxiosRequestConfig) => {
  const method = 'patch'
  const options: AxiosRequestConfig = {
    url,
    data, // get请求传params，参数会拼在url后面，必须是一个无格式对象(plain object)或 URLSearchParams 对象
    ...config,
  }

  const PATCH = windowIt(axios.patch, WINDOW_IT_TIME, method)
  return PATCH(options)
}
