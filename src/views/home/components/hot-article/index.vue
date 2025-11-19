<script setup lang="ts">
import { useRouter } from 'vue-router';
import articleApiModule from '@/api/blog/article';
import { asyncRequest } from '@/utils/request-util';
import type { Article } from '@/components/article/metadata';

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
  <ElCard class="hot-blog-card">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-bold">热门文章</span>
        <ElButton text type="primary" size="small" @click="goArticleList">
          查看更多
        </ElButton>
      </div>
    </template>
    <div class="flex flex-wrap gap-4 justify-center w-full mx-auto 2xl:max-w-[900px]">
      <template v-if="hotArticle.length">
        <ElCard
          v-for="article of hotArticle"
          :key="article.id"
          class="mb-1 cursor-pointer min-w-[300px] 2xl:max-w-[400px]"
          body-class="p-2"
        >
          <ArticleCard :article="article" />
        </ElCard>
      </template>
      <ElEmpty v-else description="暂无热门文章" />
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
.hot-blog-card {
  .el-card__header {
    padding: 10px 12px;
  }
}
</style>
