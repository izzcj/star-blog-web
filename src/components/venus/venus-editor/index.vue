<script setup lang="ts">
import Vditor from 'vditor';
import 'vditor/dist/index.css';

defineOptions({
  name: 'VenusEditor',
});

const venusEditor = ref();

onMounted(() => {
  venusEditor.value = new Vditor('venus-editor', {
    height: '50vh',
    width: '50vw',
    preview: {
      theme: {
        current: 'fancy',
        path: '/vditor-theme',
      },
    },
  });
});
</script>

<template>
  <div>
    <div id="venus-editor" />
  </div>
</template>

<style scoped lang="scss">
</style>
