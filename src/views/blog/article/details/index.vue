<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Avatar, Back, View } from '@element-plus/icons-vue';
import CommentSection from '@/views/blog/article/components/comment-section/index.vue';
import { asyncRequest } from '@/utils/request-util';
import articleApiModule from '@/api/blog/article';
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

const router = useRouter();
const appSettingsStore = useAppSettingsStore();

const articleDetail = ref<ArticleDetail>();

onMounted(() => {
  asyncRequest(articleApiModule.apis.incrementViewCount, { pathParams: { id: props.id } }).then(() => {
    asyncRequest(articleApiModule.apis.fetchDetail, { pathParams: { id: props.id } }).then(res => {
      articleDetail.value = res.data;
    });
  });
});

/**
 * 返回
 */
function goBack() {
  router.back();
}
</script>

<template>
  <div>
    <ElCard v-if="articleDetail" class="min-h-full">
      <div class="p-5 max-w-[800px] m-auto">
        <div class="mb-5">
          <ElIcon v-if="appSettingsStore.isMobile" class="mb-4" @click="goBack">
            <Back />
          </ElIcon>
          <h1 class="venus-center text-[28px]/[1.3] font-bold mb-4 text-[#333]">
            {{ articleDetail.title }}
          </h1>

          <!-- 文章元信息 -->
          <div class="flex flex-wrap justify-center gap-4 text-[14px] text-[#666] border-b border-solid border-[#eee] pb-[15px]">
            <span v-if="articleDetail.top" class="meta-item text-[#ff4d4f] font-bold">
              置顶
            </span>
            <span class="meta-item">
              {{ articleDetail.typeName }}
            </span>
            <span class="meta-item">
              <ElIcon>
                <Avatar />
              </ElIcon>
              {{ articleDetail.createByName }}
            </span>
            <span class="meta-item">
              <ElIcon>
                <View />
              </ElIcon>
              {{ articleDetail.viewCount }}
            </span>
            <span class="meta-item">
              {{ articleDetail.publishTime }}
            </span>
          </div>
        </div>

        <!-- 封面图 -->
        <div v-if="articleDetail.coverImage" class="my-5">
          <VenusImage :src="articleDetail.coverImage" :alt="articleDetail.title" />
        </div>

        <!-- 内容 -->
        <VenusMdEditor v-model:value="articleDetail.content" :is-read="true" />

        <!-- 标签 -->
        <div v-if="articleDetail.tags && articleDetail.tags.length > 0" class="blog-tags">
          <ElTag
            v-for="tag of articleDetail.tags"
            :key="tag.id"
            :color="tag.color"
            size="small"
            class="tag-item"
          >
            {{ tag.name }}
          </ElTag>
        </div>
        <!-- 评论区 -->
        <div v-if="articleDetail" class="mt-4">
          <CommentSection :article-id="articleDetail.id as string" />
        </div>

        <!-- 加载状态 -->
        <div v-else class="p-5">
          <ElSkeleton :rows="10" animated />
        </div>
      </div>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.blog-tags {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;

  .tag-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

// Element Plus 按钮样式覆盖
:deep(.el-button.is-text:hover) {
  background-color: transparent;
}
</style>
