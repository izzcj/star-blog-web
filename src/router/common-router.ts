import type { RouteRecordRaw } from 'vue-router';
import { DefaultLayout } from '@/layout/index';
import CommonRouterPath from '@/enum/common-router-path';

/**
 * 通用路由
 *
 * @author Ale
 * @version 1.0.0
 * @since 2024/8/30
 */
const commonRouter: RouteRecordRaw[] = [
  // 登录
  {
    path: CommonRouterPath.LOGIN,
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      keepAlive: false,
      topLevel: false,
      hidden: true,
    },
  },
  {
    path: '/',
    redirect: '/home',
  },
  // 首页
  {
    path: '/home',
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
        component: () => import('@/views/home/index.vue'),
      },
    ],
  },
  {
    path: '/blog/index',
    component: DefaultLayout,
    meta: {
      title: '博客',
      keepAlive: true,
      topLevel: true,
    },
    children: [
      {
        name: 'Blog',
        path: '',
        component: () => import('@/views/blog/index.vue'),
      },
      {
        name: 'BlogDetails',
        path: '/blog/details/:id',
        props: true,
        meta: {
          title: '博客详情',
          keepAlive: false,
          topLevel: false,
          hidden: true,
        },
        component: () => import('@/views/blog/details/index.vue'),
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
