import type { RouteComponent, RouteRecordRaw } from 'vue-router';
import { ElMessage } from 'element-plus';
import path from 'path-browserify';
import { startsWith } from 'lodash-es';
import { DefaultLayout } from '@/layout/index';
import dynamicRouters from '@/router/dynamic-router';

interface DynamicRoutesState {
  /**
   * 菜单是否已经获取过了
   */
  isFetched: boolean;
  /**
   * 菜单
   */
  menus: Menu[];
  /**
   * 路由移除器
   */
  routeRemovers: Array<() => void>;
  /**
   * 缓存的路由
   */
  cachedRoutes: string[];
  /**
   * 激活路由地址
   */
  activeRouteIndex: string | null;
}

/**
 * 构建路由
 *
 * @param menus    菜单数组
 * @param basePath 路由基路径
 */
function buildRoutes(menus: Menu[], basePath = ''): RouteRecordRaw[] {
  return menus.map(menu => {
    const route: RouteRecordRaw = {
      name: menu.componentName,
      path: menu.uri,
      redirect: menu.redirectUri,
      meta: {
        title: menu.name,
        icon: menu.icon,
        keepAlive: menu.keepAlive,
        topLevel: menu.topLevel,
        hidden: menu.hidden,
      },
      children: [],
    };

    if (menu.children?.length) {
      route.component = DefaultLayout;
      route.children = buildRoutes(menu.children, path.join(basePath, menu.uri));
    } else {
      const uri = startsWith(menu.uri, '/') ? menu.uri : path.join(basePath, menu.uri);
      const dynamicRouter = dynamicRouters[uri];
      if (!dynamicRouter) {
        ElMessage.warning(`页面 ${uri} 不存在，请检查！`);
      }
      if (route?.meta?.topLevel) {
        route.component = DefaultLayout;
        route.children = buildTopRouterChildren(menu, dynamicRouter);
        return route;
      }
      route.component = dynamicRouter;
    }
    return route;
  });
}

/**
 * 构建一级路由子级
 *
 * @param menu          一级菜单
 * @param componentPath 路由组件地址
 */
function buildTopRouterChildren(menu: Menu, componentPath: RouteComponent) {
  return [
    {
      path: menu.uri,
      redirect: menu.redirectUri,
      component: componentPath,
      meta: {
        title: menu.name,
        icon: menu.icon,
        keepAlive: menu.keepAlive,
        topLevel: false,
        hidden: menu.hidden,
      },
      children: [],
    },
  ];
}

export const useDynamicRouteStore = defineStore({
  id: 'app-dynamic-route',
  state: (): DynamicRoutesState => {
    return {
      isFetched: false,
      menus: [],
      routeRemovers: [],
      cachedRoutes: [],
      activeRouteIndex: '',
    };
  },
  getters: {
    routes(): RouteRecordRaw[] {
      return buildRoutes(this.menus);
    },
  },
  actions: {
    /**
     * 添加缓存路由
     *
     * @param route 路由组件
     */
    addCachedRoute(route: string) {
      this.cachedRoutes.push(route);
    },
    /**
     * 删除缓存路由
     *
     * @param route 路由组件
     */
    removeCacheRoute(route: string) {
      const index = this.cachedRoutes.indexOf(route);
      if (index > -1) {
        this.cachedRoutes.splice(index, 1);
      }
    },
    /**
     * 判断是否存在缓存路由
     *
     * @param route 路由组件
     */
    hasCachedRoute(route: string) {
      return this.cachedRoutes.includes(route);
    },
    /**
     * 添加路由移除器
     *
     * @param remover 路由移除器
     */
    addRouteRemover(remover: () => void) {
      this.routeRemovers.push(remover);
    },
    /**
     * 移除所有已注册的路由
     */
    removeAllRoute() {
      for (const remover of this.routeRemovers) {
        remover();
      }
    },
    /**
     * 获取登录用户菜单
     */
    fetchMenus() {
      // TODO: 模拟获取菜单
    },
    /**
     * 清空菜单
     */
    clearMenus() {
      this.menus = [];
      this.isFetched = false;
      this.cachedRoutes = [];
    },
    /**
     * 设置激活的路由地址
     */
    setActiveRouteIndex(selectRouteIndex: string) {
      this.activeRouteIndex = selectRouteIndex;
    },
  },
});
