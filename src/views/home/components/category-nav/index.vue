<script setup lang="ts">
import HomeComponentCard from '../home-component-card.vue';
import { asyncRequest } from '@/utils/request-util';
import articleApiModule from '@/api/blog/article';

defineOptions({
  name: 'CategoryNav',
});

/**
 * 分类（含文章数）
 */
interface CategoryWithCount {
  // 分类值
  categoryValue: string;
  // 分类名称
  categoryLabel: string;
  // 文章数量
  articleCount: number;
  // 样式
  cssClass?: string;
}

const router = useRouter();

// 分类列表
const categories = ref<CategoryWithCount[]>([]);
const loading = ref(false);

/**
 * 加载分类列表
 */
function loadCategories() {
  loading.value = true;

  asyncRequest<CategoryWithCount[]>(articleApiModule.apis.fetchCategoryNavbar).then(res => {
    categories.value = res.data;
    loading.value = false;
  });
}

/**
 * 跳转到分类页面
 *
 * @param categoryValue 分类值
 */
function goToCategory(categoryValue: string) {
  router.push({ name: 'Article', query: { category: categoryValue } });
}

onMounted(() => {
  loadCategories();
});
</script>

<template>
  <HomeComponentCard v-loading="loading" title="分类导航" title-icon="svg:category">
    <div class="grid grid-cols-2 gap-3">
      <div
        v-for="category of categories"
        :key="category.categoryValue"
        class="group relative p-4 rounded-lg cursor-pointer transition-all duration-300 ease-out
               hover:-translate-y-[6px] hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
        :style="category.cssClass"
        @click="goToCategory(category.categoryValue)"
      >
        <div class="relative z-10 flex flex-col items-center text-center">
          <div class="w-full">
            <div class="text-[14px] text-white font-semibold mb-1 transition-transform duration-300 ease-out group-hover:translate-x-1">
              {{ category.categoryLabel }}
            </div>
            <div class="text-xs text-white/90">
              {{ category.articleCount }} 篇
            </div>
          </div>
        </div>
      </div>
      <ElEmpty v-if="!loading && categories.length === 0" description="暂无导航分类" :image-size="60" />
    </div>
  </HomeComponentCard>
</template>

<style scoped lang="scss">
</style>
