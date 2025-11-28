<script setup lang="ts">
import { venusRadioProps } from './props';
import { useLoadDataOptions } from '@/uses/use-data-options';

defineOptions({
  name: 'VenusRadio',
});

const props = defineProps({
  ...venusRadioProps,
});

const model = defineModel<string | number | boolean | null>('value', { type: [String, Number, Boolean] });

const optionType = computed(() => props.optionType);
const optionKey = computed(() => props.optionKey);
const { data: options } = useLoadDataOptions(optionType, optionKey);
</script>

<template>
  <ElRadioGroup
    v-model="model"
    :options="options"
    :disabled="props.disabled"
    :type="props.type"
  />
</template>

<style scoped lang="scss">

</style>
