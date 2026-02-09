<script setup lang="ts">
import { stagger } from 'animejs';
import AuthorSidebar from './components/author-sidebar/index.vue';
import ArticleContent from './components/article-content/index.vue';
import ArticleToc from './components/article-toc/index.vue';
import articleApiModule from '@/api/blog/article';
import { asyncRequest } from '@/utils/request-util';
import { useAppSettingsStore } from '@/stores/app-settings-store';
import { useScrollAnimation } from '@/uses/use-scroll-animation';

defineOptions({
  name: 'ArticleDetails',
});

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

// 滚动动画
const { observeElements, scaleInConfig, fadeInLeftConfig, fadeInRightConfig } = useScrollAnimation();

const articleDetail = ref<ArticleDetail>();
const appSettingsStore = useAppSettingsStore();

/**
 * 初始化入场动画
 */
function initEnterAnimations() {
  // 使用setTimeout确保所有子组件都已渲染
  nextTick(() => {
    setTimeout(() => {
      // 作者信息淡入左移
      observeElements('#author-sidebar-col > *', {
        ...fadeInLeftConfig,
        delay: stagger(100),
      });

      // 文章内容缩放淡入
      observeElements('#article-content-col > *', {
        ...scaleInConfig,
        delay: stagger(100),
      });

      // 目录淡入右移
      observeElements('#article-toc-col > *', {
        ...fadeInRightConfig,
        delay: stagger(100),
      });
    }, 100);
  });
}

onMounted(() => {
  asyncRequest(articleApiModule.apis.incrementViewCount, { pathParams: { id: props.id } }).then(() => {
    asyncRequest(articleApiModule.apis.fetchDetail, { pathParams: { id: props.id } }).then(res => {
      articleDetail.value = res.data;
      initEnterAnimations();
    });
  });
});
</script>

<template>
  <ElCard class="min-h-dvh">
    <div v-if="articleDetail" id="article-detail" class="max-w-[1500px] 2xl:max-w-[1700px] mx-auto py-6">
      <ElRow :gutter="24">
        <!-- 左侧作者栏：PC端显示 -->
        <ElCol :xs="0" :sm="0" :md="0" :lg="5">
          <AuthorSidebar
            id="author-sidebar-col"
            :author-id="articleDetail.createBy"
            :current-article-id="articleDetail.id"
          />
        </ElCol>

        <!-- 中间内容区：全端显示 -->
        <ElCol id="article-content-col" :xs="24" :sm="24" :md="17" :lg="14">
          <div v-if="appSettingsStore.isMobile">
            <ArticleContent :article-detail="articleDetail" />
          </div>
          <ElCard v-else class="min-h-full" shadow="never">
            <ArticleContent :article-detail="articleDetail" />
          </ElCard>
        </ElCol>

        <!-- 右侧目录：平板及以上显示 -->
        <ElCol :xs="0" :sm="0" :md="7" :lg="5">
          <ElAffix :offset="100" :z-index="0">
            <ArticleToc id="article-toc-col" :content="articleDetail.content" />
          </ElAffix>
        </ElCol>
      </ElRow>
    </div>

    <!-- 加载状态 -->
    <div v-else class="p-6 min-h-dvh max-w-[1400px] mx-auto">
      <ElSkeleton :rows="10" animated />
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
</style>
