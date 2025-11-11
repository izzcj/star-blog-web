<script setup lang="ts">
import type { DefineComponent } from 'vue';
import { configItemProps } from './base-props';

defineOptions({
  name: 'ConfigItem',
});

const props = defineProps({
  ...configItemProps,
});

const emit = defineEmits<{
  (e: 'update:value', value?: any): void;
}>();

const componentName = upperFirst(camelCase(props.type));

const configItemModules: Recordable<Recordable<DefineComponent>> = import.meta.glob('./*/index.vue', {
  eager: true,
});

const componentMap = keys(configItemModules).reduce((map, key) => {
  for (const value of values(configItemModules[key])) {
    if (value.name) {
      map.set(value.name, value);
    }
  }

  return map;
}, new Map<string, DefineComponent>());

const component = componentMap.get(`${componentName}ConfigItem`) as Component;

const handleUpdateValue = (val: any) => emit('update:value', val);
</script>

<template>
  <component
    :is="component"
    v-bind="props"
    @update:value="handleUpdateValue"
  />
</template>

<style scoped lang="scss">

</style>
