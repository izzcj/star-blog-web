<script setup lang="ts">
import AdminNavBar from '@/layout/admin/components/nav-bar/index.vue';
import AppMain from '@/layout/components/app-main/index.vue';
import AdminAside from '@/layout/admin/components/aside/index.vue';

defineOptions({
  name: 'AdminLayout',
});
</script>

<template>
  <ElContainer>
    <ElHeader>
      <AdminNavBar />
    </ElHeader>
    <ElContainer>
      <ElAside>
        <AdminAside />
      </ElAside>
      <ElMain>
        <AppMain />
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style scoped lang="scss">

</style>
