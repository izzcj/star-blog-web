<script setup lang="ts">
import { venusImageProps } from './props';
import { useUploadInfoStore } from '@/stores/upload-info-state';

defineOptions({
  name: 'VenusImage',
});

const props = defineProps({
  ...venusImageProps,
});

const ossProvider = computed(() => props.ossProvider);

const uploadInfoStore = useUploadInfoStore();

const src = computed(() => {
  if (!props.src) {
    return;
  }
  if (props.src.startsWith('http://') || props.src.startsWith('https://')) {
    return props.src;
  }
  const baseUrl = uploadInfoStore.getOssBaseUrl(ossProvider.value);
  if (!baseUrl) {
    return;
  }
  return baseUrl + props.src;
});
uploadInfoStore.fetchOssBaseUrls();
</script>

<template>
  <ElImage
    class="block!"
    :src="src"
    :alt="props.alt"
    :fit="props.fit"
    :hide-on-click-modal="props.hideOnClickModal"
    :hide-on-press-escape="props.hideOnPressEscape"
    :lazy="props.lazy"
    :width="props.width"
    :height="props.height"
  />
</template>

<style scoped lang="scss">
</style>
