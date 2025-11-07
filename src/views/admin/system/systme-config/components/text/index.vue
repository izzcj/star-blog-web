<script setup lang="ts">
import { configItemProps } from '../base-props';

defineOptions({
  name: 'TextConfigItem',
});

const props = defineProps({
  ...configItemProps,
});
const { label, name, configData } = props;
</script>

<template>
  <ElInput
    v-model:value="configData[name]"
    :clearable="true"
    :placeholder="`请输入${label}`"
  />
</template>

<style scoped lang="scss">
</style>
