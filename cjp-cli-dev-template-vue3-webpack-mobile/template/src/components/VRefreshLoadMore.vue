<template>
  <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
    <van-list v-if="isStartLoad" v-model="isLoadingMore" :finished="finished" @load="onLoad">
      <van-cell v-for="item in list" :key="item.id">
        <!-- 插入自定义内容 -->
        <slot :row="item"></slot>
      </van-cell>
      <van-empty v-if="list.length === 0 && !isRefreshing" description="暂无数据" />
    </van-list>
  </van-pull-refresh>
</template>

<script setup name="VRefreshLoadMore">
import { watch } from 'vue'
import { usePullRefreshLoadMore } from '@hooks/usePullRefreshLoadMore.js'

const emits = defineEmits(['onRefresh'])

const props = defineProps({
  request: {
    // 请求方法
    type: Function,
    default: () => () => {},
  },
  queryParams: {
    // 请求参数
    type: Object,
    default: () => ({}),
  },
  isStartLoad: {
    // 是否开始加载数据，默认true
    // 由于请求参数可能是异步得到的，而van-list在初始检测到页面没有数据就会进行请求，所以这里特殊处理一下
    type: Boolean,
    default: true,
  },
})

const { list, total, isRefreshing, isLoadingMore, finished, onRefresh, onLoad } = usePullRefreshLoadMore(
  props.request,
  props.queryParams
)

// 将属性暴露出去
defineExpose({
  list,
  total,
  isRefreshing,
  isLoadingMore,
  finished,
  onRefresh,
  onLoad,
})

// 监听到请求参数发生变化重新请求数据
watch(
  () => props.queryParams,
  async (newParams, oldParams) => {
    // 检查新数据不等于旧数据
    if (JSON.stringify(newParams) !== JSON.stringify(oldParams)) {
      await onRefresh(newParams)
      emits('onRefresh')
    }
  }
)
</script>

<style lang="scss" scoped></style>
