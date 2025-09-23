<script setup lang="ts">
import path from 'path-browserify';
import type { RouteRecordRaw } from 'vue-router';
import type { MenuItemRegistered } from 'element-plus';
import { useDynamicRouteStore } from '@/stores/dynamic-route-store';
import MenuItem from '@/layout/components/nav-bar/menu-item/index.vue';

defineOptions({
  name: 'MenuItem',
});

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'click', item: MenuItemRegistered): void;
}>();

interface Props {
  /**
   * 路由
   */
  route: RouteRecordRaw;
  /**
   * 基路径
   */
  basePath?: string;
}

const dynamicRoutesStore = useDynamicRouteStore();
// 唯一子级
const onlyOneChild = ref();

/**
 * 判断是否只有一个子级
 *
 * @param route 路由
 */
function isOnlyOneChildren(route: RouteRecordRaw) {
  let showChildCount = 0;
  if (route.children?.length && route.meta?.topLevel) {
    route.children.forEach(child => {
      if (!child.meta?.hidden) {
        showChildCount++;
      }
      if (showChildCount > 1) {
        return false;
      }
      onlyOneChild.value = child;
    });
    return showChildCount === 1;
  }
  return false;
}

/**
 * 处理菜单路径
 */
function resolvePath() {
  return props.basePath ? path.resolve(props.basePath, props.route.path) : props.route.path;
}

/**
 * 是否显示菜单项
 */
function showMenuItem() {
  return !props.route.children || props.route.children.length === 0 || isOnlyOneChildren(props.route);
}

/**
 * 菜单项点击事件
 */
function clickMenuItem(item: MenuItemRegistered) {
  dynamicRoutesStore.setActiveRouteIndex(item.index);
  emit('click', item);
}
</script>

<template>
  <ElMenuItem v-if="showMenuItem()" :index="resolvePath()" :route="route" @click="clickMenuItem">
    <template #title>
      <SvgIcon :name="route.meta?.icon || onlyOneChild?.meta?.icon" />
      <span class="inline-block min-w-[4em] md:text-center">{{ route?.meta?.title || onlyOneChild?.meta?.title }}</span>
    </template>
  </ElMenuItem>
  <ElSubMenu v-else :index="resolvePath()">
    <template #title>
      <SvgIcon :name="route.meta?.icon" />
      <span class="inline-block min-w-[4em] md:text-center">{{ route?.meta?.title }}</span>
    </template>
    <MenuItem v-for="child of route?.children" :key="child.path" :route="child" :base-path="resolvePath()" @click="clickMenuItem" />
  </ElSubMenu>
</template>

<style scoped lang="scss">

</style>
