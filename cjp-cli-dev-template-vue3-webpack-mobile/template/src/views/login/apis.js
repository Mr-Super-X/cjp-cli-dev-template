// 存放当前页面的请求api配置
import { request } from '@/request/index.js'
import { toast } from '@utils/index.js'

// 登录：http://172.16.32.34:38880/wr-admin/tm/uaa/doc.html#/default/%E5%AE%89%E5%85%A8%E6%8E%A5%E5%8F%A3/loginUsingPOST
export function login(data = {}, options = {}) {
  const config = {
    url: '/uaa/auth/login',
    method: 'post',
    data,
    ...options,
  }
  return request(config)
    .then(res => {
      if (res?.data?.code === 200) {
        return res?.data?.data
      } else {
        return Promise.reject(res?.data?.message)
      }
    })
    .catch(e => {
      toast(e)
    })
}

// 获取验证码：http://172.16.32.34:38880/wr-admin/tm/uaa/doc.html#/default/%E5%AE%89%E5%85%A8%E6%8E%A5%E5%8F%A3/captchaUsingGET
export function getQrCode(params = {}, options = {}) {
  const config = {
    url: '/uaa/auth/captcha',
    method: 'get',
    params,
    ...options,
  }
  return request(config)
    .then(res => {
      const data = {
        key: res.headers['captcha-key'], // 登录接口需要这个key
        data: res?.data,
      }
      return data
    })
    .catch(e => {
      toast(e)
    })
}
