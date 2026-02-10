<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';

defineOptions({
  name: 'FilterBar',
});

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  currentCategory: '',
  currentSort: 'publishTime:desc',
});
const emit = defineEmits<Emits>();

interface Props {
  categories?: DataOption[];
  currentCategory?: string;
  currentSort?: string;
}

interface Emits {
  (e: 'update:currentCategory', value: string): void;
  (e: 'update:currentSort', value: string): void;
  (e: 'search', keyword: string): void;
}

// 搜索关键词
const searchKeyword = ref('');

// 排序选项
const sortOptions = [
  { label: '最新发布', value: 'publishTime:desc' },
  { label: '最早发布', value: 'publishTime:asc' },
  { label: '最多浏览', value: 'viewCount:desc' },
  { label: '最少浏览', value: 'viewCount:asc' },
];

/**
 * 选择分类
 */
function selectCategory(categoryValue: string) {
  emit('update:currentCategory', categoryValue);
}

/**
 * 选择排序
 */
function selectSort(sortValue: string) {
  emit('update:currentSort', sortValue);
}

/**
 * 执行搜索
 */
function handleSearch() {
  emit('search', searchKeyword.value);
}
</script>

<template>
  <div class="neumorphic rounded-lg md:rounded-xl p-4 md:p-6 space-y-4">
    <!-- 搜索栏和排序 -->
    <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
      <div class="flex-1 max-w-full md:max-w-2xl">
        <ElInput
          v-model="searchKeyword"
          placeholder="搜索文章标题..."
          size="large"
          clearable
          class="neumorphic-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <ElIcon class="text-mint-600">
              <Search />
            </ElIcon>
          </template>
          <template #append>
            <ElButton
              class="bg-mint-500! hover:bg-mint-600! text-white! border-none!"
              @click="handleSearch"
            >
              搜索
            </ElButton>
          </template>
        </ElInput>
      </div>

      <!-- 排序选择 -->
      <ElSelect
        :model-value="currentSort"
        placeholder="排序方式"
        size="large"
        class="w-full md:w-40!"
        @update:model-value="selectSort"
      >
        <ElOption
          v-for="option of sortOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </ElSelect>
    </div>

    <!-- 分类标签栏 -->
    <div class="flex items-center gap-2 md:gap-3 overflow-x-auto custom-scrollbar pb-2">
      <button
        class="px-3 md:px-4 py-2 cursor-pointer rounded-full font-medium text-xs md:text-sm whitespace-nowrap transition-all duration-300 gpu-accelerate"
        :class="[
          props.currentCategory === ''
            ? 'neumorphic-inset bg-mint-500 text-white'
            : 'neumorphic-sm text-gray-600 hover:text-mint-700 hover:scale-105',
        ]"
        @click="selectCategory('')"
      >
        全部
      </button>
      <button
        v-for="category of props.categories"
        :key="category.value"
        class="px-3 md:px-4 py-2 cursor-pointer rounded-full font-medium text-xs md:text-sm whitespace-nowrap transition-all duration-300 gpu-accelerate"
        :class="[
          props.currentCategory === category.value
            ? 'neumorphic-inset bg-mint-500 text-white'
            : 'neumorphic-sm text-gray-600 hover:text-mint-700 hover:scale-105',
        ]"
        @click="selectCategory(category.value as string)"
      >
        {{ category.label }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
