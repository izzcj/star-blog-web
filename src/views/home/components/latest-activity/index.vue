<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useRouter } from 'vue-router';
import HomeComponentCard from '@/views/home/components/home-component-card.vue';

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
  <HomeComponentCard v-loading="loading" title="最新动态" body-class="p-0! custom-scrollbar max-h-[400px] overflow-y-auto">
    <div class="flex flex-col">
      <div
        v-for="activity of activities"
        :key="activity.id"
        class="group cursor-pointer flex py-3 px-4 border-b-[1px_solid_#f5f5f5] last:border-b-0 transition-colors duration-200 hover:bg-gray-100"
        @click="goToArticle(activity.articleId)"
      >
        <div class="w-6 h-6 text-xl mr-3 shrink-0 flex items-center justify-center">
          {{ getActivityIcon(activity.type) }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center mb-1.5">
            <ElAvatar :src="activity.userAvatar" :size="24" class="mr-2 shrink-0" />
            <span class="text-[14px] text-[#333] font-semibold">{{ activity.userName }}</span>
          </div>
          <div class="text-[13px] text-[#333] mb-1 leading-normal">
            <template v-if="activity.type === 'comment' || activity.type === 'reply'">
              评论了《<span class="text-[#bbb] font-medium transition-colors duration-200 group-hover:text-[#409eff]">{{ activity.articleTitle }}</span>》
            </template>
            <template v-else-if="activity.type === 'article'">
              发表了新文章《<span class="text-[#333] font-medium transition-colors duration-200 group-hover:text-[#409eff]">{{ activity.articleTitle }}</span>》
            </template>
          </div>
          <div v-if="activity.content" class="text-xs text-[#999] leading-normal mb-1 py-1.5 px-2.5 bg-[#f5f7fa] rounded-md truncate">
            {{ activity.content }}
          </div>
          <div class="text-xs text-[#999]">
            {{ formatRelativeTime(activity.createTime) }}
          </div>
        </div>
      </div>
      <ElEmpty v-if="!loading && activities.length === 0" description="暂无动态" :image-size="60" />
    </div>
  </HomeComponentCard>
</template>

<style scoped lang="scss">
</style>
