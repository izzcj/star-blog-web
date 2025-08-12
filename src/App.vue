<script setup lang="ts">
</script>

<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<style lang="less">
@import '@/styles/index.less';
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
