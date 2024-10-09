<!--
 * @Description: 全局Nav组件
 * @Tips: 亲，记得补全功能描述哦~  (ღ˘⌣˘ღ)
 * @Author: Mr.Mikey
 * @Contact: 1303232158@qq.com
 * @Date: 2024-06-26 16:37:44
 * @LastEditors: Mr.Mikey
 * @LastEditTime: 2024-07-01 18:24:13
 * @FilePath: \am-portal-mobile-yzy-fe\src\layout\components\VNav.vue
-->
<template>
  <nav class="v-nav">
    <div class="left">
      <slot name="nav-left">
        <img @click="handleGoBack" class="icon-left" src="../../assets/images/icon-left_bracket.png" alt="" />
      </slot>
    </div>
    <div class="center">
      <slot name="nav-center">{{ title }}</slot>
    </div>
    <div class="right">
      <slot name="nav-right">
        <img class="icon-point" src="../../assets/images/icon-title_point.png" alt="" />
      </slot>
    </div>
  </nav>
</template>

<script setup name="VNav">
import { useGetPageTitle } from '@hooks/useGetPageTitle.js'

const props = defineProps({
  navTitle: {
    type: String,
    default: '',
  },
})

// 定义变量
const getPageTitle = useGetPageTitle()
// title，如果传了navTitle则优先显示，否则自动获取route.meta.title
const title = getPageTitle.title(props.navTitle)

const handleGoBack = () => {
  history.go(-1)
}
</script>

<style scoped lang="scss">
.v-nav {
  position: relative;
  height: pxToRem(88);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--00-b-39-d, #00b39d);
  padding: 0 pxToRem(16);

  .icon-left,
  .icon-point {
    width: pxToRem(64);
    height: pxToRem(64);
    display: block; // 解决行内块元素移动端边距问题
  }

  // 让中间元素无论怎么变化都居中对齐
  .center {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    width: fit-content; // 宽度填充内容宽度
    color: #fff;
    font-size: 18px;
    line-height: 20px;
  }
}
</style>
