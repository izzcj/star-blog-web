<script setup lang="ts">
import { useRouter } from 'vue-router';
import ArticleCard from '@/views/blog/article/components/article-card/index.vue';
import articleApiModule from '@/api/blog/article';
import { asyncRequest } from '@/utils/request-util';

defineOptions({
  name: 'HotArticle',
});

const hotArticle = ref<Article[]>([]);
const router = useRouter();

onMounted(() => {
  loadHotArticle();
});

/**
 * 跳转至文章列表页
 */
function goArticleList() {
  router.push({ name: 'Article' });
}

/**
 * 加载热门文章
 */
async function loadHotArticle() {
  const res = await asyncRequest(articleApiModule.apis.hotArticles);
  hotArticle.value = res.data ?? [];
}
</script>

<template>
  <ElCard class="hot-blog-card" body-class="p-4">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-base font-bold text-gray-700">热门文章</span>
        <ElButton text type="primary" size="small" @click="goArticleList">
          查看更多 →
        </ElButton>
      </div>
    </template>
    <div class="w-full">
      <template v-if="hotArticle.length">
        <div class="article-grid">
          <ArticleCard
            v-for="article of hotArticle"
            :key="article.id"
            :article="article"
          />
        </div>
      </template>
      <ElEmpty v-else description="暂无热门文章" :image-size="80" />
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
.hot-blog-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
}

.article-grid {
  display: grid;
  gap: 16px;
  width: 100%;

  // 移动端：1列
  grid-template-columns: 1fr;

  // 平板：2列
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  // PC端(lg)：在12列布局中显示2列
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  // 超大屏(2xl)：显示3列
  @media (min-width: 1536px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
