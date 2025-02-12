<template>
  <div class="content">
    <div class="header"></div>
    <RouterView></RouterView>
  </div>
</template>

<script>
import { RouterView } from 'vue-router';

export default {
};
</script>

<style lang='less' scoped>

/* 这里是样式 */
  .header{
    height: 40px;
    background-color:#2980b9;
    line-height: 40px;
  }


</style>