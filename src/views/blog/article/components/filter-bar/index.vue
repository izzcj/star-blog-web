<script setup lang="ts">
import { Filter, Search } from '@element-plus/icons-vue';

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

const searchKeyword = ref('');

const sortOptions = [
  { label: '最新发布', value: 'publishTime:desc' },
  { label: '最早发布', value: 'publishTime:asc' },
  { label: '最多浏览', value: 'viewCount:desc' },
  { label: '最少浏览', value: 'viewCount:asc' },
];

function selectCategory(categoryValue: string) {
  emit('update:currentCategory', categoryValue);
}

function selectSort(sortValue: string) {
  emit('update:currentSort', sortValue);
}

function handleSearch() {
  emit('search', searchKeyword.value);
}
</script>

<template>
  <div class="glass-filter rounded-2xl p-5 md:p-6 space-y-5">
    <!-- 顶部：搜索 + 排序 -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <!-- 搜索框 -->
      <div class="flex-1 search-glow rounded-xl overflow-hidden transition-all duration-300">
        <ElInput
          v-model="searchKeyword"
          placeholder="搜索文章标题..."
          size="large"
          clearable
          class="search-input-override"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <ElIcon>
              <Search />
            </ElIcon>
          </template>
          <template #append>
            <button
              class="px-4 h-full text-white text-sm font-medium cursor-pointer bg-gradient-to-br from-teal-500 to-teal-700 transition-all duration-200 active:scale-95"
              @click="handleSearch"
            >
              搜索
            </button>
          </template>
        </ElInput>
      </div>

      <!-- 排序选择器 -->
      <div class="w-full sm:w-40 shrink-0">
        <ElSelect
          :model-value="currentSort"
          placeholder="排序方式"
          size="large"
          class="w-full sort-select-override"
          @update:model-value="selectSort"
        >
          <template #prefix>
            <ElIcon>
              <Filter />
            </ElIcon>
          </template>
          <ElOption
            v-for="option of sortOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </div>
    </div>

    <!-- 分类导航栏 -->
    <div class="relative">
      <!-- 左右渐变蒙版 -->
      <div class="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/60 to-transparent z-10 pointer-events-none" />
      <div class="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/60 to-transparent z-10 pointer-events-none" />

      <div class="flex items-center gap-2 overflow-x-auto pb-0.5 px-1 scrollbar-none">
        <!-- 全部 -->
        <button
          class="shrink-0 px-4 py-2 rounded-xl font-medium text-xs md:text-sm whitespace-nowrap cursor-pointer transition-all duration-250 select-none"
          :class="props.currentCategory === '' ? 'category-active' : 'category-default'"
          @click="selectCategory('')"
        >
          全部
        </button>

        <!-- 分隔线 -->
        <div class="h-5 w-px bg-mint-200/60 shrink-0 mx-0.5" />

        <!-- 动态分类 -->
        <button
          v-for="category of props.categories"
          :key="category.value"
          class="shrink-0 px-4 py-2 rounded-xl font-medium text-xs md:text-sm whitespace-nowrap cursor-pointer transition-all duration-250 select-none"
          :class="props.currentCategory === category.value ? 'category-active' : 'category-default'"
          @click="selectCategory(category.value as string)"
        >
          {{ category.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 隐藏滚动条但保留滚动功能 */
.scrollbar-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
}

/* 筛选提示过渡 */
.filter-hint-enter-active,
.filter-hint-leave-active {
  transition: all 0.25s ease;
}
.filter-hint-enter-from,
.filter-hint-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* 覆盖 Element Plus 搜索框样式 */
:deep(.search-input-override) {
  .el-input__wrapper {
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(20, 184, 166, 0.2);
    box-shadow: none;
    border-radius: 12px 0 0 12px;

    &:hover {
      border-color: rgba(20, 184, 166, 0.4);
    }

    &.is-focus {
      border-color: rgba(20, 184, 166, 0.6);
      background: rgba(255, 255, 255, 0.95);
    }
  }

  .el-input-group__append {
    background: transparent;
    border: 1px solid rgba(20, 184, 166, 0.2);
    border-left: none;
    border-radius: 0 12px 12px 0;
    overflow: hidden;
    padding: 0;

    button {
      height: 40px;
    }
  }
}

/* 覆盖排序下拉框样式 */
:deep(.sort-select-override) {
  .el-select__wrapper {
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(20, 184, 166, 0.2);
    box-shadow: none;
    border-radius: 12px;

    &:hover {
      border-color: rgba(20, 184, 166, 0.4);
    }

    &.is-focused {
      border-color: rgba(20, 184, 166, 0.6);
    }
  }
}
</style>
