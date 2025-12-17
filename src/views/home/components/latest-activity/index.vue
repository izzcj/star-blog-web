<script setup lang="ts">
import HomeComponentCard from '@/views/home/components/home-component-card.vue';
import ActivityType from '@/enums/activity-type';
import { asyncRequest } from '@/utils/request-util';
import activityApiModule from '@/api/blog/activity';
import { formatRelativeTime } from '@/utils/date-util';

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
  type: ActivityType;
  // 用户昵称
  userNickname: string;
  // 用户头像
  userAvatar: string;
  // 内容
  content: string;
  // 关联文章标题
  articleTitle: string;
  // 关联文章ID
  articleId: string;
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

  asyncRequest<PageData<ActivityItem>>(activityApiModule.apis.fetchPage, {
    params: {
      page: 1,
      size: 5,
    },
  }).then(res => {
    activities.value = res.data.data;
    loading.value = false;
  });
}

/**
 * 获取活动类型图标
 *
 * @param type 活动类型
 */
function getActivityIcon(type: ActivityItem['type']): string {
  switch (type) {
    case ActivityType.COMMENT:
      return '💬';
    case ActivityType.ARTICLE:
      return '📝';
    case ActivityType.REPLY:
      return '↩️';
    default:
      return '📌';
  }
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
            <VenusAvatar v-model:value="activity.userAvatar" :custom-size="28" class="mr-2 shrink-0" />
            <span class="text-[14px] text-[#333] font-semibold">{{ activity.userNickname }}</span>
          </div>
          <div class="text-[13px] text-[#333] mb-1 leading-normal">
            <template v-if="activity.type === ActivityType.COMMENT || activity.type === ActivityType.REPLY">
              评论了《<span class="text-[#333] font-semibold transition-colors duration-200 group-hover:text-[#409eff]">{{ activity.articleTitle }}</span>》
            </template>
            <template v-else-if="activity.type === ActivityType.ARTICLE">
              发表了新文章《<span class="text-[#333] font-semibold transition-colors duration-200 group-hover:text-[#409eff]">{{ activity.articleTitle }}</span>》
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
