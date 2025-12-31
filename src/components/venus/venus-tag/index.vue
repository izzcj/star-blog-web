<script setup lang="ts">
import { venusTagProps } from './props';

defineOptions({
  name: 'VenusTag',
});

const props = defineProps({
  ...venusTagProps,
});

const emit = defineEmits<{
  close: [event: Event];
}>();

// 标签尺寸与图标尺寸映射
const iconSizeMap: Record<string, string> = {
  large: '16px',
  default: '14px',
  small: '12px',
};

// 显示文本
const displayName = computed(() => props.tag?.name || props.name || '');

// 标签颜色
const tagColor = computed(() => props.tag?.color || props.color);

// 图标值
const iconValue = computed(() => props.tag?.icon || props.icon);

// 图标尺寸
const iconSize = computed(() => iconSizeMap[props.size]);

/**
 * 关闭事件处理
 */
function handleClose(event: Event) {
  emit('close', event);
}
</script>

<template>
  <ElTag
    :color="tagColor"
    :size="props.size"
    :effect="props.effect"
    :closable="props.closable"
    :disable-transitions="props.disableTransitions"
    :hit="props.hit"
    :round="props.round"
    @close="handleClose"
  >
    <div class="inline-flex items-center gap-1">
      <IconRender
        v-if="iconValue"
        :icon="iconValue"
        :size="iconSize"
      />
      {{ displayName }}
    </div>
  </ElTag>
</template>

<style scoped lang="scss">
</style>
