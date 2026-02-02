<script setup lang="ts">
import 'bytemd/dist/index.css';
import 'juejin-markdown-themes/dist/fancy.min.css';
import 'highlight.js/styles/atom-one-dark.css';
import zhHans from 'bytemd/locales/zh_Hans.json';
import { plugins } from './plugins';
import { venusMdEditorProps } from './props';
import codeCopy from './plugins/code-operation';
import { asyncUploadRequest } from '@/utils/request-util';
import { isValidImageType } from '@/utils/file-util';
import { useUploadInfoStore } from '@/stores/upload-info-state';
import { errorNotification } from '@/element-plus/notification';

defineOptions({
  name: 'VenusByteMdEditor',
});
const props = defineProps({
  ...venusMdEditorProps,
});
const model = defineModel<string | null>('value', { type: String });
// 避免直接引入Editor和Viewer出现'未使用的类型'警告
const ByteMdEditor = defineAsyncComponent(async () => ((await import('@bytemd/vue-next')) as any).Editor);

const ByteMdViewer = defineAsyncComponent(async () => ((await import('@bytemd/vue-next')) as any).Viewer);

const viewerPlugins = [
  ...plugins,
  // 只在预览模式下启用，避免影响编辑性能
  codeCopy(),
];

const uploadInfoStore = useUploadInfoStore();

/**
 * 处理图片上传
 *
 * @param files 文件列表
 */
async function handleUploadImage(files: File[]) {
  const uploadedImages: Recordable[] = [];
  const fromData = new FormData();
  let valid = true;
  files.forEach(file => {
    if (!isValidImageType(file)) {
      errorNotification('仅支持jpeg,png,jpg,bmp格式的图片');
      valid = false;
      return;
    }
    fromData.append('file', file);
  });
  if (!valid) {
    return uploadedImages;
  }
  const result = await asyncUploadRequest<string | string[]>(fromData);
  if (isArray(result.data)) {
    result.data.forEach(url => {
      uploadedImages.push({
        url: uploadInfoStore.getOssBaseUrl() + url,
      });
    });
  } else {
    uploadedImages.push({
      url: uploadInfoStore.getOssBaseUrl() + result.data,
    });
  }
  return uploadedImages;
}

/**
 * 处理内容改变
 *
 * @param content 内容
 */
function handleContentChange(content: string) {
  model.value = content;
}
</script>

<template>
  <div class="size-full">
    <ByteMdViewer
      v-if="props.preview"
      :value="model"
      :plugins="viewerPlugins"
    />
    <ByteMdEditor
      v-else
      :locale="zhHans"
      :value="model"
      :plugins="plugins"
      :upload-images="handleUploadImage"
      @change="handleContentChange"
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
:deep(.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child) {
  display: none;
}
</style>
