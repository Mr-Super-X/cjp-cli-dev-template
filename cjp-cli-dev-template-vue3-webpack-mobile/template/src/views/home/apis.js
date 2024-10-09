// 存放当前页面的请求api配置
import { request } from '@/request/index.js'
import { toast, transformObjToFormData } from '@utils/index.js'

// 查询当前登录人接收的消息数量：http://172.16.32.34:38880/wr-portal/tm/msgc/doc.html#/default/%E6%B6%88%E6%81%AF%E7%AE%A1%E7%90%86/querySucceedMsgCountUsingPOST
export function querySucceedMsgCount(data = {}, options = {}) {
  const config = {
    url: '/msgc/msg/querySucceedMsgCount',
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

// 查询我的公告列表：http://172.16.32.34:38880/wr-portal/tm/portal/doc.html#/default/%E9%80%9A%E7%9F%A5%E5%85%AC%E5%91%8A%E7%AE%A1%E7%90%86/findMyListUsingPOST
export function findMyList(data = {}, options = {}) {
  const config = {
    url: '/portal/portal-notice/findMyList',
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

// 更新公告阅读状态：http://172.16.32.34:38880/wr-portal/tm/portal/doc.html#/default/%E9%80%9A%E7%9F%A5%E5%85%AC%E5%91%8A%E7%AE%A1%E7%90%86/updateReadStatusUsingPOST
export function updateReadStatus(data = {}, options = {}) {
  const config = {
    url: '/portal/portal-notice/updateReadStatus',
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

// 查询常用应用接口：http://172.16.32.34:38802/usrc/doc.html#/default/%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F/findRoleSystemListUsingPOST
export function getUseApplications(data = {}, options = {}) {
  // 这个接口长得丑些，硬要formData
  const formData = transformObjToFormData(data)

  const config = {
    url: '/usrc/system/findRoleSystemList',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
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

// 测试不登录请求接口
export function demoGetTreeList(data = {}, options = {}) {
  const config = {
    url: '/usrc/api/dictDetail/treeList',
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

// 查询待办数量：http://172.16.32.34:38880/wr-admin/tm/portal/doc.html#/default/%E9%97%A8%E6%88%B7%E5%BE%85%E5%8A%9E%E4%BA%8B%E9%A1%B9%E4%BF%A1%E6%81%AF/pageUsingPOST_9
export function queryTodoCount(data = {}, options = {}) {
  const config = {
    url: '/portal/task/countByCondition',
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
