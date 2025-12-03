<script setup lang="ts">
import { View } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { formatViewCount } from '@/utils/format-util';

defineOptions({
  name: 'RecommendArticle',
});

const router = useRouter();

// 推荐文章列表
const articles = ref<Array<Pick<Article, 'id' | 'title' | 'coverImage' | 'viewCount' | 'publishTime'>>>([]);
const loading = ref(false);

/**
 * 加载推荐文章
 */
function loadArticles() {
  loading.value = true;

  // Mock数据，后续对接API
  setTimeout(() => {
    articles.value = [
      {
        id: '1',
        title: 'Vue 3 性能优化最佳实践',
        coverImage: 'https://picsum.photos/400/200?random=1',
        viewCount: 1234,
        publishTime: '2024-12-01',
      },
      {
        id: '2',
        title: 'TypeScript 高级类型详解',
        coverImage: 'https://picsum.photos/400/200?random=2',
        viewCount: 856,
        publishTime: '2024-11-28',
      },
      {
        id: '3',
        title: 'Vite 构建优化实战',
        coverImage: 'https://picsum.photos/400/200?random=3',
        viewCount: 672,
        publishTime: '2024-11-25',
      },
    ];
    loading.value = false;
  }, 400);
}

/**
 * 跳转到文章详情
 *
 * @param articleId 文章ID
 */
function goToArticle(articleId: string) {
  router.push({ name: 'ArticleDetails', params: { id: articleId } });
}

onMounted(() => {
  loadArticles();
});
</script>

<template>
  <ElCard v-loading="loading" class="recommend-card">
    <template #header>
      <div class="card-header">
        <span class="text-base font-bold text-gray-700">推荐阅读</span>
      </div>
    </template>
    <div class="article-list">
      <div
        v-for="article of articles"
        :key="article.id"
        class="article-item"
        @click="goToArticle(article.id)"
      >
        <div class="article-cover-wrapper">
          <img :src="article.coverImage" :alt="article.title" class="article-cover" />
          <div class="cover-overlay">
            <span class="read-more">阅读</span>
          </div>
        </div>
        <div class="article-info">
          <div class="article-title">
            {{ article.title }}
          </div>
          <div class="article-meta">
            <span class="meta-item">
              <ElIcon :size="14">
                <View />
              </ElIcon>
              {{ formatViewCount(article.viewCount) }}
            </span>
          </div>
        </div>
      </div>
      <ElEmpty v-if="!loading && articles.length === 0" description="暂无推荐" :image-size="60" />
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
.recommend-card {
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  :deep(.el-card__header) {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  :deep(.el-card__body) {
    padding: 16px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-item {
  display: flex;
  padding: 12px;
  border-radius: 8px;
  background-color: #fafafa;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .article-cover {
      transform: scale(1.1);
    }

    .cover-overlay {
      opacity: 1;
    }

    .article-title {
      color: #409eff;
    }
  }
}

.article-cover-wrapper {
  position: relative;
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 12px;
}

.article-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.read-more {
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border: 1px solid white;
  border-radius: 4px;
}

.article-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.article-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.2s;
}

.article-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
