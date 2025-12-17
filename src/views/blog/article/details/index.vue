<script setup lang="ts">
import AuthorSidebar from './components/author-sidebar/index.vue';
import ArticleContent from './components/article-content/index.vue';
import ArticleToc from './components/article-toc/index.vue';
import articleApiModule from '@/api/blog/article';
import { asyncRequest } from '@/utils/request-util';
import { useAppSettingsStore } from '@/stores/app-settings-store';

defineOptions({
  name: 'ArticleDetails',
});

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const articleDetail = ref<ArticleDetail>();
const appSettingsStore = useAppSettingsStore();

onMounted(() => {
  asyncRequest(articleApiModule.apis.incrementViewCount, { pathParams: { id: props.id } }).then(() => {
    asyncRequest(articleApiModule.apis.fetchDetail, { pathParams: { id: props.id } }).then(res => {
      articleDetail.value = res.data;
    });
  });
});
</script>

<template>
  <ElCard>
    <div v-if="articleDetail" id="article-detail" class="max-w-[1500px] 2xl:max-w-[1700px] mx-auto py-6">
      <ElRow :gutter="24">
        <!-- 左侧作者栏：PC端显示 -->
        <ElCol :xs="0" :sm="0" :md="0" :lg="5" :xl="5">
          <AuthorSidebar
            :author-id="articleDetail.createBy"
            :current-article-id="articleDetail.id"
          />
        </ElCol>

        <!-- 中间内容区：全端显示 -->
        <ElCol :xs="24" :sm="24" :md="17" :lg="14" :xl="14">
          <div v-if="appSettingsStore.isMobile">
            <ArticleContent :article-detail="articleDetail" />
          </div>
          <ElCard v-else class="min-h-full">
            <ArticleContent :article-detail="articleDetail" />
          </ElCard>
        </ElCol>

        <!-- 右侧目录：平板及以上显示 -->
        <ElCol :xs="0" :sm="0" :md="7" :lg="5" :xl="5">
          <ElAffix :offset="100" :z-index="0">
            <ArticleToc :content="articleDetail.content" />
          </ElAffix>
        </ElCol>
      </ElRow>
    </div>

    <!-- 加载状态 -->
    <div v-else class="p-6 max-w-[1400px] mx-auto">
      <ElSkeleton :rows="10" animated />
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
</style>
