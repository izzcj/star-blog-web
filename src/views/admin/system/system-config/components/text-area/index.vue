<script setup lang="ts">
import { configItemProps } from '../base-props';

defineOptions({
  name: 'TextAreaConfigItem',
});

const props = defineProps({
  ...configItemProps,
});
const emit = defineEmits<{
  (e: 'update:value', value?: any): void;
}>();

const model = useVModel(props, 'value', emit);
const { label } = props;
</script>

<template>
  <ElInput
    v-model="model"
    type="textarea" :rows="4"
    :placeholder="`请输入${label}`"
  />
</template>

<style scoped lang="scss">
</style>
