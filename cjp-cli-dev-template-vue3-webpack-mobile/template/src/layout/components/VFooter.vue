<!--
 * @Description: 全局底部组件
 * @Tips: 亲，记得补全功能描述哦~  (ღ˘⌣˘ღ)
 * @Author: Mr.Mikey
 * @Contact: 1303232158@qq.com
 * @Date: 2024-06-27 10:18:47
 * @LastEditors: Mr.Mikey
 * @LastEditTime: 2024-06-27 10:42:35
 * @FilePath: \am-portal-mobile-yzy-fe\src\components\Vfooter.vue
-->
<template>
  <footer class="v-footer">
    <slot name="footer">
      {{ text }}
    </slot>
  </footer>
</template>

<script setup name="VFooter">
const props = defineProps({
  text: {
    type: String,
    default: '广东省水利厅',
  },
})
</script>

<style scoped lang="scss">
.v-footer {
  padding: pxToRem(54) 0;
  font-size: 14px;
  line-height: 14px;
  text-align: center;
  color: $color-gray;
}
</style>
