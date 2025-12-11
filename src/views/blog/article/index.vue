<script setup lang="ts">
import ArticleCard from './components/article-card/index.vue';
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
  status: 'published',
});

onMounted(() => {
  loadArticles();
});

/**
 * 加载文章数据
 */
function loadArticles() {
  asyncRequest<PageData<Article>>(articleApiModule.apis.fetchPage, { params }).then(res => {
    articleList.value = res.data.data;
  });
}
</script>

<template>
  <ElCard class="min-h-full">
    <div class="flex flex-wrap gap-4 justify-center w-full mx-auto 2xl:max-w-[900px]">
      <ArticleCard v-for="article of articleList" :key="article.id" :article="article" />
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
</style>
