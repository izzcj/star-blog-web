<script setup lang="ts">
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { venusEditorProps } from './props';
import { asyncUploadRequest } from '@/utils/request-util';
import { isValidImageType } from '@/utils/file-util';
import { useUploadInfoStore } from '@/stores/upload-info-state';

defineOptions({
  name: 'VenusEditor',
});

const props = defineProps({
  ...venusEditorProps,
});

const uploadInfoStore = useUploadInfoStore();

const venusEditor = ref();
const model = defineModel<string | null>('value', { type: String });

/**
 * 处理图片上传
 *
 * @param files 文件列表
 */
function handleUploadImage(files: File[]): Nullable<string> {
  const fromData = new FormData();
  files.forEach(file => {
    if (!isValidImageType(file)) {
      return '仅支持jpeg,png,jpg,bmp格式的图片';
    }
    fromData.append('file', file);
  });
  asyncUploadRequest<string | string[]>(fromData).then(res => {
    if (files.length === 1) {
      venusEditor.value.insertValue(`![${files[0].name}](${uploadInfoStore.getOssBaseUrl('minio') + res.data})\n`);
    } else {
      for (let i = 0; i < files.length; i++) {
        venusEditor.value.insertValue(`![${files[i].name}](${uploadInfoStore.getOssBaseUrl('minio') + res.data[i]})\n`);
      }
    }
  })
    .catch(error => {
      return error;
    });
  return null;
}

/**
 * 处理blur事件
 *
 * @param value 编辑器内容
 */
function handleBlur(value: string) {
  if (props.outputHtml || props.mode === 'wysiwyg') {
    model.value = venusEditor.value.getHTML();
  } else {
    model.value = value;
  }
}

onMounted(() => {
  venusEditor.value = new Vditor('venus-editor', {
    height: props.height,
    width: '100%',
    mode: props.mode,
    preview: {
      theme: {
        current: 'fancy',
        path: '/vditor-theme',
      },
      markdown: {
        toc: true,
      },
    },
    upload: {
      handler: files => {
        return handleUploadImage(files);
      },
      accept: 'image/*',
    },
    // 必须配置，否则控制台会抛异常
    customWysiwygToolbar: () => {
    },
    toolbar: [
      'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      '|',
      'line',
      'quote',
      'list',
      'ordered-list',
      'check',
      'outdent',
      'indent',
      'code',
      'inline-code',
      'insert-after',
      'insert-before',
      'undo',
      'redo',
      'upload',
      'link',
      'table',
      'edit-mode',
      'both',
      'preview',
      'fullscreen',
      'outline',
      'export',
    ],
    blur: value => {
      handleBlur(value);
    },
    cache: {
      enable: false,
    },
  });
});

onUnmounted(() => {
  venusEditor.value.destroy();
});
</script>

<template>
  <div>
    <div id="venus-editor" />
  </div>
</template>

<style scoped lang="scss">
</style>
