<script setup lang="ts">
import { configItemProps } from '../base-props';

defineOptions({
  name: 'SelectConfigItem',
});
const props = defineProps({
  ...configItemProps,
});
const { label, name, configData, dataSourceType, dataSourceConfig } = props;
</script>

<template>
  <VenusSelect
    v-model:value="configData[name]"
    :option-type="dataSourceType"
    :option-key="dataSourceConfig"
    :placeholder="`请选择${label}`"
  />
</template>

<style scoped lang="scss">

</style>
