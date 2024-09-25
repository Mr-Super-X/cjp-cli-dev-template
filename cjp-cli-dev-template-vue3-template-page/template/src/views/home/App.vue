<template>
  <div class="<%= name %>">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
// 模拟使用外部依赖
import dayjs from 'dayjs';

console.log(dayjs().format("YYYY-MM-DD"));

export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>

<style>
.<%= name %> {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
