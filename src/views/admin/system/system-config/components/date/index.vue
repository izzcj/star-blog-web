<script setup lang="ts">
import { configItemProps } from '../base-props';

defineOptions({
  name: 'DateConfigItem',
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
  <ElDatePicker
    v-model="model"
    clearable
    type="date"
    :placeholder="`请选择${label}`"
  />
</template>

<style scoped lang="scss">

</style>
