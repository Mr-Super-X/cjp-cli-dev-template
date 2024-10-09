<template>
  <article class="v-content">
    <slot></slot>
  </article>
</template>

<script setup></script>

<style scoped lang="scss">
.v-content {
  padding: 0 pxToRem($base-padding-spacing);
}
</style>
