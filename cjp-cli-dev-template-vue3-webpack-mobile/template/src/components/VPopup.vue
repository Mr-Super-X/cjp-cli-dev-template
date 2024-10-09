<template>
  <van-popup v-bind="$attrs" class="v-popup" :position="position" round @close="onClose">
    <div v-if="isShowHeader" class="v-popup-header">
      <slot name="header">
        <div class="v-popup-title">{{ title }}</div>
      </slot>
    </div>
    <div class="v-popup-content">
      <slot></slot>
    </div>
    <div class="v-popup-footer">
      <slot name="footer">
        <div class="btn-confirm" @click="handleConfirm">确认</div>
      </slot>
    </div>
  </van-popup>
</template>

<script setup name="VPopup">
const emits = defineEmits(['handleConfirm', 'update:show'])

const props = defineProps({
  position: {
    type: String,
    default: 'bottom',
  },
  isShowHeader: {
    // 是否显示header
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
})

// 抛出点击确认事件
const handleConfirm = () => {
  // 在defineEmits中声明update:show来调用会导致van-popup内部的close-on-click-overlay属性失效
  // 不声明直接调用虽然会报警告，但是能实现功能，完美的解决办法就是声明后再给popup组件绑定close事件
  emits('update:show', false)
  emits('handleConfirm')
}

// 当不设置close-on-click-overlay时，点击蒙层会触发close事件，要修复上面的问题则需要这样写，
// 这种方式可以解决vue的警告问题，在defineEmits中声明update:show即可
const onClose = () => {
  emits('update:show', false)
}
</script>

<style lang="scss" scoped>
.v-popup {
  .v-popup-header {
    border-bottom: 1px solid $color-white-1;

    .v-popup-title {
      font-size: 18px;
      line-height: 18px;
      font-weight: 600;
      color: $color-black-1;
    }
  }

  .v-popup-header,
  .v-popup-content,
  .v-popup-footer {
    padding: pxToRem($base-padding-spacing-1) pxToRem($base-padding-spacing);
  }

  .v-popup-footer {
    border-top: 1px solid $color-white-1;

    .btn-confirm {
      width: 100%;
      font-size: 16px;
      color: $color-white;
      background-color: $theme-color;
      line-height: pxToRem(96);
      text-align: center;
      border-radius: pxToRem(16);
    }
  }
}
</style>
