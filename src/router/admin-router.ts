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
        name: 'Index',
        path: '',
        component: () => import('@/views/admin/index.vue'),
      },
    ],
  },
  {
    path: '/redirect',
    component: AdminLayout,
    children: [
      {
        name: 'redirect',
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect.vue'),
        meta: {
          title: '重定向',
          keepAlive: false,
          topLevel: true,
        },
      },
    ],
  },
];

export default adminRouter;
