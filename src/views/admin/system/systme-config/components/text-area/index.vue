<script setup lang="ts">
import { configItemProps } from '../base-props';

defineOptions({
  name: 'TextAreaConfigItem',
});

const props = defineProps({
  ...configItemProps,
});
const { label, name, configData } = props;
</script>

<template>
  <ElInput
    v-model="configData[name]"
    type="textarea" :rows="4"
    :placeholder="`请输入${label}`"
  />
</template>

<style scoped lang="scss">
</style>
