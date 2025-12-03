<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'LatestActivity',
});

const router = useRouter();

/**
 * 动态项
 */
interface ActivityItem {
  // ID
  id: string;
  // 类型
  type: 'comment' | 'article' | 'reply';
  // 用户名
  userName: string;
  // 用户头像
  userAvatar: string;
  // 内容
  content: string;
  // 关联文章标题
  articleTitle?: string;
  // 关联文章ID
  articleId?: string;
  // 创建时间
  createTime: string;
}

// 最新动态列表
const activities = ref<ActivityItem[]>([]);
const loading = ref(false);

/**
 * 加载最新动态
 */
function loadActivities() {
  loading.value = true;

  // Mock数据，后续对接API
  setTimeout(() => {
    activities.value = [
      {
        id: '1',
        type: 'comment',
        userName: '张三',
        userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        content: '这篇文章写得太棒了！',
        articleTitle: 'Vue3 Composition API 实战指南',
        articleId: 'article-1',
        createTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        type: 'article',
        userName: '博主',
        userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        content: '发表了新文章《TypeScript 高级类型详解》',
        articleTitle: 'TypeScript 高级类型详解',
        articleId: 'article-2',
        createTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        type: 'reply',
        userName: '李四',
        userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        content: '感谢分享，学到了很多',
        articleTitle: 'Vite 性能优化实践',
        articleId: 'article-3',
        createTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        type: 'comment',
        userName: '王五',
        userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        content: '期待下一篇文章',
        articleTitle: 'Pinia 状态管理最佳实践',
        articleId: 'article-4',
        createTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        type: 'comment',
        userName: '赵六',
        userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        content: '收藏了！',
        articleTitle: 'Element Plus 进阶使用技巧',
        articleId: 'article-5',
        createTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
    ];
    loading.value = false;
  }, 500);
}

/**
 * 获取活动类型图标
 *
 * @param type 活动类型
 */
function getActivityIcon(type: ActivityItem['type']): string {
  switch (type) {
    case 'comment':
      return '💬';
    case 'article':
      return '📝';
    case 'reply':
      return '↩️';
    default:
      return '📌';
  }
}

/**
 * 格式化相对时间
 *
 * @param dateString 日期字符串
 */
function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: zhCN,
  });
}

/**
 * 跳转到文章详情
 *
 * @param articleId 文章ID
 */
function goToArticle(articleId?: string) {
  if (articleId) {
    router.push({ name: 'ArticleDetail', params: { id: articleId } });
  }
}

onMounted(() => {
  loadActivities();
});
</script>

<template>
  <ElCard v-loading="loading" class="activity-card">
    <template #header>
      <div class="card-header">
        <span class="text-base font-bold text-gray-700">最新动态</span>
      </div>
    </template>
    <div class="activity-list">
      <div
        v-for="activity of activities"
        :key="activity.id"
        class="activity-item"
        @click="goToArticle(activity.articleId)"
      >
        <div class="activity-icon">
          {{ getActivityIcon(activity.type) }}
        </div>
        <div class="activity-content">
          <div class="activity-header">
            <ElAvatar :src="activity.userAvatar" :size="24" class="activity-avatar" />
            <span class="activity-username">{{ activity.userName }}</span>
          </div>
          <div class="activity-text">
            <template v-if="activity.type === 'comment' || activity.type === 'reply'">
              评论了《<span class="article-title">{{ activity.articleTitle }}</span>》
            </template>
            <template v-else-if="activity.type === 'article'">
              发表了新文章《<span class="article-title">{{ activity.articleTitle }}</span>》
            </template>
          </div>
          <div v-if="activity.content" class="activity-detail">
            {{ activity.content }}
          </div>
          <div class="activity-time">
            {{ formatRelativeTime(activity.createTime) }}
          </div>
        </div>
      </div>
      <ElEmpty v-if="!loading && activities.length === 0" description="暂无动态" :image-size="60" />
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
.activity-card {
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
    padding: 0;
    max-height: 400px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 3px;

      &:hover {
        background: #bbb;
      }
    }
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9f9f9;

    .article-title {
      color: #409eff;
    }
  }
}

.activity-icon {
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.activity-avatar {
  margin-right: 8px;
  flex-shrink: 0;
}

.activity-username {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.activity-text {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  line-height: 1.5;
}

.article-title {
  color: #409eff;
  font-weight: 500;
  transition: color 0.2s;
}

.activity-detail {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  padding: 6px 10px;
  background-color: #f5f7fa;
  border-radius: 6px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-time {
  font-size: 12px;
  color: #999;
}
</style>
