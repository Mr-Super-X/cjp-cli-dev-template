// 引入store定义函数
import { defineStore } from 'pinia'
import { getUser } from '@request/commonApi.js'

// state 类似组件的data选项，函数形式返回对象
const state = () => ({
  userinfo: {},
})

const getters = {}

const actions = {
  /**
   * 获取用户信息并存储
   * @param  {...any} args 参数透传
   */
  async fetchUserinfo(...args) {
    const data = await getUser(...args)

    this.userinfo = data

    return data
  },
}

// 创建user模块
// 传入2个参数，定义store并导出
// 第一个参数唯一不可重复，string类型，作为仓库ID以区分仓库
// 第二个参数，以对象形式配置仓库的state,getters,actions
// 配置 state getters actions
export const useUserStore = defineStore('user', {
  state,
  getters,
  actions,
})
