<script setup lang="ts">
import { configItemProps } from '../base-props';

defineOptions({
  name: 'NumberConfigItem',
});

const props = defineProps({
  ...configItemProps,
});
const { label, name, configData } = props;
</script>

<template>
  <ElInputNumber
    v-model:value="configData[name]"
    :placeholder="`请输入${label}`"
  />
</template>

<style scoped lang="scss">
</style>
