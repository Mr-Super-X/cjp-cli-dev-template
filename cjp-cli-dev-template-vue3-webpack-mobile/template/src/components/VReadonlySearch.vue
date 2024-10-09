<template>
  <div class="v-readonly-search">
    <van-search readonly placeholder="点击开始搜索" @click="handleGoSearch" />
  </div>
</template>

<script setup name="VReadonlySearch">
import { useRouter } from 'vue-router'

const router = useRouter()

// 点击跳转搜索页
const handleGoSearch = () => {
  router.push('/search')
}
</script>

<style lang="scss" scoped>
.v-readonly-search {
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-white;
  padding: pxToRem(24) pxToRem($base-padding-spacing);

  :deep(.van-search) {
    flex: 1;
    padding: 0;
    background-color: transparent;
    .van-search__content {
      height: pxToRem(80);
      border-radius: pxToRem(16);
    }
  }
}
</style>
