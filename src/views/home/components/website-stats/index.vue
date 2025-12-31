<script setup lang="ts">
import { User, ChatDotRound, Clock, Document } from '@element-plus/icons-vue';
import HomeComponentCard from '../home-component-card.vue';
import statInfoApiModule from '@/api/system/stat-info';
import { asyncRequest } from '@/utils/request-util';

defineOptions({
  name: 'WebsiteStats',
});

/**
 * 统计信息
 */
interface StatInfo {
  // 访问数
  viewCount: number;
  // 文章数
  articleCount: number;
  // 评论数
  commentCount: number;
}

// 统计数据
const viewCount = ref(0);
const articleCount = ref(0);
const commentCount = ref(0);
const runningDays = ref(0);
const animationDuration = 2000;

const displayViewCount = useTransition(viewCount, {
  duration: animationDuration,
});
const displayArticleCount = useTransition(articleCount, {
  duration: animationDuration,
});
const displayCommentCount = useTransition(commentCount, {
  duration: animationDuration,
});
const displayRunningDays = useTransition(runningDays, {
  duration: animationDuration,
});

const loading = ref(false);
/**
 * 加载统计数据
 */
function loadStats() {
  loading.value = true;
  asyncRequest<StatInfo>(statInfoApiModule.apis.fetchAccumulativeStatInfo).then(res => {
    viewCount.value = res.data.viewCount;
    articleCount.value = res.data.articleCount;
    commentCount.value = res.data.commentCount;
  });

  // 计算运营天数
  const startDate = new Date('2024-01-01');
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  runningDays.value = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  loading.value = false;
}

onMounted(() => {
  loadStats();
});
</script>

<template>
  <HomeComponentCard v-loading="loading" title="网站统计" title-icon="svg:stat">
    <div class="grid grid-cols-2 gap-3">
      <!-- 访客数 -->
      <div class="stat-item">
        <ElStatistic :value="displayViewCount">
          <template #title>
            访客数
          </template>
          <template #prefix>
            <ElIcon class="align-[-0.125em]">
              <User />
            </ElIcon>
          </template>
        </ElStatistic>
      </div>

      <!-- 文章数 -->
      <div class="stat-item">
        <ElStatistic :value="displayArticleCount">
          <template #title>
            文章数
          </template>
          <template #prefix>
            <ElIcon class="align-[-0.125em]">
              <Document />
            </ElIcon>
          </template>
        </ElStatistic>
      </div>

      <!-- 评论数 -->
      <div class="stat-item">
        <ElStatistic :value="displayCommentCount">
          <template #title>
            评论数
          </template>
          <template #prefix>
            <ElIcon class="align-[-0.125em]">
              <ChatDotRound />
            </ElIcon>
          </template>
        </ElStatistic>
      </div>

      <!-- 运营天数 -->
      <div class="stat-item">
        <ElStatistic :value="displayRunningDays">
          <template #title>
            运行天数
          </template>
          <template #prefix>
            <ElIcon class="align-[-0.125em]">
              <Clock />
            </ElIcon>
          </template>
        </ElStatistic>
      </div>
    </div>
  </HomeComponentCard>
</template>

<style scoped lang="scss">
.stat-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    opacity: 0.8;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);

    &::before {
      opacity: 1;
    }
  }
}
</style>
