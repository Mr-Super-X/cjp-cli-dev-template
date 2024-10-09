import { ref } from 'vue'
import { PAGE, PAGE_SIZE } from '@constant/pagination'
import { toast } from '@utils/index'

/**
 * 通用上拉加载、下拉刷新方法
 * @param {*} requestFn 请求方法 必传
 * @param {*} queryParams 请求参数 非必传
 * @returns
 * @example
 * import { usePullRefreshLoadMore } from '@hooks/usePullRefreshLoadMore.js'
 *
 * const queryParams = {} // 要增加的参数
 *
 * const {
 * 	 list,
 * 	 total,
 * 	 isRefreshing,
 *   isLoadingMore,
 *   finished,
 *   onLoad,
 *   onRefresh,
 * 	 page,
 * 	 pageSize,
 * 	 fetchData,
 * } = usePullRefreshLoadMore(api, queryParams)
 */
export const usePullRefreshLoadMore = (requestFn, queryParams = {}) => {
  // 当前页
  const page = ref(PAGE)
  // 分页规格
  const pageSize = ref(PAGE_SIZE)
  // 总数量
  const total = ref(0)
  // 数据
  const list = ref([])
  // 是否为刷新数据
  const isRefreshing = ref(false)
  // 是否为加载更多数据
  const isLoadingMore = ref(false)
  // 无更多数据
  const finished = ref(false)
  // 请求参数缓存，防止加载更多数据时参数丢失
  const queryParamsCache = ref(queryParams)

  // 请求数据方法，可以在单独导入fetchData传参
  const fetchData = (params = {}) => {
    // 请求参数响应式更新
    queryParamsCache.value = { ...queryParamsCache.value, ...params }

    const query = Object.assign(
      // 默认查询参数
      {
        page: page.value,
        size: pageSize.value,
      },
      queryParamsCache.value,
      {}
    )

    // 请求方法
    return requestFn(query)
      .then(data => {
        const newData = data?.records || []

        if (page.value === 1) {
          list.value = newData
        } else {
          list.value = [...list.value, ...newData]
        }

        total.value = data?.total // 记录总数量，考虑到可能在PC端同步删除了，这里需要实时获取
        finished.value = newData.length < PAGE_SIZE // 最后一页加载完成，将状态置为已完成
      })
      .catch(error => {
        toast('加载数据失败：', error)
      })
      .finally(() => {
        // 请求成功后重置状态
        isRefreshing.value = false
        isLoadingMore.value = false
      })
  }

  // 下拉刷新
  const onRefresh = (query = {}) => {
    isRefreshing.value = true // 设置刷新标记为true
    page.value = PAGE // 重置查询参数为起始页
    list.value = [] // 刷新时先清空，防止显示错误

    return fetchData(query)
  }

  // 上拉加载更多
  const onLoad = (query = {}) => {
    if (isLoadingMore.value || finished.value) return
    isLoadingMore.value = true // 重置加载状态为true
    page.value++ // 分页加1

    return fetchData(query)
  }

  return {
    list,
    total,
    page,
    pageSize,
    isRefreshing,
    isLoadingMore,
    finished,
    fetchData,
    onRefresh,
    onLoad,
  }
}
