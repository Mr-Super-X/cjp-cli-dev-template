<!--
 * @Description: 综合业务&OA待办组件
 * @Tips: 亲，记得补全功能描述哦~  (ღ˘⌣˘ღ)
 * @Author: Mr.Mikey
 * @Contact: 1303232158@qq.com
 * @Date: 2024-06-27 15:34:50
 * @LastEditors: Mr.Mikey
 * @LastEditTime: 2024-09-18 10:25:54
 * @FilePath: \am-portal-mobile-yzy-fe\src\views\home\components\TodoList.vue
-->
<template>
  <div class="todoList">
    <VCard
      v-for="(value, key, index) in cardMap"
      :key="key + index"
      :class="value.className"
      @click="value.handleClick(item)"
    >
      <div class="title">
        <span>{{ value.title }}</span>
        <img v-if="value.num === 0" class="icon icon-success" src="../../../assets/images/icon-success.png" alt="" />
        <img v-else class="icon icon-red-point" src="../../../assets/images/icon-red-point.png" alt="" />
      </div>
      <div class="content">
        <span class="num">{{ value.num }}</span>
        <img class="icon" :class="value.contentIcon.className" :src="value.contentIcon.src" alt="" />
      </div>
    </VCard>
  </div>
</template>

<script setup name="TodoList">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { queryTodoCount } from '../apis'

const router = useRouter()

const cardMap = ref({
  integrated: {
    title: '综合业务',
    num: 0,
    contentIcon: {
      src: require('../../../assets/images/icon-integrated.png'),
      className: 'icon-integrated',
    },
    className: 'integrated',
    handleClick(item) {
      router.push({ path: '/integrated' })
    },
  },
  oaTodo: {
    title: 'OA待办',
    num: 0,
    contentIcon: {
      src: require('../../../assets/images/icon-oa-todo.png'),
      className: 'icon-oa-todo',
    },
    className: 'oaTodo',
    handleClick(item) {
      router.push({ path: '/oa-todo' })
    },
  },
})

// 获取oa待办和综合业务数量
const getCount = () => {
  return queryTodoCount({ isInner: true, queryType: 1 }).then(data => {
    cardMap.value.integrated.num = data[0]?.count || 0
    cardMap.value.oaTodo.num = data[1]?.count || 0
  })
}

getCount()
</script>

<style scoped lang="scss">
.todoList {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: pxToRem($base-padding-spacing-1);
  .v-card {
    width: pxToRem(358);
    padding: pxToRem($base-padding-spacing) pxToRem($base-padding-spacing) pxToRem(20);
    box-sizing: border-box;
    .title {
      display: flex;
      align-items: center;
      font-size: 16px;
      img {
        margin-left: pxToRem(12);
      }
      .icon-success {
        width: pxToRem($base-padding-spacing-1);
        height: pxToRem($base-padding-spacing-1);
      }
      .icon-red-point {
        width: pxToRem(16);
        height: pxToRem(16);
      }
    }

    .content {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .num {
        font-size: 32px;
        line-height: 32px;
        font-weight: 700;
      }

      img {
        position: relative;
        right: pxToRem(-25);
        width: pxToRem(96);
        height: pxToRem(96);
      }
    }
  }
}
</style>
