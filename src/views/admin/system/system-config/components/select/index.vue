<script setup lang="ts">
import { configItemProps } from '../base-props';

defineOptions({
  name: 'SelectConfigItem',
});

const props = defineProps({
  ...configItemProps,
});

const emit = defineEmits<{
  (e: 'update:value', value?: any): void;
}>();

const model = useVModel(props, 'value', emit);

const { label, dataSourceType, dataSourceConfig } = props;
</script>

<template>
  <VenusSelect
    v-model="model"
    :option-type="dataSourceType"
    :option-key="dataSourceConfig"
    :placeholder="`请选择${label}`"
  />
</template>

<style scoped lang="scss">

</style>
