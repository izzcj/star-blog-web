<script setup lang="ts">
import { venusCheckboxProps } from './props';
import { useLoadDataOptions } from '@/uses/use-data-options';

defineOptions({
  name: 'VenusCheckbox',
});

const props = defineProps({
  ...venusCheckboxProps,
});

const emit = defineEmits<{
  (e: 'update:value', value?: string | number | boolean | null): void;
}>();

const model = useVModel(props, 'value', emit);

const { data: options } = useLoadDataOptions(props.optionType, props.optionKey);
</script>

<template>
  <ElCheckboxGroup
    v-model="model"
    :options="options"
    :disabled="props.disabled"
    :type="props.type"
    :min="props.min"
    :max="props.max"
  />
</template>

<style scoped lang="scss">

</style>
