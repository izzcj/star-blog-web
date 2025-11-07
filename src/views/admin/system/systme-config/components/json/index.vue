<script setup lang="ts">
import { configItemProps } from '../base-props';
import VenusMonacoEditor from '@/components/venus/venus-monaco-editor/index.vue';

defineOptions({
  name: 'JsonConfigItem',
});

const props = defineProps({
  ...configItemProps,
});
const { name, configData } = props;
</script>

<template>
  <VenusMonacoEditor
    v-model:value="configData[name]"
    :height="240" language="json"
  />
</template>

<style scoped lang="scss">

</style>
