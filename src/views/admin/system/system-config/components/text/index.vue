<script setup lang="ts">
import { configItemProps } from '../base-props';

defineOptions({
  name: 'TextConfigItem',
});

const props = defineProps({
  ...configItemProps,
});

const emit = defineEmits<{
  (e: 'update:value', value?: string): void;
}>();

const model = useVModel(props, 'value', emit);
</script>

<template>
  <ElInput
    v-model="model"
    :clearable="true"
    :placeholder="`请输入${props.label}`"
  />
</template>

<style scoped lang="scss">
</style>
