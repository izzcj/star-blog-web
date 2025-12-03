<script setup lang="ts">
import { User, ChatDotRound, Clock, Document } from '@element-plus/icons-vue';

defineOptions({
  name: 'WebsiteStats',
});

// 统计数据
const visitorCount = ref(0);
const articleCount = ref(0);
const commentCount = ref(0);
const runningDays = ref(0);
const animationDuration = 2000;

const displayVisitorCount = useTransition(visitorCount, {
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

const statsRef = ref<HTMLElement | null>(null);

/**
 * 加载统计数据
 */
function loadStats() {
  // Mock数据，后续对接API
  visitorCount.value = 1245;
  articleCount.value = 156;
  commentCount.value = 5678;

  // 计算运营天数
  const startDate = new Date('2024-01-01');
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  runningDays.value = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

onMounted(() => {
  loadStats();
});
</script>

<template>
  <ElCard ref="statsRef" class="stats-card">
    <template #header>
      <div class="card-header">
        <span class="text-base font-bold text-gray-700">网站统计</span>
      </div>
    </template>
    <div class="grid grid-cols-2 gap-3">
      <!-- 访客数 -->
      <div class="stat-item">
        <ElStatistic :value="displayVisitorCount">
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
  </ElCard>
</template>

<style scoped lang="scss">
.stats-card {
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
