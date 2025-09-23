<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Avatar, Back, View } from '@element-plus/icons-vue';
import type { Blog } from '../metadata';
import { asyncRequest } from '@/utils/request-util';
import blogApiModule from '@/api/blog';
import { useAppSettingsStore } from '@/stores/app-settings-store';

defineOptions({
  name: 'BlogDetails',
});

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const appSettingsStore = useAppSettingsStore();

interface BlogDetail extends Blog {
  content: string;
}

const blogDetail = ref<BlogDetail>();

onMounted(() => {
  asyncRequest(blogApiModule.apis.detail, { pathParams: { id: props.id } }).then(res => {
    blogDetail.value = res.data;
  });
});

function goBack() {
  router.back();
}
</script>

<template>
  <ElCard v-if="blogDetail" class="min-h-full">
    <div class="p-5 max-w-[800px] m-auto">
      <div class="mb-5">
        <ElIcon v-if="appSettingsStore.isMobile" class="mb-4" @click="goBack">
          <Back />
        </ElIcon>
        <h1 class="text-[28px]/[1.3] font-bold mb-4 text-[#333]">
          {{ blogDetail.title }}
        </h1>

        <!-- 博客元信息 -->
        <div class="flex flex-wrap gap-4 text-[14px] text-[#666] border-b border-solid border-[#eee] pb-[15px]">
          <span v-if="blogDetail.top" class="meta-item top-tag">
            置顶
          </span>
          <span class="meta-item">
            {{ blogDetail.typeName }}
          </span>
          <span class="meta-item">
            <ElIcon>
              <Avatar />
            </ElIcon>
            {{ blogDetail.createByName }}
          </span>
          <span class="meta-item">
            <ElIcon>
              <View />
            </ElIcon>
            {{ blogDetail.viewCount }}
          </span>
          <span class="meta-item">
            {{ blogDetail.publishTime }}
          </span>
        </div>
      </div>

      <!-- 封面图 -->
      <div v-if="blogDetail.coverImage" class="blog-cover">
        <img :src="blogDetail.coverImage" :alt="blogDetail.title" />
      </div>

      <!-- 博客内容 -->
      <div class="blog-content" v-html="blogDetail.content" />

      <!-- 标签 -->
      <div v-if="blogDetail.tags && blogDetail.tags.length > 0" class="blog-tags">
        <ElTag
          v-for="tag of blogDetail.tags"
          :key="tag.id"
          :color="tag.color"
          size="small"
          class="tag-item"
        >
          {{ tag.name }}
        </ElTag>
      </div>
    </div>
  </ElCard>

  <!-- 加载状态 -->
  <div v-else class="loading">
    <ElSkeleton :rows="10" animated />
  </div>
</template>

<style scoped lang="scss">
.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.top-tag {
  color: #ff4d4f;
  font-weight: bold;
}

.blog-cover {
  margin: 20px 0;
  text-align: center;

  img {
    max-width: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.blog-content {
  margin: 20px 0;
  line-height: 1.8;
  font-size: 16px;
  color: #333;

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  :deep(p) {
    margin-bottom: 16px;
  }

  :deep(h1), :deep(h2), :deep(h3) {
    margin: 20px 0 10px 0;
    color: #333;
  }

  :deep(ul), :deep(ol) {
    padding-left: 20px;
    margin-bottom: 16px;
  }

  :deep(li) {
    margin-bottom: 8px;
  }

  :deep(code) {
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
  }

  :deep(pre) {
    background-color: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
  }

  :deep(blockquote) {
    border-left: 4px solid #ddd;
    padding-left: 16px;
    margin: 16px 0;
    color: #666;
  }
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

.loading {
  padding: 20px;
}
</style>
