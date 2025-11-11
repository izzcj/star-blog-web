<script setup lang="ts">
import { configItemProps } from '../base-props';

defineOptions({
  name: 'ImageConfigItem',
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
  <VenusUpload v-model:value="model" />
</template>

<style scoped lang="scss">

</style>
