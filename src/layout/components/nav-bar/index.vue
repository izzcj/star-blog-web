<script setup lang="ts">
import MenuItem from './menu-item/index.vue';
import Logo from './logo/index.vue';
import { useDynamicRouteStore } from '@/stores/dynamic-route-store';
import CommonRouterPath from '@/enum/common-router-path';
import commonRouters from '@/router/common-router';

let routers: any[] = [];
const dynamicRoutesStore = useDynamicRouteStore();
commonRouters.forEach(router => {
  if (!router.meta?.hidden) {
    routers.push(router);
  }
});

const avatar = ref('https://www.zmtc.com/wp-content/uploads/2023/0308/20230308090400294.jpg');

// 过滤重定向路由
routers = routers.filter(router => {
  return router.path !== CommonRouterPath.REDIRECT;
});
if (!isEmpty(dynamicRoutesStore.routes)) {
  dynamicRoutesStore.routes.forEach(route => {
    routers.push(route);
  });
}

const router = useRouter();
const currentRoute = useRoute();
const selectedMenuIndex = ref();
const logText = ref('StarBlog');
const logType = ref('TEXT');

selectedMenuIndex.value = currentRoute.path;
if (isEmpty(selectedMenuIndex.value)) {
  selectedMenuIndex.value = CommonRouterPath.HOME;
}
// 更新 selectedMenuIndex
watch(
  () => currentRoute.path,
  newPath => {
    selectedMenuIndex.value = newPath;
  },

  { immediate: true },
);

/**
 * 个人信息点击事件
 */
function clickUserInfo() {
  router.push('/user/info');
}
</script>

<template>
  <div class="nav-bar">
    <ElRow :gutter="10">
      <ElCol :span="3">
        <Logo :type="logType" :logo="logText" />
      </ElCol>
      <ElCol :span="19">
        <ElMenu
          class="right-aligned-menu"
          :ellipsis="false"
          mode="horizontal"
          :router="true"
          :default-active="selectedMenuIndex"
          popper-class="glow-effect"
        >
          <template v-for="route of routers" :key="route.path">
            <MenuItem :route="route" :base-path="route.path" />
          </template>
        </ElMenu>
      </ElCol>
      <ElCol v-if="false" :span="2">
        <div class="venus-center info">
          <ElDropdown>
            <ElAvatar :size="50" :src="avatar" />
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem @click="clickUserInfo">
                  个人信息
                </ElDropdownItem>
                <ElDropdownItem>系统设置</ElDropdownItem>
                <ElDropdownItem>退出登录</ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
      </ElCol>
    </ElRow>
  </div>
</template>

<style lang="less" scoped>
.nav-bar {
  // 透明背景
  background-color: transparent;

  .info {
    padding-top: 5px;
  }
}
.right-aligned-menu {
  display: flex;
  justify-content: flex-end;
}
</style>
