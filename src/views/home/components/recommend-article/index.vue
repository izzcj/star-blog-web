<script setup lang="ts">
import { View } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import HomeComponentCard from '../home-component-card.vue';
import { formatViewCount } from '@/utils/format-util';

defineOptions({
  name: 'RecommendArticle',
});

const router = useRouter();

// 推荐文章列表
const articles = ref<Array<Pick<Article, 'id' | 'title' | 'coverImage' | 'viewCount' | 'publishTime'>>>([]);
const loading = ref(false);

/**
 * 加载推荐文章
 */
function loadArticles() {
  loading.value = true;

  // Mock数据，后续对接API
  setTimeout(() => {
    articles.value = [
      {
        id: '1',
        title: 'Vue 3 性能优化最佳实践',
        coverImage: 'https://picsum.photos/400/200?random=1',
        viewCount: 1234,
        publishTime: '2024-12-01',
      },
      {
        id: '2',
        title: 'TypeScript 高级类型详解',
        coverImage: 'https://picsum.photos/400/200?random=2',
        viewCount: 856,
        publishTime: '2024-11-28',
      },
      {
        id: '3',
        title: 'Vite 构建优化实战',
        coverImage: 'https://picsum.photos/400/200?random=3',
        viewCount: 672,
        publishTime: '2024-11-25',
      },
    ];
    loading.value = false;
  }, 400);
}

/**
 * 跳转到文章详情
 *
 * @param articleId 文章ID
 */
function goToArticle(articleId: string) {
  router.push({ name: 'ArticleDetails', params: { id: articleId } });
}

onMounted(() => {
  loadArticles();
});
</script>

<template>
  <HomeComponentCard v-loading="loading" title="推荐阅读">
    <div class="flex flex-col gap-3">
      <div
        v-for="article of articles"
        :key="article.id"
        class="group flex p-3 rounded-lg bg-[#fafafa] transition duration-300 ease-out cursor-pointer overflow-hidden hover:bg-[#f0f0f0] hover:-translate-y-0.5 hover:shadow-md"
        @click="goToArticle(article.id)"
      >
        <!-- 封面 -->
        <div class="relative w-20 h-15 rounded-md overflow-hidden mr-3 flex-shrink-0">
          <img
            :src="article.coverImage"
            class="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
            alt=""
          />
          <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span class="text-white text-xs font-semibold px-2 py-1 border border-white rounded">
              阅读
            </span>
          </div>
        </div>

        <!-- 信息 -->
        <div class="flex flex-col justify-between flex-1 min-w-0">
          <div class="text-sm font-semibold text-[#333] leading-tight line-clamp-2 transition-colors duration-200 group-hover:text-blue-500">
            {{ article.title }}
          </div>

          <div class="flex items-center text-xs text-gray-500">
            <span class="flex items-center gap-1">
              <ElIcon :size="14"><View /></ElIcon>
              {{ formatViewCount(article.viewCount) }}
            </span>
          </div>
        </div>
      </div>

      <ElEmpty
        v-if="!loading && articles.length === 0"
        description="暂无推荐"
        :image-size="60"
      />
    </div>
  </HomeComponentCard>
</template>
