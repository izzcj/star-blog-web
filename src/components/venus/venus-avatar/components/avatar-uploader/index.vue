<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue';

interface AvatarUploaderProps {
  // 是否禁用
  disabled?: boolean;
  // 是否已有头像
  hasAvatar?: boolean;
}

interface AvatarUploaderEmits {
  (e: 'upload', file: File): void;
  (e: 'delete'): void;
}

defineOptions({
  name: 'AvatarUploader',
});

const props = withDefaults(defineProps<AvatarUploaderProps>(), {
  disabled: false,
  hasAvatar: false,
});

const emit = defineEmits<AvatarUploaderEmits>();

// 文件输入引用
const fileInputRef = ref<HTMLInputElement>();

// 是否悬停
const isHovering = ref(false);

/**
 * 文件选择处理
 */
function handleClick() {
  if (props.disabled) {
    return;
  }
  fileInputRef.value?.click();
}

/**
 * 文件选择变化
 *
 * @param event 事件
 */
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    emit('upload', file);
  }

  // 清空 input 值，允许重复选择同一文件
  target.value = '';
}

/**
 * 删除头像
 *
 * @param event 事件
 */
function handleDelete(event: Event) {
  event.stopPropagation();
  emit('delete');
}
</script>

<template>
  <div
    class="inline-block relative cursor-pointer select-none"
    :class="{ 'cursor-not-allowed': props.disabled }"
    @click="handleClick"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- 默认插槽，显示头像 -->
    <slot />

    <!-- 悬停遮罩 -->
    <div
      v-if="isHovering && !props.disabled"
      class="absolute flex items-center justify-center"
    >
      <div class="actions flex gap-3">
        <!-- 删除按钮 -->
        <ElIcon
          v-if="props.hasAvatar"
          class="action-icon text-white cursor-pointer hover:text-red-400 transition-colors"
          :size="24"
          @click="handleDelete"
        >
          <Delete />
        </ElIcon>
      </div>
    </div>

    <!-- 文件输入 -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/jpeg,image/png,image/jpg,image/bmp"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<style scoped lang="scss">
</style>
