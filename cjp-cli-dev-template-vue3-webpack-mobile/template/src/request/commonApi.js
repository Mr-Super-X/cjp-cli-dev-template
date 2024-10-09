// 存放公共模块的请求api配置
import { request } from './index.js'
import { toast } from '@utils/index.js'

// 获取用户信息：http://172.16.32.34:38880/wr-admin/tm/usrc/doc.html#/default/Level:%20Normal/getUserUsingGET
export function getUserinfo(params = {}, options = {}) {
  const config = {
    url: '/usrc/user/getUser',
    method: 'get',
    params,
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

// 获取当前登录人的信息（是否首次登录）：http://172.16.32.34:38880/wr-admin/tm/uaa/doc.html#/default/%E5%AE%89%E5%85%A8%E6%8E%A5%E5%8F%A3/currentUserUsingGET
export function getUser(params = {}, options = {}) {
  const config = {
    url: '/uaa/auth/user',
    method: 'get',
    params,
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

// 查询系统paasid：http://172.16.32.34:38802/usrc/doc.html#/default/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/findRoleSystemListUsingPOST
export function getImplementInfoPaasId(params = {}, options = {}) {
  const config = {
    url: '/abic-admin/abic-implement-info/getImplementInfoPaasId',
    method: 'get',
    params,
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

// 查询单点登录链接：http://172.16.32.34:38802/usrc/doc.html#/default/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/findRoleSystemListUsingPOST
export function getSSOLink(params = {}, options = {}) {
  const config = {
    url: '/uaa/social/sso',
    method: 'get',
    params,
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

// 第三方登录：http://172.16.32.34:38880/wr-admin/tm/uaa/doc.html#/default/%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95%E6%8E%A5%E5%8F%A3/renderAuthUsingGET
export function thirdPartyLogin(params = {}, options = {}) {
  const config = {
    url: `/uaa/social/login/${'yzy_silent'}`, // 粤政易写死yzy_silent，其它两粤分别有自己的标识
    method: 'get',
    params,
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

// 注销登录：http://172.16.32.34:38880/wr-admin/tm/uaa/doc.html#/default/%E5%AE%89%E5%85%A8%E6%8E%A5%E5%8F%A3/logoutUsingGET
export function logout(params = {}, options = {}) {
  const config = {
    url: '/uaa/auth/logout',
    method: 'get',
    params,
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
