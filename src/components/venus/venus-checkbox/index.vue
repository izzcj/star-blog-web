<script setup lang="ts">
import { venusCheckboxProps } from './props';
import { useLoadDataOptions } from '@/uses/use-data-options';

defineOptions({
  name: 'VenusCheckbox',
});

const props = defineProps({
  ...venusCheckboxProps,
});

const model = defineModel<string[] | number[] | null>('value', { type: Array });

const optionType = computed(() => props.optionType);
const optionKey = computed(() => props.optionKey);
const { data: options } = useLoadDataOptions(optionType, optionKey);
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
