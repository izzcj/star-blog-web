<script setup lang="ts">
</script>

<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<style lang="scss">
@use "@/styles/index";
.container {
  @extend .venus-center;
  height: 100vh;
}
</style>
