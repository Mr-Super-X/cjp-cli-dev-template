// 引入store定义函数
import { defineStore } from 'pinia'
import { Local } from '@utils/index'
// state 类似组件的data选项，函数形式返回对象
const state = () => ({
  searchHistories: [], // 搜索历史记录
})

const getters = {}

const actions = {
  getSearchHistories() {
    const localHistories = Local.get('searchHistories') || []
    // 优先使用缓存数据
    if (localHistories.length > 0) {
      this.searchHistories = localHistories // 读取缓存时将数据加载到store中
      return localHistories
    } else {
      return this.searchHistories
    }
  },
  setSearchHistories(keyword) {
    // 简单去重
    const histories = this.getSearchHistories()
    if (histories.includes(keyword)) return
    // 最多20条历史记录，超过则删除最后一条
    if (this.searchHistories.length >= 20) {
      this.searchHistories.pop()
    }
    // 然后插入新的搜索记录
    this.searchHistories.unshift(keyword)
    Local.set('searchHistories', this.searchHistories)
  },
  clearSearchHistories() {
    this.searchHistories = []
    Local.remove('searchHistories')
  },
}

// 创建history模块
// 传入2个参数，定义store并导出
// 第一个参数唯一不可重复，string类型，作为仓库ID以区分仓库
// 第二个参数，以对象形式配置仓库的state,getters,actions
// 配置 state getters actions
export const useHistoryStore = defineStore('history', {
  state,
  getters,
  actions,
})
