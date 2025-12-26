<script setup lang="ts">
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { venusEditorProps } from './props';

defineOptions({
  name: 'VenusEditor',
});

const props = defineProps({
  ...venusEditorProps,
});

const venusEditor = ref();
const model = defineModel<string | null>('value', { type: String });

onMounted(() => {
  venusEditor.value = new Vditor('venus-editor', {
    height: '80vh',
    width: '80vw',
    preview: {
      theme: {
        current: 'fancy',
        path: '/vditor-theme',
      },
    },
    blur: value => {
      handleBlur(value);
    },
    cache: {
      enable: false,
    },
  });
});

function handleBlur(value: string) {
  if (props.outputHtml) {
    model.value = venusEditor.value.getHTML();
  } else {
    model.value = value;
  }
}
</script>

<template>
  <div>
    <div id="venus-editor" />
  </div>
</template>

<style scoped lang="scss">
</style>
