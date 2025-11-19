import type { Router } from 'vue-router';

import { frameworkConfig } from '@/config/framework.config';
import { useAuthenticationStore } from '@/stores/authentication-store';
import { useDynamicRouteStore } from '@/stores/dynamic-route-store';
import { errorMessage } from '@/element-plus/notification';
import CommonRouterPathName from '@/enum/common-router-path-name';
import CommonRouterPath from '@/enum/common-router-path';

export default (router: Router) => {
  router.beforeEach((to, _, next) => {
    const authenticationStore = useAuthenticationStore();
    const dynamicRouteStore = useDynamicRouteStore();
    if (
      !authenticationStore.isLoggedIn
      || dynamicRouteStore.isFetched
      || frameworkConfig.ignoreFetchMenusRouteNames.includes(to.name as string)
    ) {
      console.log(dynamicRouteStore.routes);
      next();
      return;
    }

    dynamicRouteStore
      .fetchMenus()
      .then(() => {
        try {
          if (dynamicRouteStore.routes.length && dynamicRouteStore.routes[0]) {
            dynamicRouteStore.addRouteRemover(
              router.addRoute({
                name: CommonRouterPathName.HOME,
                path: CommonRouterPath.HOME,
                redirect: {
                  name: dynamicRouteStore.routes[0].name,
                },
              }),
            );
            for (const route of dynamicRouteStore.routes) {
              dynamicRouteStore.addRouteRemover(router.addRoute(route));
            }
          }
        } catch (e) {
          errorMessage(`菜单加载失败${e}`);
        }

        if (to.name == CommonRouterPathName.NOT_FOUND) {
          next({
            path: to.redirectedFrom?.fullPath,
            replace: true,
          });
          return;
        }

        next({
          ...to,
          replace: true,
        });
      })
      .catch(() => next(false));
  });
};
