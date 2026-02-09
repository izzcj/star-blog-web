<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import type { IconItem } from '@/utils/icon-util';
import { searchIcons } from '@/utils/icon-util';

interface Props {
  icons: IconItem[];
  type: 'ep' | 'svg';
  modelValue: string;
}

defineOptions({
  name: 'IconPanel',
});

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// 搜索关键词
const searchKeyword = ref('');

// 内部选中
const selectedIcon = ref(props.modelValue);

// 监听外部 modelValue
watch(
  () => props.modelValue,
  v => (selectedIcon.value = v),
);

// 过滤后的图标
const filteredIcons = ref<IconItem[]>([]);

// 防抖搜索
const debouncedSearch = useDebounceFn(() => {
  filteredIcons.value = searchIcons(props.icons, searchKeyword.value);
}, 300);

// 监听搜索
watch(searchKeyword, debouncedSearch);

// 监听 icons 变化
watch(
  () => props.icons,
  icons => {
    filteredIcons.value = searchIcons(icons, searchKeyword.value);
  },
  { immediate: true },
);

// 选择图标
function selectIcon(name: string) {
  selectedIcon.value = name;
  emit('update:modelValue', name);
}

// 格式化 icon
function formatIconForRender(name: string) {
  return props.type === 'ep' ? `ep:${name}` : `svg:${name}`;
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- 搜索框 -->
    <ElInput
      v-model="searchKeyword"
      placeholder="搜索图标名称..."
      clearable
      class="mb-4"
    >
      <template #prefix>
        <ElIcon>
          <Search />
        </ElIcon>
      </template>
    </ElInput>

    <!-- 图标列表 -->
    <div
      v-if="filteredIcons.length"
      class="flex-1 overflow-y-auto border border-gray-200 rounded-md p-2 grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-2 max-h-[400px]"
    >
      <div
        v-for="icon of filteredIcons"
        :key="icon.name"
        class="flex items-center justify-center cursor-pointer border border-gray-200 rounded-md p-2 transition-all duration-200 ease-out
               hover:-translate-y-0.5 hover:shadow-sm hover:border-blue-300 hover:bg-blue-50/60"
        :class="{ 'border-blue-300 bg-blue-100 ring-2 ring-blue-200': selectedIcon === icon.name }"
        @click="selectIcon(icon.name)"
      >
        <ElTooltip
          :content="icon.displayName || icon.name"
          placement="top"
        >
          <IconRender
            :icon="formatIconForRender(icon.name)"
            size="24px"
            class="text-gray-700"
          />
        </ElTooltip>
      </div>
    </div>

    <!-- 空状态 -->
    <div
      v-else
      class="flex items-center justify-center flex-1 text-gray-400 border border-gray-200 rounded-md"
    >
      没有找到匹配的图标
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
