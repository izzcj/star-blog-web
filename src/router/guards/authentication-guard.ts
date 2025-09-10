import type { Router } from 'vue-router';

import config from '@/config';
import CommonRouterPath from '@/enum/common-router-path';
import CommonRouterPathName from '@/enum/common-router-path-name';
import { useAuthenticationStore } from '@/stores/authentication-store';
import { useUserInfoStore } from '@/stores/user-info-store';

export default (router: Router) => {
  router.beforeEach((to, _, next) => {
    const authenticationStore = useAuthenticationStore();
    const userInfoStore = useUserInfoStore();
    // 如果是到登录页面，但是当前状态已经登录，则直接跳到首页
    if (to.name == CommonRouterPathName.LOGIN && authenticationStore.isLoggedIn) {
      next({
        path: CommonRouterPath.HOME,
        replace: true,
      });
      return;
    }

    /**
     * 系统未启动鉴权
     */
    if (config.anonymousEnable) {
      next();
      return;
    }

    /**
     * 无需登录的页面，直接跳过
     */
    if (config.ignoreAuthenticationRoutes.includes(to.name as CommonRouterPathName)) {
      next();
      return;
    }

    if (!authenticationStore.isLoggedIn) {
      // 未登录
      if (to.meta.ignoreAuthentication) {
        next();
        return;
      }

      const queryParams: Recordable<string> = {};
      if (to.name != CommonRouterPathName.NOT_FOUND && to.name != CommonRouterPathName.FORBIDDEN && to.path != CommonRouterPathName.HOME) {
        queryParams.redirect = to.fullPath;
      }

      next({
        name: CommonRouterPathName.LOGIN,
        query: queryParams,
        replace: true,
      });
      return;
    }

    if (userInfoStore.isFetched) {
      next();
      return;
    }

    userInfoStore.fetchUserInfo().then(result => next(result));
  });
};
