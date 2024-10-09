<template>
  <div class="v-single-select-list">
    <div
      v-for="item in list"
      :key="item[rowKey]"
      :class="{ 'v-single-select-item--active': item[rowKey] === activeKey }"
      class="v-single-select-item van-ellipsis"
      @click="handleActive(item)"
    >
      {{ item[rowName] }}
    </div>
  </div>
</template>

<script setup name="VSingleSelectList">
import { ref } from 'vue'
import { deepClone } from '@utils/index.js'

// const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  data: {
    // 数据源
    required: true,
    type: Array,
    default: () => [],
  },
  rowKey: {
    // 如果不传rowKey，则默认选中当前数据的id，如果传了item，则选中整个数据
    type: String,
    default: 'id',
  },
  rowName: {
    // 列表项名称，默认name
    type: String,
    default: 'name',
  },
})

// 定义变量
const list = ref(deepClone(props.data))
const active = ref()
const activeKey = ref()

// 处理选中状态
const handleActiveStatus = item => {
  list.value.forEach(i => (i.isActive = false))
  item.isActive = true
}

const handleActive = item => {
  // 处理选中状态
  activeKey.value = item[props.rowKey]
  handleActiveStatus(item)

  // 处理选中数据
  if (props.rowKey === 'item') {
    active.value = item
  } else {
    active.value = item[props.rowKey]
  }
}

// 将数据暴露给外部使用
defineExpose({
  active,
})
</script>

<style lang="scss" scoped>
.v-single-select-list {
  max-height: pxToRem(705);
  overflow-y: auto;

  .v-single-select-item {
    width: 100%;
    height: pxToRem(80);
    line-height: pxToRem(80);
    text-align: center;
    color: $color-gray-1;
    border: 1px solid $color-gray-2;
    border-radius: pxToRem(16);
    font-size: 16px;
    margin-bottom: pxToRem($base-padding-spacing-1);
    padding: 0 pxToRem($base-padding-spacing-1);

    &:last-of-type {
      margin-bottom: 0;
    }

    &.v-single-select-item--active {
      color: $theme-color;
      border-color: $theme-color;
    }
  }
}
</style>
