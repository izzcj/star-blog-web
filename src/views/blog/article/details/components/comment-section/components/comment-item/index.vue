<script setup lang="ts">
import { debounce } from 'lodash-es';
import { Icon } from '@iconify/vue';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChatDotRound } from '@element-plus/icons-vue';
import ReplySection from '../reply-section/index.vue';
import { asyncRequest } from '@/utils/request-util';
import commentApiModule from '@/api/blog/comment';
import { useAuthenticationStore } from '@/stores/authentication-store';
import { errorNotification, warningNotification } from '@/element-plus/notification';
import { useAppSettingsStore } from '@/stores/app-settings-store';
import AvatarDisplay from '@/components/venus/venus-avatar/components/avatar-display/index.vue';

interface CommentItemProps {
  // 评论数据
  comment: CommentDetail;
  // 文章ID
  articleId: string;
  // 回复数
  replyCount: number;
}

defineOptions({
  name: 'CommentItem',
});

const props = defineProps<CommentItemProps>();

const authStore = useAuthenticationStore();
const appSettingsStore = useAppSettingsStore();

// 本地状态（用于乐观更新）
const localComment = ref({ ...props.comment });

// 是否展开回复区域
const showReplySection = ref(false);

// 控制是否显示回复输入框
const showReplyInput = ref(false);

// 回复数量（可能动态变化）
const replyCount = ref(props.replyCount);

// 相对时间
const relativeTime = computed(() => {
  return formatDistanceToNow(new Date(props.comment.createTime as string), {
    addSuffix: true,
    locale: zhCN,
  });
});

// 点赞图标类名
const likeIconClass = computed(() => {
  return localComment.value.liked
    ? 'text-red-500'
    : 'text-gray-400 hover:text-red-500';
});

// 头像尺寸
const avatarSize = computed(() => {
  return appSettingsStore.isMobile ? 32 : 40;
});

/**
 * 点赞/取消点赞（防抖处理）
 */
const handleLike = debounce(async () => {
  // 检查登录
  if (!authStore.isLoggedIn) {
    warningNotification('请先登录');
    return;
  }

  // 乐观更新
  const previousLiked = localComment.value.liked;
  const previousCount = localComment.value.likeCount;

  localComment.value.liked = !previousLiked;
  localComment.value.likeCount += previousLiked ? -1 : 1;

  try {
    if (previousLiked) {
      await asyncRequest(commentApiModule.apis.unLike, {
        params: { id: props.comment.id },
      });
    } else {
      await asyncRequest(commentApiModule.apis.like, {
        params: { id: props.comment.id },
      });
    }
  } catch (error) {
    console.log(error);
    // 回滚
    localComment.value.liked = previousLiked;
    localComment.value.likeCount = previousCount;
    errorNotification('操作失败，请稍后重试');
  }
}, 300);

/**
 * 切换回复区域
 */
function toggleReplySection() {
  // 检查登录
  if (!authStore.isLoggedIn) {
    warningNotification('请先登录后再回复');
    return;
  }

  showReplySection.value = !showReplySection.value;
}

/**
 * 显示回复输入框
 */
function showReplyInputHandler() {
  // 检查登录
  if (!authStore.isLoggedIn) {
    warningNotification('请先登录后再回复');
    return;
  }

  showReplySection.value = true;
  showReplyInput.value = true;
}

/**
 * 关闭回复输入框
 */
function handleCloseReplyInput() {
  showReplyInput.value = false;
}

/**
 * 回复数量变化
 */
function handleReplyCountChange(count: number) {
  replyCount.value = count;
}
</script>

<template>
  <div class="comment-item">
    <!-- 评论头部 -->
    <div class="flex gap-3">
      <!-- 头像 -->
      <AvatarDisplay
        :src="localComment.userAvatar"
        :name="localComment.userName"
        :size="avatarSize"
        shape="circle"
      />

      <div class="flex-1">
        <!-- 用户名和时间 -->
        <div class="flex items-center gap-2 mb-1">
          <span class="font-semibold text-sm">{{ localComment.userName }}</span>
          <span class="text-xs text-gray-400">{{ relativeTime }}</span>
        </div>

        <!-- 评论内容 -->
        <div class="text-sm text-gray-700 mb-2">
          {{ localComment.content }}
        </div>

        <!-- 操作栏 -->
        <div class="flex items-center gap-4 text-xs text-gray-500">
          <!-- 点赞 -->
          <button
            class="flex items-center gap-1 transition-colors cursor-pointer"
            :class="likeIconClass"
            @click="handleLike"
          >
            <ElIcon>
              <Icon icon="ant-design:like-outlined" />
            </ElIcon>
            <span>{{ localComment.likeCount }}</span>
          </button>

          <!-- 回复 -->
          <button
            class="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
            @click="showReplyInputHandler"
          >
            <ElIcon>
              <ChatDotRound />
            </ElIcon>
            <span>回复</span>
          </button>

          <!-- 回复数量 -->
          <span v-if="replyCount > 0" class="text-blue-500 cursor-pointer" @click="toggleReplySection">
            {{ replyCount }} 条回复 {{ showReplySection ? '▲' : '▼' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 回复区域 -->
    <ReplySection
      v-if="showReplySection"
      :comment-id="comment.id as string"
      :article-id="articleId"
      :reply-count="replyCount"
      :show-input="showReplyInput"
      @reply-count-change="handleReplyCountChange"
      @close-input="handleCloseReplyInput"
    />
  </div>
</template>

<style scoped lang="scss">
.comment-item {
  padding: 16px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
}

button {
  background: none;
  border: none;
  padding: 0;
}
</style>
