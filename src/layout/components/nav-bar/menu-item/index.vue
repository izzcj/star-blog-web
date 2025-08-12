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
  if (route.children?.length && route.meta?.topLevel) {
    if (route.children.length <= 1) {
      onlyOneChild.value = route.children[0];
      return true;
    }
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
}
</script>

<template>
  <ElMenuItem v-if="showMenuItem()" :index="resolvePath()" :route="route" @click="clickMenuItem">
    <SvgIcon :name="route.meta?.icon || onlyOneChild?.meta?.icon" />{{ route?.meta?.title || onlyOneChild?.meta?.title }}
  </ElMenuItem>
  <ElSubMenu v-else :index="resolvePath()">
    <template #title>
      <SvgIcon :name="route.meta?.icon" />{{ route?.meta?.title }}
    </template>
    <MenuItem v-for="child of route?.children" :key="child.path" :route="child" :base-path="resolvePath()" />
  </ElSubMenu>
</template>

<style scoped lang="less">

</style>
