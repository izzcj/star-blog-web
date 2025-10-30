<script setup lang="ts">
import 'bytemd/dist/index.css';
import 'juejin-markdown-themes/dist/fancy.min.css';
import 'highlight.js/styles/atom-one-dark.css';
import zhHans from 'bytemd/locales/zh_Hans.json';
import { plugins } from './plugins';
import { venusMdEditorProps } from './props';

defineOptions({
  name: 'VenusMdEditor',
});
const props = defineProps({
  ...venusMdEditorProps,
});
const emit = defineEmits<{
  (e: 'update:value', value?: string | null): void;
}>();
// 避免直接引入Editor和Viewer出现'未使用的类型'警告
const ByteMdEditor = defineAsyncComponent(async () => ((await import('@bytemd/vue-next')) as any).Editor);
const ByteMdViewer = defineAsyncComponent(async () => ((await import('@bytemd/vue-next')) as any).Viewer);

const content = ref(props.value);

watch(
  () => props.value,
  value => {
    content.value = value;
  },
  { immediate: true },
);

watch(
  content,
  value => {
    emit('update:value', value);
  },
);

/**
 * 处理内容改变
 *
 * @param value 内容
 */
function handleContentChange(value: string) {
  content.value = value;
}
</script>

<template>
  <div class="size-full">
    <ByteMdEditor v-if="!props.isRead" :locale="zhHans" :value="content" :plugins="plugins" @change="handleContentChange" />
    <ByteMdViewer v-else :value="content" :plugins="plugins" />
  </div>
</template>

<style scoped lang="scss">
:deep(.bytemd) {
  height: calc(100vh - 200px);
}
:deep(.bytemd-body) {
  height: calc(100% - 70px);
}
</style>
