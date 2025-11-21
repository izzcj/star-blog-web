<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { useUploadInfoStore } from '@/stores/upload-info-state';

const uploadInfoStore = useUploadInfoStore();
uploadInfoStore.fetchOssBaseUrls();
</script>

<template>
  <div class="container hidden-scrollbar">
    <ElConfigProvider :locale="zhCn">
      <RouterView />
    </ElConfigProvider>
  </div>
</template>

<style lang="scss">
@use "@/styles/index";
</style>
