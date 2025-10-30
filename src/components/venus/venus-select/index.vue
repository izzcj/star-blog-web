<script setup lang="ts">
import 'element-plus/es/components/select/style/index';
import { ElSelect, ElOption, ElOptionGroup } from 'element-plus';
import { venusSelectProps } from './props';
import { asyncRequest } from '@/utils/request-util';
import dictDataApiModule from '@/api/system/dict-data';
import enumApiModule from '@/api/enum';

defineOptions({
  name: 'VenusSelect',
});

const props = defineProps({
  ...venusSelectProps,
});
const emit = defineEmits<{
  (e: 'update:value', value?: string | number | boolean | null): void;
}>();

const selectValue = ref(props.value);
const options = ref<DataOption[]>([]);

onMounted(loadOptions);

watch(
  () => props.value,
  value => {
    console.log('props.value', props.value);
    selectValue.value = value;
  },
  { immediate: true },
);

watch(
  selectValue,
  value => {
    emit('update:value', value);
  },
);

watch(
  () => [props.optionType, props.optionKey],
  loadOptions,
);

/**
 * 加载options
 */
async function loadOptions() {
  try {
    if (props.optionType === 'dict') {
      const res = await asyncRequest(dictDataApiModule.apis.options, {
        params: { dictType: props.optionKey as string },
      });
      options.value = res.data || [];
      return;
    }

    if (props.optionType === 'enum') {
      const res = await asyncRequest(enumApiModule.apis.options, {
        params: { class: props.optionKey as string },
      });
      options.value = res.data || [];
      return;
    }

    if (props.optionType === 'const' && isArray(props.optionKey)) {
      options.value = props.optionKey.map(item => ({
        label: item.label ?? item.value ?? item,
        value: item.value ?? item.label ?? item,
      }));
    }
  } catch (error) {
    console.error('加载选项失败:', error);
    options.value = [];
  }
}
</script>

<template>
  <ElSelect
    v-model="selectValue"
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
