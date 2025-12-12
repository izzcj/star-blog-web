<script setup lang="ts">
import CommentInput from './components/comment-input/index.vue';
import CommentItem from './components/comment-item/index.vue';
import { asyncRequest } from '@/utils/request-util';
import commentApiModule from '@/api/blog/comment';
import { errorNotification, successNotification } from '@/element-plus/notification';

interface CommentSectionProps {
  // 文章ID
  articleId: string;
}

defineOptions({
  name: 'CommentSection',
});

const props = defineProps<CommentSectionProps>();

// 评论状态
const commentState = reactive({
  comments: [] as CommentDetail[],
  currentPage: 1,
  pageSize: 10,
  total: 0,
  loading: false,
  hasMore: true,
});

/**
 * 加载评论列表
 *
 * @param append 是否追加到现有列表
 */
async function loadComments(append = false) {
  commentState.loading = true;
  try {
    const response = await asyncRequest<PageData<CommentDetail>>(commentApiModule.apis.fetchPage, {
      params: {
        articleId: props.articleId,
        rootId: '0',
        page: commentState.currentPage,
        size: commentState.pageSize,
      },
    });

    const newComments = response.data.data;

    if (append) {
      commentState.comments.push(...newComments);
    } else {
      commentState.comments = newComments;
    }

    commentState.total = response.data.total;
    commentState.hasMore = commentState.comments.length < commentState.total;
  } finally {
    commentState.loading = false;
  }
}

/**
 * 加载更多评论
 */
async function loadMoreComments() {
  if (commentState.loading || !commentState.hasMore) {
    return;
  }
  commentState.currentPage++;
  await loadComments(true);
}

/**
 * 发表评论
 *
 * @param content 评论内容
 */
async function handleCommentSubmit(content: string) {
  try {
    await asyncRequest(commentApiModule.apis.create, {
      data: {
        articleId: props.articleId,
        content,
        rootId: '',
        parentId: '',
        replyUserId: '',
      },
    });

    successNotification('评论发表成功');

    // 重新加载第一页
    commentState.currentPage = 1;
    await loadComments(false);
  } catch {
    errorNotification('评论发表失败，请稍后重试');
  }
}

// 组件挂载时加载评论
onMounted(() => {
  loadComments();
});
</script>

<template>
  <ElCard shadow="never">
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">评论 ({{ commentState.total }})</span>
      </div>
    </template>

    <!-- 评论列表 -->
    <div v-loading="commentState.loading && commentState.currentPage === 1">
      <CommentItem
        v-for="comment of commentState.comments"
        :key="comment.id"
        :comment="comment"
        :article-id="articleId"
        :reply-count="comment.replyCount"
      />
    </div>

    <!-- 评论输入框 -->
    <CommentInput
      mode="comment"
      placeholder="发表你的评论..."
      @submit="handleCommentSubmit"
    />

    <!-- 加载更多按钮 -->
    <div v-if="commentState.hasMore" class="flex justify-center py-4">
      <ElButton
        :loading="commentState.loading"
        text
        @click="loadMoreComments"
      >
        {{ commentState.loading ? '加载中...' : '更多' }}
      </ElButton>
    </div>

    <!-- 空状态 -->
    <div v-if="commentState.total === 0 && !commentState.loading" class="py-10">
      <ElEmpty description="暂无评论，快来发表第一条评论吧~" />
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
</style>
