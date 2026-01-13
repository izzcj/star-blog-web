<script setup lang="ts">
import AppMain from '@/layout/components/app-main/index.vue';
import AdminAside from '@/layout/admin/components/aside/index.vue';
import AdminNavBar from '@/layout/admin/components/nav-bar/index.vue';
import { useAppSettingsStore } from '@/stores/app-settings-store';

defineOptions({
  name: 'AdminLayout',
});

const isLoading = ref(true);

const appSettingsStore = useAppSettingsStore();
const asideWidth = computed(() => {
  return appSettingsStore.asideWidth;
});

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});

// 监听移动端状态变化，强制折叠
watch(
  () => appSettingsStore.isMobile,
  isMobile => {
    if (isMobile) {
      appSettingsStore.setAsideCollapse(true);
    }
  },
);
</script>

<template>
  <div class="relative h-screen w-screen">
    <Transition name="fade-slide" mode="out-in">
      <div v-if="isLoading" class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90">
        <div class="text-center">
          <div class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          <p class="mt-4 text-sm text-slate-500">
            正在前往后台...
          </p>
        </div>
      </div>
      <ElContainer v-else class="h-dvh w-dvw relative">
        <div class="transition-all duration-300 ease-in-out py-4 px-1 border-r-gray-200 border-r">
          <ElAside :width="asideWidth" class="transition-all duration-300 ease-in-out">
            <AdminAside />
          </ElAside>
        </div>
        <ElMain class="admin-main transition-all duration-300 ease-in-out overflow-hidden!">
          <div>
            <div class="pb-3 sticky top-0 z-0">
              <AdminNavBar />
            </div>
            <AppMain />
          </div>
        </ElMain>
      </ElContainer>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.admin-main {
  --el-main-padding: 0 0 0 10px;
}
</style>
