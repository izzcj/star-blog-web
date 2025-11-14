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

const { data: options } = useLoadDataOptions(props.optionType, props.optionKey);
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
