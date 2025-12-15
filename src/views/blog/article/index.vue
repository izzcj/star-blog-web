<script setup lang="ts">
import ArticleCard from './components/article-card/index.vue';
import ArticleSkeleton from './components/article-skeleton/index.vue';
import FilterBar from './components/filter-bar/index.vue';
import HeroBanner from './components/hero-banner/index.vue';
import articleApiModule from '@/api/blog/article';
import { asyncRequest } from '@/utils/request-util';
import dictDataApiModule from '@/api/system/dict-data';

defineOptions({
  name: 'ArticlePage',
});

const props = defineProps<{
  // 分类
  category?: string;
}>();

// 文章列表
const articleList = ref<Article[]>([]);
// 精选文章（用于横幅）
const featuredArticle = ref<Article>();
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

// 请求参数
const params = computed(() => {
  const [sortField, sortOrder] = currentSort.value.split(':');
  return {
    page: page.value,
    size: size.value,
    status: 'published',
    category: currentCategory.value || undefined,
    title: searchKeyword.value || undefined,
    sortDesc: sortOrder === 'desc' ? sortField : undefined,
    sortAsc: sortOrder === 'asc' ? sortField : undefined,
  };
});

onMounted(() => {
  loadCategories();
  loadArticles();
  loadFeaturedArticle();
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
 * 加载精选文章（获取第一个推荐且置顶的文章）
 */
async function loadFeaturedArticle() {
  const res = await asyncRequest<PageData<Article>>(articleApiModule.apis.fetchPage, {
    params: {
      page: 1,
      size: 1,
      status: 'published',
      sortDesc: 'publishTime',
    },
  });
  if (res.data.data.length > 0) {
    featuredArticle.value = res.data.data[0];
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
  <div class="min-h-full bg-gray-50/75">
    <div class="w-full max-w-[1280px] mx-auto px-4 md:px-6">
      <!-- 顶部横幅 -->
      <div class="pt-6 pb-8">
        <HeroBanner :featured-article="featuredArticle" />
      </div>

      <!-- 筛选导航栏 -->
      <div class="pb-8">
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
      <div class="min-h-[400px]">
        <!-- 骨架屏加载 -->
        <div v-if="loading" class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ArticleSkeleton v-for="i of size" :key="i" />
        </div>

        <!-- 文章列表（带动画） -->
        <div v-else-if="articleList.length > 0" class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ArticleCard
            v-for="(article, index) of articleList"
            :key="article.id"
            :article="article"
            :style="{ animationDelay: `${index * 50}ms` }"
            class="animate-fade-in-up"
          />
        </div>

        <!-- 空状态 -->
        <div v-else class="flex flex-col items-center justify-center py-20 animate-fade-in">
          <ElEmpty description="暂无文章" :image-size="200" />
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > 0" class="flex justify-center pt-12 pb-8">
        <ElPagination
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
</template>

<style scoped lang="scss">
</style>
