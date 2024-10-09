// 引入store定义函数
import { defineStore } from 'pinia'
import { getImplementInfoPaasId, getSSOLink } from '@request/commonApi.js'
import { getToken, sha256 } from '@utils/index.js'
import { useUserStore } from './user.js'

// state 类似组件的data选项，函数形式返回对象
const state = () => ({})

const getters = {}

const actions = {
  /**
   * 跳转应用单点登录
   * @param {*} params
   */
  async ssoLogin(params) {
    // 定义需要使用到的参数
    const { systemCode } = params
    // 获取userinfo
    const userinfo = useUserStore().userinfo

    const {
      user: { tifUserId, id, phone, creditNo },
    } = userinfo

    const timestamp = Date.now()
    const nonce = Math.random().toString()

    // 先从公共能力接口获取到业务系统的passid加入到getSSOLink接口的header头
    const passid = await getImplementInfoPaasId({
      systemCode,
    })
    // 再获取SSO跳转链接
    const ssoLink = await getSSOLink(
      {},
      {
        // 按接口文档拼接headers
        headers: {
          Authorization: getToken() || '', // 用户标识
          'Content-Type': 'application/json',
          'x-tsp-target': passid,
          'x-tsp-uid-type': 'tif', // 按后端要求，写死使用统一身份认证id
          'x-tsp-uid': [tifUserId || 'no', id || 'no', phone || 'no', creditNo || 'no'].join(','), // 后端要求
          'x-tsp-paasid': process.env.VUE_APP_SSO_PAASID,
          'x-tsp-signature': sha256(timestamp + process.env.VUE_APP_SSO_PAAS_TOKEN + nonce + timestamp).toUpperCase(),
          'x-tsp-timestamp': timestamp,
          'x-tsp-nonce': nonce,
        },
      }
    )

    // 返回单点登录链接
    return ssoLink
  },
}

// 创建sso模块
// 传入2个参数，定义store并导出
// 第一个参数唯一不可重复，string类型，作为仓库ID以区分仓库
// 第二个参数，以对象形式配置仓库的state,getters,actions
// 配置 state getters actions
export const useSsoStore = defineStore('sso', {
  state,
  getters,
  actions,
})
