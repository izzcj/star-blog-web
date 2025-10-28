<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { Notebook } from '@element-plus/icons-vue';
import Logo from '@/layout/components/nav-bar/logo/index.vue';

defineOptions({
  name: 'AdminAside',
});

const logType = ref('TEXT');
const logText = ref('StarBlog');

const route = useRoute();
const router = useRouter();

const activeMenu = computed(() => {
  if (route.path.startsWith('/admin/blog')) {
    return '/admin/blog';
  }
  return route.path;
});

const menus = shallowRef([
  {
    id: 'blog-management',
    title: '博客管理',
    icon: Notebook,
    path: '/admin/blog',
  },
]);

/**
 * 处理菜单点击
 *
 * @param menuPath 菜单路径
 */
function handleMenuClick(menuPath: string) {
  router.push(menuPath);
}
</script>

<template>
  <div class="h-dvh">
    <div class="venus-center">
      <Logo :type="logType" :logo="logText" text-class="logo-text-class" />
    </div>

    <!-- 菜单区域 -->
    <ElMenu
      :default-active="activeMenu"
      class="border-r-0"
      background-color="#ffffff"
    >
      <ElMenuItem
        v-for="menu of menus"
        :key="menu.id"
        :index="menu.path"
        @click="handleMenuClick(menu.path)"
      >
        <ElIcon>
          <component :is="menu.icon" />
        </ElIcon>
        <span>{{ menu.title }}</span>
      </ElMenuItem>
    </ElMenu>
  </div>
</template>

<style scoped lang="scss">
:deep(.logo-text-class) {
  color: rgba(0, 0, 0, 0.8) !important;
  font-weight: 1000;
}

:deep(.el-menu) {
  border-right: none;
}
</style>
