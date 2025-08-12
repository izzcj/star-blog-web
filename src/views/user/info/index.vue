<script setup lang="ts">
defineOptions({
  name: 'UserInfo',
});
</script>

<template>
  <div>
    <ElCard class="user-info">
      <div>
        <p>这是内容区域</p>
      </div>
    </ElCard>
  </div>
</template>

<style scoped lang="less">
.user-info {
  margin-top: 10vh;
  width: 100%;
  height: 70vh;
  background: #fff;
}
</style>
