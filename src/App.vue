<script setup lang="ts">
import { useUploadInfoStore } from '@/stores/upload-info-state';

const uploadInfoStore = useUploadInfoStore();
uploadInfoStore.fetchOssBaseUrls();
</script>

<template>
  <div class="container hidden-scrollbar">
    <RouterView />
  </div>
</template>

<style lang="scss">
@use "@/styles/index";
</style>
