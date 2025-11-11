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
const model = useVModel(props, 'value', emit);
// 避免直接引入Editor和Viewer出现'未使用的类型'警告
const ByteMdEditor = defineAsyncComponent(async () => ((await import('@bytemd/vue-next')) as any).Editor);

const ByteMdViewer = defineAsyncComponent(async () => ((await import('@bytemd/vue-next')) as any).Viewer);

/**
 * 处理内容改变
 *
 * @param value 内容
 */
function handleContentChange(value: string) {
  model.value = value;
}
</script>

<template>
  <div class="size-full">
    <ByteMdEditor
      v-if="!props.isRead"
      :locale="zhHans"
      :value="model"
      :plugins="plugins"
      @change="handleContentChange"
    />
    <ByteMdViewer
      v-else
      :value="model"
      :plugins="plugins"
    />
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
