// 存放当前页面的请求api配置
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { get, post } from '@/request/methods'
import { API_MODULE_PATHS } from '@/constant'

/**
 * 获取菜单
 * @param params object 请求参数对象 非必传
 * @param config object 配置覆盖对象，AxiosRequestConfig 非必传
 * @returns Promise
 */
export function getMenu(params?: object, config?: AxiosRequestConfig): Promise<any> {
  return get(API_MODULE_PATHS.SYSTEM + '/menu', params, config).then((res: AxiosResponse) => res?.data?.data)
}

/**
 * 测试post方法
 * @param data object 请求参数对象
 * @param config object AxiosRequestConfig
 * @returns Promise
 */
export function postMenuTest(data?: object, config?: AxiosRequestConfig): Promise<any> {
  return post(API_MODULE_PATHS.SYSTEM + '/test', data, config)
}
