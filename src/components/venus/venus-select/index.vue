<script setup lang="ts">
import 'element-plus/es/components/select/style/index';
import { ElSelect, ElOption, ElOptionGroup } from 'element-plus';
import { venusSelectProps } from './props';
import { useLoadDataOptions } from '@/uses/use-data-options';

defineOptions({
  name: 'VenusSelect',
});

const props = defineProps({
  ...venusSelectProps,
});
const emit = defineEmits<{
  (e: 'update:value', value?: string | number | boolean | null): void;
}>();

const model = useVModel(props, 'value', emit);

const { data: options } = useLoadDataOptions(props.optionType, props.optionKey);
</script>

<template>
  <ElSelect
    v-model="model"
    :multiple="props.multiple"
    :multiple-limit="props.multipleLimit"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :clearable="props.clearable"
    :collapse-tags="props.collapseTags"
    :collapse-tags-tooltip="props.collapseTagsTooltip"
    :filterable="props.filterable"
    :remote="props.remote"
    :remote-method="props.remoteMethod"
    :no-match-text="props.noMatchText"
    :no-data-text="props.noDataText"
  >
    <template v-if="props.group">
      <ElOptionGroup
        v-for="group of options"
        :key="group[props.groupLabel]"
        :label="group[props.groupLabel]"
      >
        <ElOption
          v-for="item of group[props.groupOptions]"
          :key="`${item.value}-${item.label}`"
          :label="item.label"
          :value="item.value"
        />
      </ElOptionGroup>
    </template>
    <template v-else>
      <ElOption
        v-for="option of options"
        :key="`${option.value}-${option.label}`"
        :label="option.label"
        :value="option.value"
      />
    </template>
  </ElSelect>
</template>

<style scoped lang="scss">
</style>
