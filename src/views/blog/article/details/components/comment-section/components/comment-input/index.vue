<script setup lang="ts">
import { useAuthenticationStore } from '@/stores/authentication-store';
import { warningNotification } from '@/element-plus/notification';

interface CommentInputProps {
  // 模式：评论或回复
  mode: 'comment' | 'reply';
  // 占位符文本
  placeholder?: string;
  // 最大长度
  maxLength?: number;
}

defineOptions({
  name: 'CommentInput',
});

const props = withDefaults(defineProps<CommentInputProps>(), {
  placeholder: '发表评论...',
  maxLength: 500,
});

const emit = defineEmits<{
  submit: [content: string];
  cancel: [];
}>();

const authStore = useAuthenticationStore();

// 输入内容
const content = ref('');
// 输入框引用
const textareaRef = ref();

// 剩余字符数
const remainingChars = computed(() => {
  return props.maxLength - content.value.length;
});

// 是否可提交
const canSubmit = computed(() => {
  return content.value.trim().length > 0 && content.value.length <= props.maxLength;
});

/**
 * 聚焦输入框
 */
function focus() {
  textareaRef.value?.focus();
}

/**
 * 提交评论
 */
function handleSubmit() {
  // 检查登录状态
  if (!authStore.isLoggedIn) {
    warningNotification('需要登录后才能评论');
    return;
  }

  // 验证内容
  if (!canSubmit.value) {
    return;
  }

  // 触发提交事件
  emit('submit', content.value.trim());

  // 清空内容
  content.value = '';
}

/**
 * 取消评论
 */
function handleCancel() {
  emit('cancel');
}

// 暴露方法给父组件
defineExpose({
  focus,
});
</script>

<template>
  <div class="mb-4">
    <ElInput
      ref="textareaRef"
      v-model="content"
      type="textarea"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :rows="mode === 'comment' ? 4 : 3"
      :autosize="{ minRows: mode === 'comment' ? 4 : 3, maxRows: 8 }"
      show-word-limit
    />

    <div class="flex justify-between items-center mt-2">
      <span class="text-xs text-gray-400">
        剩余 {{ remainingChars }} 字
      </span>

      <div class="flex gap-2">
        <!-- 对于回复模式，添加取消按钮 -->
        <ElButton
          v-if="mode === 'reply'"
          size="small"
          @click="handleCancel"
        >
          取消
        </ElButton>

        <ElButton
          type="primary"
          size="small"
          :disabled="!canSubmit"
          @click="handleSubmit"
        >
          {{ mode === 'comment' ? '发表评论' : '发表回复' }}
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
