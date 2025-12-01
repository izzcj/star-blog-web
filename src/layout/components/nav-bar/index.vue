<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router';
import { Fold } from '@element-plus/icons-vue';
import MenuItem from './menu-item/index.vue';
import Logo from './logo/index.vue';
import { useAppSettingsStore } from '@/stores/app-settings-store';
import { useDynamicRouteStore } from '@/stores/dynamic-route-store';
import CommonRouterPath from '@/enums/common-router-path';
import commonRouters from '@/router/common-router';
import UserDropdown from '@/layout/components/nav-bar/user-dropdown/index.vue';

let routers: RouteRecordRaw[] = [];

const dynamicRoutesStore = useDynamicRouteStore();
const appSettingsStore = useAppSettingsStore();
const showDrawer = ref(false);

commonRouters.forEach(router => {
  if (router.meta && !router.meta?.hidden) {
    routers.push(router);
  }
});

// 过滤重定向路由
routers = routers.filter(router => {
  return router.path !== CommonRouterPath.REDIRECT;
});
if (!isEmpty(dynamicRoutesStore.routes)) {
  dynamicRoutesStore.routes.forEach(route => {
    routers.push(route);
  });
}
const logType = ref('TEXT');
const logText = ref('StarBlog');
const showUserInfo = ref(true);
const currentRoute = useRoute();

/**
 * 获取当前路由应激活的菜单路径
 * 处理子路由激活父菜单的场景
 *
 * @param currentPath 当前路由路径
 * @param routes 菜单路由列表
 * @returns 应激活的菜单路径
 */
function getActiveMenuPath(currentPath: string, routes: RouteRecordRaw[]): string {
  let bestMatch = '';

  for (const route of routes) {
    // 跳过隐藏的顶级路由
    if (route.meta?.hidden && route.meta?.topLevel) {
      continue;
    }

    const routePath = route.path;

    // 精确匹配
    if (currentPath === routePath) {
      return routePath;
    }

    // 前缀匹配
    if (currentPath.startsWith(`${routePath}/`)) {
      // 如果有子路由，递归查找
      if (route.children && route.children.length > 0) {
        const childMatch = getActiveMenuPath(currentPath, route.children);
        if (childMatch !== currentPath) {
          return childMatch;
        }
      }

      // 更新最长匹配
      if (routePath.length > bestMatch.length) {
        bestMatch = routePath;
      }
    }
  }

  return bestMatch || currentPath;
}

const activeRoute = computed(() => {
  return getActiveMenuPath(currentRoute.path, routers);
});

/**
 * 获取ElCol的Span
 *
 * @param part 类型
 */
function getColSpan(part: 'logo' | 'menu' | 'user') {
  const base = { logo: 3, user: 2 };
  if (part === 'logo') {
    return base.logo;
  }
  if (part === 'user') {
    return showUserInfo.value ? base.user : 0;
  }
  if (part === 'menu') {
    return 24 - base.logo - (showUserInfo.value ? base.user : 0);
  }
}

/**
 * 菜单项点击事件
 */
function clickMenuItem() {
  showDrawer.value = false;
}
</script>

<template>
  <div v-show="!appSettingsStore.isMobile" class="bg-transparent">
    <ElRow :gutter="10">
      <ElCol :span="getColSpan('logo')">
        <Logo :type="logType" :logo="logText" />
      </ElCol>
      <ElCol :span="getColSpan('menu')">
        <ElMenu
          class="header-menu header-menu_horizontal"
          :ellipsis="false"
          mode="horizontal"
          :router="true"
          :default-active="activeRoute"
          popper-class="glow-effect"
        >
          <template v-for="route of routers" :key="route.path">
            <MenuItem :route="route" :base-path="route.path" />
          </template>
        </ElMenu>
      </ElCol>
      <ElCol v-if="showUserInfo" :span="getColSpan('user')">
        <UserDropdown />
      </ElCol>
    </ElRow>
  </div>
  <!-- 移动端 -->
  <div v-show="appSettingsStore.isMobile" class="venus-center">
    <Logo :type="logType" :logo="logText" class="mr-auto" />
    <ElIcon class="ml-auto" size="30" @click="showDrawer = !showDrawer">
      <Fold />
    </ElIcon>
    <ElDrawer v-model="showDrawer" size="40%" :show-close="false">
      <template #header>
        <UserDropdown />
      </template>
      <ElMenu
        :ellipsis="false"
        :router="true"
        :default-active="activeRoute"
        class="header-menu header-menu_vertical"
      >
        <template v-for="route of routers" :key="route.path">
          <MenuItem :route="route" :base-path="route.path" @click="clickMenuItem" />
        </template>
      </ElMenu>
    </ElDrawer>
  </div>
</template>

<style lang="scss" scoped>
.header-menu {
  --el-menu-active-color: #ffd04b;
  --el-menu-item-font-size: 16px;
  &_horizontal {
    display: flex;
    justify-content: flex-end;
    border-bottom: none !important;
    --el-menu-hover-bg-color: var(--venus-menu-bg--color);
    --el-menu-bg-color: transparent;
    --el-menu-text-color: rgb(255, 255, 255);
  }
  &_vertical {
    width: 100%;
    border-right: none;
  }
}
</style>
