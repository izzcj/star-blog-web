<script setup lang="ts">
import { configItemProps } from '../base-props';

defineOptions({
  name: 'BooleanConfigItem',
});
const props = defineProps({
  ...configItemProps,
});
const { name, configData } = props;
</script>

<template>
  <ElSwitch
    v-model:value="configData[name]"
    active-text="是"
    inactive-text="否"
  />
</template>

<style scoped lang="scss">

</style>
