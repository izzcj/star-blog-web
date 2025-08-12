<script lang="ts" setup>
import { useAppSettingsStore } from '@/stores/app-settings-store';
import { useDynamicRouteStore } from '@/stores/dynamic-route-store';

const appSettingsStore = useAppSettingsStore();
const dynamicRoutesStore = useDynamicRouteStore();
// 需要缓存的路由组件
const keepAliveRouteComponents = computed(() => dynamicRoutesStore.cachedRoutes);
const transitionName = computed(() => {
  return appSettingsStore.pageAnimation ? appSettingsStore.pageAnimationType : '';
});
</script>

<template>
  <RouterView #default="{ Component, route }">
    <Transition :name="transitionName" mode="out-in" appear>
      <KeepAlive :include="keepAliveRouteComponents">
        <Component :is="Component" :key="route.fullPath" />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style lang="less" scoped>

</style>
