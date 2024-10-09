<!--
 * @Description: 由于后端设计原因，所有列表中的图片都需要单独请求下载接口获取，因此做个懒请求组件来优化下性能
 * @Tips: 亲，记得补全功能描述哦~  (ღ˘⌣˘ღ)
 * @Author: Mr.Mikey
 * @Contact: 1303232158@qq.com
 * @Date: 2024-08-05 17:52:09
 * @LastEditors: Mr.Mikey
 * @LastEditTime: 2024-08-06 11:54:34
 * @FilePath: \am-portal-mobile-yzy-fe\src\components\VLazyRequestImg.vue
-->
<template>
  <div ref="iconRef" class="v-lazy-request-img">
    <!-- 由于该图片加载是异步的，要设置class样式，请使用:deep() -->
    <img v-if="isVisible" :class="imgClass" :src="iconUrl || defaultIcon" />
  </div>
</template>

<script setup name="VLazyRequestImg">
import { ref, onMounted, onUnmounted, watch, watchEffect } from 'vue'
import { useImageDownload } from '@hooks/useImageDownload.js'
const imageDownload = useImageDownload()

const props = defineProps({
  id: {
    // 文件中心id，用于下载文件，传了id就不用传fetchParams了
    type: [String, Number],
    default: '',
  },
  imgClass: {
    // 图片class
    type: String,
    default: '',
  },
  startLoad: {
    // 是否开始加载
    type: Boolean,
    default: false,
  },
  fetchParams: {
    // 请求参数，传了id则可以不传请求参数，传了fetchApi再传该参数即可
    type: Object,
    default: () => ({}),
  },
  fetchApi: {
    // 请求方法
    type: Function,
    default: undefined,
  },
})

// 定义变量
const iconRef = ref(null)
const iconUrl = ref('')
const isVisible = ref(false)
const defaultIcon = require('@img/icon-default.png')

// 加载图标
const loadIcon = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      isVisible.value = true
      observer.unobserve(iconRef.value)
    }
  })
}

// onMounted(() => {
//   // 想要加载完就开始执行，则在调用组件时传入startLoad: true
//   if (props.startLoad) {
//     const observer = new IntersectionObserver(loadIcon, {
//       root: null,
//       threshold: 0.1,
//     })

//     if (iconRef.value) {
//       observer.observe(iconRef.value)
//     }
//   }
// })

onUnmounted(() => {
  if (iconRef.value) {
    observer.unobserve(iconRef.value)
  }
})

// 对特定响应值做监听用watch
watch(isVisible, async visible => {
  if (visible) {
    // 在此请求图标的URL
    // 优先使用传入的请求方法，不传则默认调用imageDownload
    const data = await (props.fetchApi
      ? props.fetchApi(props.fetchParams)
      : imageDownload.requestAndDownload({ params: { id: props.id } }))

    iconUrl.value = data
  }
})

// 不需要明确监听哪一个响应值用watchEffect（自动对所有响应式依赖做出反应）
watchEffect(() => {
  if (props.startLoad) {
    const observer = new IntersectionObserver(loadIcon, {
      root: null,
      threshold: 0.1,
    })

    if (iconRef.value) {
      observer.observe(iconRef.value)
    }
  }
})
</script>

<style lang="scss" scoped></style>
