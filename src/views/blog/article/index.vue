<script setup lang="ts">
import type { Article } from '@/components/article/metadata';
import articleApiModule from '@/api/blog/article';
import { asyncRequest } from '@/utils/request-util';

defineOptions({
  name: 'ArticlePage',
});

const articleList = ref<Article[]>([]);

const page = ref(1);
const size = ref(10);
const params = reactive({
  page,
  size,
  status: 'PUBLISHED',
});

onMounted(() => {
  loadArticles();
});

/**
 * 加载文章数据
 */
function loadArticles() {
  asyncRequest(articleApiModule.apis.fetchPage, { params }).then(res => {
    articleList.value = res.data.data;
  });
}
</script>

<template>
  <ElCard class="min-h-full">
    <div class="flex flex-wrap gap-4 justify-center w-full mx-auto 2xl:max-w-[900px]">
      <ElCard v-for="article of articleList" :key="article.id" class="flex-1 cursor-pointer min-w-[300px] 2xl:max-w-[400px]" body-class="flex flex-col min-h-full">
        <ArticleCard :article="article" />
      </ElCard>
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
</style>
