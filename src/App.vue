<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { useUploadInfoStore } from '@/stores/upload-info-state';
import { useDynamicRouteStore } from '@/stores/dynamic-route-store';

const uploadInfoStore = useUploadInfoStore();
uploadInfoStore.fetchOssBaseUrls();
const dynamicRouteStore = useDynamicRouteStore();
dynamicRouteStore.fetchMenus();
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
