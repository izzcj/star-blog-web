import type { RouteRecordRaw } from 'vue-router';
import { AdminLayout } from '@/layout/index';

/**
 * 管理员路由
 *
 * @author Ale
 * @version 1.0.0 2025/10/22 15:54
 */
export const adminRouter: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'admin',
    component: AdminLayout,
    meta: {
      title: '管理后台',
      keepAlive: true,
      topLevel: true,
    },
    children: [
      {
        name: 'AdminIndex',
        path: '',
        component: () => import('@/views/admin/index.vue'),
      },
    ],
  },
  {
    path: '/admin/system/config',
    component: AdminLayout,
    meta: {
      title: '系统配置',
      keepAlive: true,
      topLevel: true,
    },
    children: [
      {
        name: 'SystemConfig',
        path: '',
        meta: {
          title: '系统配置',
          keepAlive: true,
          topLevel: false,
          hidden: true,
        },
        component: () => import('@/views/admin/system/system-config/index.vue'),
      },
    ],
  },
  {
    path: '/admin/system/menu',
    component: AdminLayout,
    meta: {
      title: '菜单管理',
      keepAlive: true,
      topLevel: true,
    },
    children: [
      {
        name: 'MenuManagement',
        path: '',
        meta: {
          title: '菜单管理',
          keepAlive: true,
          topLevel: false,
        },
        component: () => import('@/views/admin/system/menu/index.vue'),
      },
    ],
  },
  {
    path: '/admin/system/dict',
    component: AdminLayout,
    meta: {
      title: '字典管理',
      keepAlive: true,
      topLevel: true,
    },
    children: [
      {
        name: 'DictManagement',
        path: '',
        component: () => import('@/views/admin/system/dict/index.vue'),
      },
      {
        path: 'data/:dictKey',
        name: 'DictData',
        meta: {
          title: '字典数据',
          keepAlive: true,
          topLevel: false,
          hidden: true,
          activeMenu: '/admin/system/dict',
        },
        component: () => import('@/views/admin/system/dict/components/dict-data/index.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/admin/system/role',
    component: AdminLayout,
    meta: {
      title: '角色管理',
      keepAlive: true,
      topLevel: true,
    },
    children: [
      {
        name: 'RoleManagement',
        path: '',
        component: () => import('@/views/admin/system/role/index.vue'),
      },
    ],
  },
  {
    path: '/admin/system/user',
    component: AdminLayout,
    meta: {
      title: '用户管理',
      keepAlive: true,
      topLevel: true,
    },
    children: [
      {
        name: 'UserManagement',
        path: '',
        component: () => import('@/views/admin/system/user/index.vue'),
      },
    ],
  },
  {
    path: '/admin/blog/article',
    component: AdminLayout,
    meta: {
      title: '文章管理',
      keepAlive: true,
      topLevel: true,
    },
    children: [
      {
        name: 'ArticleManagement',
        path: '',
        component: () => import('@/views/admin/blog/article/index.vue'),
      },
      {
        path: 'edit/:id',
        name: 'ArticleEdit',
        meta: {
          title: '编辑文章',
          keepAlive: true,
          topLevel: false,
          hidden: true,
          activeMenu: '/admin/blog/article',
        },
        component: () => import('@/views/admin/blog/article/components/editor/index.vue'),
        props: true,
      },
      {
        path: 'create',
        name: 'ArticleCreate',
        meta: {
          title: '新增文章',
          keepAlive: true,
          topLevel: false,
          hidden: true,
          activeMenu: '/admin/blog/article',
        },
        component: () => import('@/views/admin/blog/article/components/editor/index.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/admin/blog/tag',
    component: AdminLayout,
    meta: {
      title: '标签管理',
      keepAlive: true,
      topLevel: true,
    },
    children: [
      {
        name: 'TagManagement',
        path: '',
        component: () => import('@/views/admin/blog/tag/index.vue'),
      },
    ],
  },
  {
    path: '/admin/blog/comment',
    component: AdminLayout,
    meta: {
      title: '评论管理',
      keepAlive: true,
      topLevel: true,
    },
    children: [
      {
        name: 'CommentManagement',
        path: '',
        component: () => import('@/views/admin/blog/comment/index.vue'),
      },
    ],
  },
];

export default adminRouter;
