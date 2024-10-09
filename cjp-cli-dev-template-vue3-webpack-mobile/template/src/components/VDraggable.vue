<!--
 * @Description: 支持动画过渡的拖拽组件
 * @Tips: 亲，记得补全功能描述哦~  (ღ˘⌣˘ღ)
 * @Author: Mr.Mikey
 * @Contact: 1303232158@qq.com
 * @Date: 2024-07-30 14:17:33
 * @LastEditors: Mr.Mikey
 * @LastEditTime: 2024-08-06 16:02:59
 * @FilePath: \am-portal-mobile-yzy-fe\src\components\VDraggable.vue
-->
<template>
  <VueDraggable
    ref="draggableRef"
    v-bind="$attrs"
    :animation="animation"
    class="v-draggable"
    target=".draggable-container"
  >
    <TransitionGroup type="transition" tag="div" name="fade" class="draggable-container">
      <slot></slot>
    </TransitionGroup>
  </VueDraggable>
</template>

<script setup name="VDraggable">
import { ref, watch, nextTick } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps({
  animation: {
    // 动画时长，默认150ms
    type: String,
    default: '150',
  },
  enableDraggable: {
    // 组件是否可以拖拽，默认为true
    type: Boolean,
    default: true,
  },
})

const draggableRef = ref()

// 监听是否启用拖拽
watch(
  () => props.enableDraggable,
  val => {
    nextTick(() => {
      if (val) {
        draggableRef.value?.start()
      } else {
        draggableRef.value?.pause()
      }
    })
  },
  {
    immediate: true,
  }
)

// VueDraggable自带了一些禁用、暂停、开始拖拽等方法需要通过ref来调用，将draggableRef暴露出去
defineExpose({
  draggableRef,
})
</script>

<style lang="scss" scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}
</style>
