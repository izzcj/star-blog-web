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

const { data: options } = useLoadDataOptions(props.optionType, props.optionKey);

const model = useVModel(props, 'value', emit);
</script>

<template>
  <ElRadioGroup v-model="model" :disabled="disabled">
    <template v-if="props.type === 'radio'">
      <ElRadio v-for="item of options" :key="`${item.value}-${item.label}`" :value="item.value">
        {{ item.label }}
      </ElRadio>
    </template>
    <template v-else>
      <ElRadioButton v-for="item of options" :key="`${item.value}-${item.label}`" :value="item.value">
        {{ item.label }}
      </ElRadioButton>
    </template>
  </ElRadioGroup>
</template>

<style scoped lang="scss">

</style>
