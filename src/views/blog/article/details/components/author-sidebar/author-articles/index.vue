<script setup lang="ts">
import { View } from '@element-plus/icons-vue';
import articleApiModule from '@/api/blog/article';
import { asyncRequest } from '@/utils/request-util';
import { formatViewCount } from '@/utils/format-util';
import { formatRelativeTime } from '@/utils/date-util';

const props = defineProps<{
  authorId: string;
  currentArticleId: string;
}>();

const router = useRouter();

// 作者其他文章列表
const articles = ref<Article[]>([]);
const loading = ref(false);

/**
 * 获取作者其他文章
 */
async function fetchAuthorArticles() {
  loading.value = true;
  try {
    const response = await asyncRequest<PageData<Article>>(articleApiModule.apis.fetchPage, {
      params: {
        createBy: props.authorId,
        excludeIds: props.currentArticleId,
        status: 'published',
        sortDesc: 'viewCount',
        page: 1,
        size: 5,
      },
    });
    articles.value = response.data.data;
  } catch (error) {
    console.error('获取作者文章列表失败:', error);
  } finally {
    loading.value = false;
  }
}

/**
 * 跳转到文章详情
 */
function navigateToArticle(id: string) {
  router.push({
    name: 'ArticleDetails',
    params: { id },
  });
}

onMounted(() => {
  fetchAuthorArticles();
});
</script>

<template>
  <ElCard
    shadow="never"
    class="border border-gray-100/60 hover:shadow-md transition-all duration-300 rounded-xl"
  >
    <template #header>
      <span class="text-base font-semibold text-gray-800">其他文章</span>
    </template>

    <ElSkeleton v-if="loading" :rows="5" animated />

    <div v-else-if="articles.length > 0" class="flex flex-col gap-3">
      <div
        v-for="article of articles"
        :key="article.id"
        class="group flex p-3 rounded-lg bg-gray-50/60 cursor-pointer overflow-hidden transition-all duration-300 ease-out hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-md"
        @click="navigateToArticle(article.id)"
      >
        <!-- 封面 -->
        <div class="relative w-20 h-15 rounded-md overflow-hidden mr-3 flex-shrink-0">
          <VenusImage
            :src="article.coverImage"
            :alt="article.title"
            class="size-full transition-transform duration-300 ease-out group-hover:scale-110"
          />
        </div>

        <!-- 信息 -->
        <div class="flex flex-col justify-between flex-1 min-w-0">
          <!-- 标题 -->
          <div class="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 transition-colors duration-200 group-hover:text-primary">
            {{ article.title }}
          </div>

          <!-- 元信息 -->
          <div class="flex items-center gap-3 text-xs text-gray-500">
            <span>{{ formatRelativeTime(article.publishTime) }}</span>
            <span class="flex items-center gap-1">
              <ElIcon :size="14"><View /></ElIcon>
              {{ formatViewCount(article.viewCount) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <ElEmpty
      v-else
      description="暂无其他文章"
      :image-size="60"
    />
  </ElCard>
</template>

<style scoped lang="scss">
</style>
