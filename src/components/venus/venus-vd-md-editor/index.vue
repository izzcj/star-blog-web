<script setup lang="ts">
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { venusEditorProps } from './props';
import { asyncUploadRequest } from '@/utils/request-util';
import { isValidImageType } from '@/utils/file-util';

defineOptions({
  name: 'VenusVdMdEditor',
});

const props = defineProps({
  ...venusEditorProps,
});

const venusEditor = ref();
const model = defineModel<string | null>('value', { type: String });

/**
 * 处理图片上传
 *
 * @param files 文件列表
 */
function handleUploadImage(files: File[]): Nullable<string> {
  const fromData = new FormData();
  for (let i = files.length - 1; i >= 0; i--) {
    if (!isValidImageType(files[i])) {
      return '仅支持jpeg,png,jpg,bmp格式的图片';
    }
    fromData.append(`file${i}`, files[i]);
  }
  asyncUploadRequest(fromData, props.ossProvider).then(res => {
    if (files.length === 1) {
      venusEditor.value.insertValue(`![${files[0].name}](${res.data.url})\n`);
    } else {
      for (let i = 0; i < files.length; i++) {
        venusEditor.value.insertValue(`![${files[i].name}](${res.data[i].url})\n`);
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
  if (props.preview) {
    Vditor.preview(document.getElementById('venus-previewer') as HTMLDivElement, model.value || '', {
      mode: 'light',
      theme: {
        current: 'fancy',
        path: '/vditor-theme',
      },
    });
  } else {
    venusEditor.value = new Vditor('venus-editor', {
      height: props.height,
      width: '100%',
      mode: props.mode,
      value: model.value || '',
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
  }
});

onUnmounted(() => {
  if (venusEditor.value) {
    venusEditor.value.destroy();
  }
});
</script>

<template>
  <div class="size-full">
    <div v-if="props.preview" id="venus-previewer" />
    <div v-else id="venus-editor" />
  </div>
</template>

<style scoped lang="scss">
</style>
