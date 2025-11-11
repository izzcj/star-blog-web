<script setup lang="ts">
import { configItemProps } from '../base-props';
import VenusMonacoEditor from '@/components/venus/venus-monaco-editor/index.vue';

defineOptions({
  name: 'JsonConfigItem',
});

const props = defineProps({
  ...configItemProps,
});
const emit = defineEmits<{
  (e: 'update:value', value?: any): void;
}>();

const model = useVModel(props, 'value', emit);
</script>

<template>
  <VenusMonacoEditor
    v-model:value="model"
    :height="300"
    language="json"
  />
</template>

<style scoped lang="scss">

</style>
