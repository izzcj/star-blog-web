<script setup lang="ts">
import ArticleCard from '@/views/blog/article/components/article-card/index.vue';
import articleApiModule from '@/api/blog/article';
import { asyncRequest } from '@/utils/request-util';
import HomeComponentCard from '@/views/home/components/home-component-card.vue';

defineOptions({
  name: 'LatestArticle',
});

const hotArticle = ref<Article[]>([]);
const router = useRouter();
const loading = ref(false);

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
  loading.value = true;
  asyncRequest<PageData<Article>>(articleApiModule.apis.fetchPage, {
    params: {
      page: 1,
      size: 6,
      status: 'published',
      sortDesc: 'publishTime',
    },
  })
    .then(res => {
      hotArticle.value = res.data.data;
      loading.value = false;
    });
}
</script>

<template>
  <HomeComponentCard v-loading="loading" header-class="" title="最新文章" title-icon="svg:new-article">
    <template #header>
      <ElButton text type="primary" size="small" @click="goArticleList">
        更多 →
      </ElButton>
    </template>
    <div class="w-full">
      <template v-if="hotArticle.length">
        <div class="w-full grid gap-4 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
          <ArticleCard
            v-for="article of hotArticle"
            :key="article.id"
            :article="article"
          />
        </div>
      </template>
      <ElEmpty v-else description="暂无文章" :image-size="80" />
    </div>
  </HomeComponentCard>
</template>

<style scoped lang="scss">
</style>
