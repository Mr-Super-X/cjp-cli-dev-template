<template>
  <VPage class="no-content-padding">
    <article class="home">
      <!-- banner图 start -->
      <Banner />
      <!-- banner图 end -->

      <!-- 搜索 start -->
      <VReadonlySearch />
      <!-- 搜索 end -->

      <!-- 卡片区 -->
      <section class="card-area">
        <!-- 公告 start -->
        <Notice />
        <!-- 公告 end -->

        <!-- 待办 start -->
        <TodoList />
        <!-- 待办 end -->

        <!-- 预警信息 start -->
        <SpecialTopic />
        <!-- 预警信息 end -->

        <!-- 常用应用 start -->
        <Application />
        <!-- 常用应用 end -->

        <!-- 数说水利专区 start -->
        <!-- <SpecialDistrict /> -->
        <!-- 数说水利专区 end -->
      </section>
    </article>
  </VPage>
</template>

<script setup name="home">
// 引入组件
import Banner from './components/Banner.vue'
import Notice from './components/Notice.vue'
import TodoList from './components/TodoList.vue'
import Application from './components/Application.vue'
import SpecialTopic from './components/SpecialTopic.vue'
</script>

<style scoped lang="scss">
.home {
  .v-readonly-search {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(149, 221, 191, 0.3);
    padding: 0 pxToRem($base-padding-spacing) pxToRem($base-padding-spacing-1);

    :deep(.van-search) {
      .van-search__content {
        height: pxToRem(80);
        border-radius: pxToRem(48);
      }
    }
  }

  .card-area {
    padding: 0 pxToRem($base-padding-spacing);
    .v-card {
      margin-top: pxToRem($base-padding-spacing-1);
    }
  }
}
</style>
