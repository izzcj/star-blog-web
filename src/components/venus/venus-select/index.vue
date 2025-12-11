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

const model = defineModel<string | number | boolean | string[] | number[] | null>('value', { type: [String, Number, Boolean, Array] });

const optionType = computed(() => props.optionType);
const optionKey = computed(() => props.optionKey);
const { data: options } = useLoadDataOptions(optionType, optionKey);
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
    :max-collapse-tags="props.maxCollapseTags"
    :filterable="props.filterable"
    :remote="props.remote"
    :remote-method="props.remoteMethod"
    :no-match-text="props.noMatchText"
    :no-data-text="props.noDataText"
    class="min-w-[150px]"
  >
    <template v-for="option of options" :key="option.key || option.value || option.label">
      <ElOptionGroup
        v-if="'options' in option && Array.isArray(option.options)"
        :label="option.label"
      >
        <ElOption
          v-for="item of option.options"
          :key="`${item.value}-${item.label}`"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </ElOptionGroup>
      <ElOption
        v-else
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      />
    </template>
  </ElSelect>
</template>

<style scoped lang="scss">
</style>
