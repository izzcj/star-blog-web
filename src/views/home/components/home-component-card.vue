<script setup lang="ts">
interface Props {
  // 标题
  title: string;
  // header样式
  headerClass?: string;
  // body样式
  bodyClass?: string;
}
const props = defineProps<Props>();

/**
 * 合并header样式
 */
function mergeHeaderClass(): string {
  if (props.headerClass) {
    return `${props.headerClass}`;
  }
  return 'py-3! px-4!';
}

/**
 * 合并body样式
 */
function mergeBodyClass(): string {
  if (props.bodyClass) {
    return `${props.bodyClass}`;
  }
  return 'p-4!';
}
</script>

<template>
  <ElCard class="home-component-card" :header-class="mergeHeaderClass()" :body-class="mergeBodyClass()">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-base font-bold text-gray-700">{{ props.title }}</span>
        <slot name="header" />
      </div>
    </template>
    <slot />
  </ElCard>
</template>

<style scoped lang="scss">
.home-component-card {
  margin-bottom: 16px;
  border-radius: 12px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
  }
}
</style>
