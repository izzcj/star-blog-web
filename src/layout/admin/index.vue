<script setup lang="ts">
import AppMain from '@/layout/components/app-main/index.vue';
import AdminAside from '@/layout/admin/components/aside/index.vue';
import AdminNavBar from '@/layout/admin/components/nav-bar/index.vue';

defineOptions({
  name: 'AdminLayout',
});

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
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
      <ElContainer v-else class="h-dvh w-dvw relative bg-slate-200">
        <ElCard>
          <ElAside width="200px">
            <AdminAside />
          </ElAside>
        </ElCard>
        <ElMain class="admin-main">
          <ElCard class="h-dvh">
            <div class="pb-3">
              <AdminNavBar />
            </div>
            <AppMain />
          </ElCard>
        </ElMain>
      </ElContainer>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.admin-main {
  --el-main-padding: 0 0 0 10px;

  :deep(.el-card) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :deep(.el-card__body) {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
}
</style>
