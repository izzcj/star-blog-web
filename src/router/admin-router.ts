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
    path: '/admin/blog',
    component: AdminLayout,
    meta: {
      title: '博客管理',
      keepAlive: true,
      topLevel: true,
    },
    children: [
      {
        name: 'BlogManagement',
        path: '',
        component: () => import('@/views/admin/blog/index.vue'),
      },
      {
        // 编辑博客
        path: 'edit/:id',
        name: 'BlogEdit',
        meta: {
          title: '编辑博客',
          keepAlive: true,
          topLevel: false,
          hidden: true,
        },
        component: () => import('@/views/admin/blog/components/editor/index.vue'),
      },
      {
        // 新增博客
        path: 'create',
        name: 'BlogCreate',
        meta: {
          title: '新增博客',
          keepAlive: true,
          topLevel: false,
          hidden: true,
        },
        component: () => import('@/views/admin/blog/components/editor/index.vue'),
      },
    ],
  },
];

export default adminRouter;
