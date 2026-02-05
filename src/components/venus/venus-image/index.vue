<script setup lang="ts">
import { venusImageProps } from './props';
import { asyncRequest } from '@/utils/request-util';
import { uploadApiModule } from '@/api/upload';

defineOptions({
  name: 'VenusImage',
});

const props = defineProps({
  ...venusImageProps,
});
const src = ref('');

/**
 * 解析图片地址
 *
 * @param val 图片地址
 */
async function resolveSrc(val?: string) {
  if (!val) {
    src.value = '';
    return;
  }

  try {
    if (val.startsWith('http')) {
      src.value = val;
    } else {
      const resp = await asyncRequest(uploadApiModule.apis.fetchVisitUrl, {
        params: { fileId: val },
      });
      src.value = resp.data;
    }
  } catch (e) {
    console.error('图片地址获取失败', e);
    src.value = '';
  }
}

watch(() => props.src, resolveSrc, { immediate: true });
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
