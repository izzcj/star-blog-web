import type { Router } from 'vue-router';

import config from '@/config';
import CommonRouterPath from '@/enums/common-router-path';
import CommonRouterPathName from '@/enums/common-router-path-name';
import { useAuthenticationStore } from '@/stores/authentication-store';
import { useUserInfoStore } from '@/stores/user-info-store';

export default (router: Router) => {
  router.beforeEach(async to => {
    const authenticationStore = useAuthenticationStore();
    const userInfoStore = useUserInfoStore();

    // 已登录访问登录页 → 首页
    if (to.name === CommonRouterPathName.LOGIN && authenticationStore.isLoggedIn) {
      return {
        path: CommonRouterPath.HOME,
        replace: true,
      };
    }

    // 允许匿名访问
    if (config.anonymousEnable) {
      return await handleAnonymousMode(authenticationStore, userInfoStore);
    }

    // 无需登录的页面
    if (config.ignoreAuthenticationRoutes.includes(to.name as CommonRouterPathName) || to.meta.ignoreAuthentication) {
      return true;
    }

    // 未登录 → 登录页
    if (!authenticationStore.isLoggedIn) {
      const query: Recordable<string> = {};

      if (
        ![
          CommonRouterPathName.NOT_FOUND,
          CommonRouterPathName.FORBIDDEN,
          CommonRouterPathName.HOME,
        ].includes(to.name as CommonRouterPathName)
      ) {
        query.redirect = to.fullPath;
      }

      return {
        name: CommonRouterPathName.LOGIN,
        query,
        replace: true,
      };
    }

    // 已登录但未获取用户信息
    if (!userInfoStore.isFetched) {
      return await userInfoStore.fetchUserInfo();
    }

    return true;
  });
};

/**
 * 处理匿名模式
 *
 * @param authenticationStore 认证状态Store
 * @param userInfoStore       用户信息Store
 */
async function handleAnonymousMode(authenticationStore: ReturnType<typeof useAuthenticationStore>, userInfoStore: ReturnType<typeof useUserInfoStore>) {
  // 未获取用户信息
  if (!userInfoStore.isFetched) {
    if (authenticationStore.isLoggedIn) {
      return await userInfoStore.fetchUserInfo();
    }
    return await authenticationStore.buildAnonymousToken();
  }

  // 已匿名，但现在登录了 → 切换真实用户
  if (authenticationStore.isLoggedIn && userInfoStore.isAnonymousUser) {
    return await userInfoStore.fetchUserInfo();
  }

  return true;
}
