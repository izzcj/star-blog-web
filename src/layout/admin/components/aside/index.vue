<script setup lang="ts">
import {
  Notebook,
  Reading,
  Setting,
  Menu,
  User,
  UserFilled,
  PriceTag,
  ChatDotRound,
  HomeFilled,
  Promotion,
  Expand,
  Fold,
} from '@element-plus/icons-vue';
import Logo from '@/layout/components/nav-bar/logo/index.vue';
import { useAppSettingsStore } from '@/stores/app-settings-store';

defineOptions({
  name: 'AdminAside',
});

const logText = ref('管理后台');

const route = useRoute();
const router = useRouter();

const appSettingsStore = useAppSettingsStore();

const collapse = computed(() => {
  return appSettingsStore.isMobile || appSettingsStore.asideCollapsed;
});

const activeMenu = computed(() => {
  if (route.meta && route.meta.activeMenu) {
    return route.meta.activeMenu;
  }
  return route.path;
});

const menus = shallowRef([
  {
    id: 'admin-home',
    title: '首页',
    icon: HomeFilled,
    path: '/admin',
  },
  {
    id: 'system-config',
    title: '系统配置',
    icon: Setting,
    path: '/admin/system/config',
  },
  {
    id: 'menu-management',
    title: '菜单管理',
    icon: Menu,
    path: '/admin/system/menu',
  },
  {
    id: 'role-management',
    title: '角色管理',
    icon: UserFilled,
    path: '/admin/system/role',
  },
  {
    id: 'user-management',
    title: '用户管理',
    icon: User,
    path: '/admin/system/user',
  },
  {
    id: 'dict-management',
    title: '字典管理',
    icon: Notebook,
    path: '/admin/system/dict',
  },
  {
    id: 'notice-management',
    title: '系统通知',
    icon: Promotion,
    path: '/admin/system/notice',
  },
  {
    id: 'tag-management',
    title: '标签管理',
    icon: PriceTag,
    path: '/admin/blog/tag',
  },
  {
    id: 'article-management',
    title: '文章管理',
    icon: Reading,
    path: '/admin/blog/article',
  },
  {
    id: 'comment-management',
    title: '评论管理',
    icon: ChatDotRound,
    path: '/admin/blog/comment',
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

/**
 * 切换侧边栏折叠状态
 */
function handleToggleCollapse() {
  appSettingsStore.toggleAsideCollapse();
}
</script>

<template>
  <div class="h-full overflow-hidden transition-all duration-300 ease-in-out">
    <!-- Logo区域 -->
    <div
      class="h-[70px] py-3 px-4 border-r border-r-white flex items-center
             justify-between relative transition-all duration-300 ease-in-out"
      :class="{ 'aside-logo-wrapper--collapsed': collapse }"
    >
      <Logo :text="collapse ? '' : logText" text-class="logo-text-class" />

      <!-- 折叠按钮 (仅桌面端显示) -->
      <div
        v-if="!appSettingsStore.isMobile"
        class="aside-collapse-btn"
        :class="{ 'aside-collapse-btn--collapsed': appSettingsStore.asideCollapsed }"
        @click="handleToggleCollapse"
      >
        <ElIcon class="aside-collapse-btn__icon">
          <Fold v-if="!appSettingsStore.asideCollapsed" />
          <Expand v-else />
        </ElIcon>
      </div>
    </div>

    <!-- 菜单区域 -->
    <ElMenu
      :default-active="activeMenu"
      class="border-r-0"
      :collapse="collapse"
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
        <template #title>
          <span>{{ menu.title }}</span>
        </template>
      </ElMenuItem>
    </ElMenu>
  </div>
</template>

<style scoped lang="scss">
.aside-logo-wrapper--collapsed {
  justify-content: center;
  padding: 16px 8px;
}

// 折叠按钮样式
.aside-collapse-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
}

.aside-collapse-btn--collapsed {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.aside-collapse-btn__icon {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  transition: transform 0.35s ease-in-out;
}

:deep(.logo-text-class) {
  color: rgba(0, 0, 0, 0.8) !important;
  font-weight: 1000;
  transition: opacity 0.2s ease-in-out;
}

:deep(.el-menu) {
  border-right: none;
}

// 菜单项样式优化
:deep(.el-menu-item) {
  position: relative;
  transition: all 0.2s ease-in-out;

  // Hover悬浮效果
  &:hover {
    background-color: #f5f7fa !important;

    .el-icon {
      transform: scale(1.05);
    }

    // 左侧预提示条
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background-color: rgba(64, 158, 255, 0.3);
      transition: all 0.2s ease-in-out;
    }
  }

  // 激活状态高亮样式
  &.is-active {
    background-color: rgba(64, 158, 255, 0.1) !important;
    font-weight: 600;
    color: #303133 !important;

    // 左侧色条
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #409EFF;
      border-radius: 0 2px 2px 0;
    }

    .el-icon {
      color: #409EFF;
    }
  }

  // 点击反馈效果
  &:active {
    transform: scale(0.98);
    transition: transform 0.05s ease-in-out;
  }

  .el-icon {
    transition: all 0.2s ease-in-out;
  }
}
</style>
