<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ChatDotRound } from '@element-plus/icons-vue';
import { asyncRequest } from '@/utils/request-util';
import commentApiModule from '@/api/blog/comment';
import { useAuthenticationStore } from '@/stores/authentication-store';
import { errorNotification, warningNotification } from '@/element-plus/notification';
import AvatarDisplay from '@/components/venus/venus-avatar/components/avatar-display/index.vue';
import { formatRelativeTime } from '@/utils/date-util';

interface ReplyItemProps {
  // 回复数据
  reply: CommentDetail;
  // 文章ID
  articleId: string;
  // 根评论ID
  rootCommentId: string;
}

defineOptions({
  name: 'ReplyItem',
});

const props = defineProps<ReplyItemProps>();

const emit = defineEmits<{
  reply: [target: { userId: string; userNickname: string; commentId: string }];
}>();

const authStore = useAuthenticationStore();

// 本地状态
const localReply = ref({ ...props.reply });

// 点赞图标类名
const likeIconClass = computed(() => {
  return localReply.value.liked
    ? 'text-red-500!'
    : 'text-gray-400! hover:text-red-500!';
});

/**
 * 点赞/取消点赞（防抖处理）
 */
const handleLike = debounce(async () => {
  if (!authStore.isLoggedIn) {
    warningNotification('请先登录');
    return;
  }

  const previousLiked = localReply.value.liked;
  const previousCount = localReply.value.likeCount;

  localReply.value.liked = !previousLiked;
  localReply.value.likeCount += previousLiked ? -1 : 1;

  try {
    if (previousLiked) {
      await asyncRequest(commentApiModule.apis.unLike, {
        params: { id: props.reply.id },
      });
    } else {
      await asyncRequest(commentApiModule.apis.like, {
        params: { id: props.reply.id },
      });
    }
  } catch (error) {
    console.log(error);
    localReply.value.liked = previousLiked;
    localReply.value.likeCount = previousCount;
    errorNotification('操作失败，请稍后重试');
  }
}, 300);

/**
 * 点击回复
 */
function handleReply() {
  if (!authStore.isLoggedIn) {
    warningNotification('请先登录后再回复');
    return;
  }

  emit('reply', {
    userId: props.reply.userId,
    userNickname: props.reply.userNickname,
    commentId: props.reply.id,
  });
}
</script>

<template>
  <div class="py-3 border-b border-solid border-[#e8e8e8] last:border-none">
    <div class="flex gap-3">
      <!-- 头像 -->
      <AvatarDisplay
        :src="localReply.userAvatar"
        :name="localReply.userNickname"
        :size="32"
        shape="circle"
      />

      <div class="flex-1">
        <!-- 用户名和时间 -->
        <div class="flex items-center gap-2 mb-1">
          <span class="font-semibold text-sm">{{ localReply.userNickname }}</span>
          <span class="text-xs text-gray-400">{{ formatRelativeTime(localReply.createTime as string) }}</span>
        </div>

        <!-- 回复内容 -->
        <div class="reply-content text-sm text-gray-700 mb-2">
          <span v-if="localReply.replyUserNickname" class="text-[#bbb] font-medium mr-1">
            回复：{{ localReply.replyUserNickname }}
          </span>
          {{ localReply.content }}
        </div>

        <!-- 操作栏 -->
        <div class="reply-actions flex items-center gap-4 text-xs text-gray-500">
          <!-- 点赞 -->
          <ElButton
            class="flex items-center gap-1 transition-colors"
            :class="likeIconClass"
            text
            @click="handleLike"
          >
            <ElIcon>
              <Icon icon="ant-design:like-outlined" />
            </ElIcon>
            <span>{{ localReply.likeCount }}</span>
          </ElButton>

          <!-- 回复 -->
          <ElButton
            class="flex items-center gap-1 text-gray-400! hover:text-blue-500! transition-colors cursor-pointer"
            text
            @click="handleReply"
          >
            <ElIcon>
              <ChatDotRound />
            </ElIcon>
            <span>回复</span>
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
