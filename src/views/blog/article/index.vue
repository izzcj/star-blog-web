<script setup lang="ts">
import ArticleCard from './components/article-card/index.vue';
import ArticleSkeleton from './components/article-skeleton/index.vue';
import FilterBar from './components/filter-bar/index.vue';
import HeroBanner from './components/hero-banner/index.vue';
import articleApiModule from '@/api/blog/article';
import { asyncRequest } from '@/utils/request-util';
import dictDataApiModule from '@/api/system/dict-data';
import { useAppSettingsStore } from '@/stores/app-settings-store';

defineOptions({
  name: 'ArticlePage',
});

const props = defineProps<{
  // 分类
  category?: string;
}>();

// 文章列表
const articleList = ref<Article[]>([]);
// 分类列表
const categories = ref<DataOption[]>([]);
// 总数
const total = ref(0);
// 加载状态
const loading = ref(false);

// 分页参数
const page = ref(1);
const size = ref(12);

// 筛选参数
const currentCategory = ref(props.category);
const currentSort = ref('publishTime:desc');
const searchKeyword = ref('');
const appSettingsStore = useAppSettingsStore();

// 请求参数
const params = computed(() => {
  let defaultDescSort = 'top, updateTime';
  const [sortField, sortOrder] = currentSort.value.split(':');
  if (sortOrder == 'desc' && !defaultDescSort.includes(sortField)) {
    defaultDescSort += `,${sortField}`;
  }
  return {
    page: page.value,
    size: size.value,
    status: 'published',
    category: currentCategory.value || undefined,
    title: searchKeyword.value || undefined,
    sortDesc: defaultDescSort,
    sortAsc: sortOrder === 'asc' ? sortField : undefined,
  };
});

onMounted(() => {
  loadCategories();
  loadArticles();
});

/**
 * 加载分类列表
 */
async function loadCategories() {
  const res = await asyncRequest<DataOption[]>(dictDataApiModule.apis.fetchOptions, { params: { dictKey: 'article-category' } });
  categories.value = res.data;
}

/**
 * 加载文章数据
 */
async function loadArticles() {
  loading.value = true;
  try {
    const res = await asyncRequest<PageData<Article>>(articleApiModule.apis.fetchPage, { params: params.value });
    articleList.value = res.data.data;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
}

/**
 * 分类变化
 */
function handleCategoryChange(category: string) {
  currentCategory.value = category;
  page.value = 1;
  loadArticles();
}

/**
 * 排序变化
 */
function handleSortChange(sort: string) {
  currentSort.value = sort;
  page.value = 1;
  loadArticles();
}

/**
 * 搜索
 */
function handleSearch(keyword: string) {
  searchKeyword.value = keyword;
  page.value = 1;
  loadArticles();
}

/**
 * 页码变化
 */
function handlePageChange(newPage: number) {
  page.value = newPage;
  loadArticles();
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 每页条数变化
 */
function handleSizeChange(newSize: number) {
  size.value = newSize;
  page.value = 1;
  loadArticles();
}
</script>

<template>
  <div class="min-h-full bg-gradient-to-br from-mint-50 via-white to-mint-50/30">
    <div class="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
      <!-- 顶部横幅 -->
      <div class="pt-6 md:pt-8 pb-6 md:pb-10">
        <HeroBanner />
      </div>

      <!-- 筛选导航栏 -->
      <div class="pb-6 md:pb-10">
        <FilterBar
          :categories="categories"
          :current-category="currentCategory"
          :current-sort="currentSort"
          @update:current-category="handleCategoryChange"
          @update:current-sort="handleSortChange"
          @search="handleSearch"
        />
      </div>

      <!-- 文章列表 -->
      <div class="min-h-[400px] pb-8">
        <!-- 骨架屏加载 -->
        <div v-if="loading" class="magazine-grid">
          <ArticleSkeleton
            v-for="i of size"
            :key="i"
            :is-featured="i === 1"
          />
        </div>

        <!-- 文章列表（杂志风布局） -->
        <div v-else-if="articleList.length > 0" class="magazine-grid">
          <ArticleCard
            v-for="(article, index) of articleList"
            :key="article.id"
            :article="article"
            :is-featured="index === 0"
            :style="{ animationDelay: `${index * 50}ms` }"
            class="animate-fade-in-up"
          />
        </div>

        <!-- 空状态 -->
        <div v-else class="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div class="neumorphic rounded-2xl p-12">
            <ElEmpty description="暂无文章" :image-size="200" />
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > 0" class="flex justify-center pt-8 pb-12">
        <div class="neumorphic rounded-lg p-4">
          <ElPagination
            :size="appSettingsStore.isMobile ? 'small' : 'default'"
            :current-page="page"
            :page-size="size"
            :total="total"
            :page-sizes="[12, 24, 36, 48]"
            layout="total, sizes, prev, pager, next, jumper"
            background
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
