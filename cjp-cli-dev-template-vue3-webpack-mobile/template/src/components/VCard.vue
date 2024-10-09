<template>
  <div class="v-card">
    <slot></slot>
  </div>
</template>

<script setup name="VCard"></script>

<style scoped lang="scss">
.v-card {
  border-radius: pxToRem($border-radius);
  background-color: $color-white;
  /* 悬浮阴影 */
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06);
}
</style>
