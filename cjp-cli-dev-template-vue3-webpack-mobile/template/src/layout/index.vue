<!--
 * @Description: 全局布局组件，只需要使用该组件即可拥有公共导航和底部，内容区传入slot自定义即可
 * @Tips: 亲，记得补全功能描述哦~  (ღ˘⌣˘ღ)
 * @Author: Mr.Mikey
 * @Contact: 1303232158@qq.com
 * @Date: 2024-06-27 10:30:36
 * @LastEditors: Mr.Mikey
 * @LastEditTime: 2024-08-15 11:09:59
 * @FilePath: \am-portal-mobile-yzy-fe\src\layout\index.vue
-->
<template>
  <article class="v-page">
    <!-- 导航组件 start -->
    <!-- 如果在粤政易中打开，则不显示头部组件 -->
    <template v-if="!isInYzyApp()">
      <van-sticky v-if="navSticky">
        <VNav v-bind="$attrs">
          <!-- 插槽透传 -->
          <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]="slotProps">
            <slot :name="key" v-bind="{ ...slotProps }"></slot>
          </template>
        </VNav>
      </van-sticky>
      <VNav v-else v-bind="$attrs">
        <!-- 插槽透传 -->
        <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]="slotProps">
          <slot :name="key" v-bind="{ ...slotProps }"></slot>
        </template>
      </VNav>
    </template>
    <!-- 导航组件 end -->

    <!-- 内容组件 start -->
    <VContent v-bind="$attrs">
      <!-- 插槽透传 -->
      <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]="slotProps">
        <slot :name="key" v-bind="{ ...slotProps }"></slot>
      </template>
    </VContent>
    <!-- 内容组件 end -->

    <!-- footer组件 start -->
    <VFooter v-bind="$attrs">
      <!-- 插槽透传 -->
      <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]="slotProps">
        <slot :name="key" v-bind="{ ...slotProps }"></slot>
      </template>
    </VFooter>
    <!-- footer组件 end -->
  </article>
</template>

<script setup name="VPage">
import { useUserStore } from '@store/user.js'
import { isInYzyApp } from '@utils/index.js'
import { useGetPageTitle } from '@hooks/useGetPageTitle.js'

// 引入组件
import VNav from './components/VNav.vue'
import VContent from './components/VContent.vue'
import VFooter from './components/VFooter.vue'

const props = defineProps({
  navSticky: {
    type: Boolean,
    default: true,
  },
})

// 定义变量
const getPageTitle = useGetPageTitle()
// 引入并使用 UserStore
const userStore = useUserStore()

// 请求用户信息
userStore.fetchUserinfo()
// 如果在粤政易中打开，设置title
isInYzyApp() && getPageTitle.title()
</script>

<style scoped></style>
