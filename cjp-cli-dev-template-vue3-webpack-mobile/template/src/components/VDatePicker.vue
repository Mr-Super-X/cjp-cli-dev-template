<template>
  <van-date-picker v-bind="$attrs" class="v-date-picker" :show-toolbar="showToolbar" />
</template>

<script setup name="VDatePicker">
const props = defineProps({
  showToolbar: {
    // 默认不显示头部栏
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.v-date-picker {
}
</style>
