<script setup lang="ts">
import { configItemProps } from '../base-props';

defineOptions({
  name: 'BooleanConfigItem',
});

const props = defineProps({
  ...configItemProps,
});

const emit = defineEmits<{
  (e: 'update:value', value?: any): void;
}>();

const model = useVModel(props, 'value', emit);
</script>

<template>
  <ElSwitch
    v-model="model"
    active-text="是"
    inactive-text="否"
  />
</template>

<style scoped lang="scss">

</style>
