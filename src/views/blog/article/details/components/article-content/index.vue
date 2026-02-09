<script setup lang="ts">
import { ArrowLeft, Avatar, Back, Clock, View } from '@element-plus/icons-vue';
import CommentSection from '@/views/blog/article/details/components/comment-section/index.vue';
import { formatViewCount } from '@/utils/format-util';
import { useAppSettingsStore } from '@/stores/app-settings-store';
import { formatRelativeTime } from '@/utils/date-util';

const props = defineProps<{
  // 文章详情
  articleDetail: ArticleDetail;
}>();

const router = useRouter();
const appSettingsStore = useAppSettingsStore();
const contentLoading = ref(true);

// 创建内容的本地副本，避免直接修改 prop
const localContent = ref('');

// 监听 prop 变化，同步到本地副本
watch(
  () => props.articleDetail.content,
  newContent => {
    if (!newContent) {
      return;
    }

    contentLoading.value = true;

    requestAnimationFrame(() => {
      localContent.value = newContent;
      contentLoading.value = false;
    });
  },
  { immediate: true },
);

/**
 * 返回上一页
 * 如果没有浏览历史，则返回文章列表页
 */
function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: 'Article' });
  }
}
</script>

<template>
  <div class="p-5">
    <!-- PC 端返回按钮 -->
    <div v-if="!appSettingsStore.isMobile" class="mb-4">
      <ElButton
        text
        :icon="ArrowLeft"
        class="!text-gray-600 hover:!text-primary transition-colors"
        @click="goBack"
      >
        返回
      </ElButton>
    </div>

    <!-- 移动端返回按钮 -->
    <ElIcon
      v-if="appSettingsStore.isMobile"
      class="mb-4 cursor-pointer"
      @click="goBack"
    >
      <Back />
    </ElIcon>

    <!-- 文章标题 -->
    <h1 class="text-center text-[28px]/[1.3] font-bold mb-4 text-[#333]">
      {{ articleDetail.title }}
    </h1>

    <!-- 文章元信息 -->
    <div class="flex flex-wrap justify-center gap-3 border-b border-solid border-[#eee] pb-4 text-sm text-gray-600">
      <ElTag v-if="articleDetail.top" type="danger">
        置顶
      </ElTag>

      <ElTag>
        {{ articleDetail.categoryName }}
      </ElTag>

      <span class="flex items-center gap-1">
        <ElIcon>
          <Avatar />
        </ElIcon>
        {{ articleDetail.createByName }}
      </span>

      <span class="flex items-center gap-1">
        <ElIcon>
          <View />
        </ElIcon>
        {{ formatViewCount(articleDetail.viewCount) }}
      </span>

      <span class="flex items-center gap-1">
        <ElIcon>
          <Clock />
        </ElIcon>
        {{ formatRelativeTime(articleDetail.publishTime) }}
      </span>
    </div>

    <div
      v-if="articleDetail.summary"
      class="mt-6 px-5 py-4 text-gray-400 text-sm italic leading-relaxed border-l-2 border-gray-300 bg-gradient-to-r from-gray-50 to-transparent"
    >
      {{ articleDetail.summary }}
    </div>

    <!-- 封面图 -->
    <div v-if="articleDetail.coverImage" class="my-5">
      <VenusImage :src="articleDetail.coverImage" :alt="articleDetail.title" class="rounded-md shadow-ms hover:shadow-xl" />
    </div>

    <!-- 内容 -->
    <div class="article-content-wrapper">
      <VenusByteMdEditor
        v-if="!contentLoading"
        v-model:value="localContent"
        :preview="true"
      />
    </div>

    <!-- 标签 -->
    <div v-if="articleDetail.tags && articleDetail.tags.length > 0" class="mt-7 pt-5 border-t border-t-[#eee]">
      <VenusTag
        v-for="tag of articleDetail.tags"
        :key="tag.id"
        :tag="tag"
        class="mr-2.5 mb-2.5"
      />
    </div>

    <!-- 评论区 -->
    <div class="mt-4">
      <CommentSection :article-id="articleDetail.id" />
    </div>
  </div>
</template>

<style scoped lang="scss">
// Element Plus 按钮样式覆盖
:deep(.el-button.is-text:hover) {
  background-color: transparent;
}
</style>
