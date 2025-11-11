<script setup lang="ts">
import { venusRadioProps } from './props';
import { useLoadDataOptions } from '@/uses/use-data-options';

defineOptions({
  name: 'VenusRadio',
});

const props = defineProps({
  ...venusRadioProps,
});

const emit = defineEmits<{
  (e: 'update:value', value?: string | number | boolean | null): void;
}>();

const model = useVModel(props, 'value', emit);

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
