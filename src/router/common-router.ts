import type { RouteRecordRaw } from 'vue-router';
import { DefaultLayout } from '@/layout/index';

/**
 * 通用路由
 *
 * @author Ale
 * @version 1.0.0
 * @since 2024/8/30
 */
const commonRouter: RouteRecordRaw[] = [
  // 首页
  {
    path: '/',
    component: DefaultLayout,
    meta: {
      title: '首页',
      keepAlive: true,
      topLevel: true,
      icon: 'home',
    },
    children: [
      {
        name: 'Index',
        path: '',
        component: () => import('@/views/index.vue'),
      },
    ],
  },
  // 个人信息
  {
    path: '/user',
    component: DefaultLayout,
    meta: {
      title: '用户',
      keepAlive: false,
      topLevel: true,
      hidden: true,
    },
    children: [
      {
        name: 'UserInfo',
        path: '/user/info',
        meta: {
          title: '个人信息',
          keepAlive: false,
          topLevel: false,
        },
        component: () => import('@/views/user/info/index.vue'),
      },
    ],
  },
  {
    path: '/redirect',
    component: DefaultLayout,
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

export default commonRouter;
