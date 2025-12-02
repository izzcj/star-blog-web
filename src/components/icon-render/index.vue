<script setup lang="ts">
import * as ElementPlusIcons from '@element-plus/icons-vue';
import { QuestionFilled } from '@element-plus/icons-vue';
import SvgIcon from '@/components/icon-render/components/svg-icon/index.vue';
import { parseIconValue, normalizeIconValue } from '@/utils/icon-utils';

interface Props {
  // 图标值
  iconValue?: string;
  // 图标大小
  size?: string | number;
  // 图标颜色
  color?: string;
  // 图标类名
  className?: string;
}

defineOptions({
  name: 'SmartIconRender',
});

const props = withDefaults(defineProps<Props>(), {
  iconValue: '',
  size: '20px',
  color: '',
  className: '',
});

/**
 * 解析图标信息
 */
const parsedIcon = computed(() => {
  const normalized = normalizeIconValue(props.iconValue);
  return parseIconValue(normalized);
});

/**
 * 获取 Element Plus 图标组件
 */
const elementPlusIconComponent = computed(() => {
  if (parsedIcon.value.type !== 'ep' || !parsedIcon.value.name) {
    return null;
  }
  return (ElementPlusIcons as any)[parsedIcon.value.name] || null;
});

/**
 * 获取样式对象
 */
const styleObject = computed(() => {
  const styles: Record<string, string> = {};

  if (props.size) {
    const sizeValue = typeof props.size === 'number' ? `${props.size}px` : props.size;
    styles.width = sizeValue;
    styles.height = sizeValue;
    styles.fontSize = sizeValue;
  }

  if (props.color) {
    styles.color = props.color;
  }

  return styles;
});

/**
 * 是否显示占位符（无效图标）
 */
const showPlaceholder = computed(() => {
  if (!parsedIcon.value.name) {
    return true;
  }

  // Element Plus 图标不存在
  return parsedIcon.value.type === 'ep' && !elementPlusIconComponent.value;
});
</script>

<template>
  <div class="inline-flex items-center justify-center" :class="className" :style="styleObject">
    <!-- Element Plus 图标 -->
    <component
      :is="elementPlusIconComponent"
      v-if="parsedIcon.type === 'ep' && elementPlusIconComponent"
      :style="styleObject"
    />

    <!-- 本地 SVG 图标 -->
    <SvgIcon
      v-else-if="parsedIcon.type === 'svg' && parsedIcon.name"
      :name="parsedIcon.name"
      :width="typeof size === 'number' ? `${size}px` : size"
      :height="typeof size === 'number' ? `${size}px` : size"
      :color="color"
    />

    <!-- 占位符（无效图标） -->
    <ElIcon v-else-if="showPlaceholder" :style="styleObject">
      <QuestionFilled />
    </ElIcon>
  </div>
</template>

<style scoped lang="scss">
</style>
