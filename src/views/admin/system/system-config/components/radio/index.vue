<script setup lang="ts">
import { configItemProps } from '../base-props';

defineOptions({
  name: 'RadioConfigItem',
});

const props = defineProps({
  ...configItemProps,
});

const emit = defineEmits<{
  (e: 'update:value', value?: any): void;
}>();

const model = useVModel(props, 'value', emit);

const { dataSourceType, dataSourceConfig } = props;
</script>

<template>
  <VenusRadio
    v-model="model"
    :option-type="dataSourceType"
    :option-key="dataSourceConfig"
  />
</template>

<style scoped lang="scss">

</style>
