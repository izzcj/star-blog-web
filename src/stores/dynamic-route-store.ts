import type { RouteComponent, RouteRecordRaw } from 'vue-router';
import { ElMessage } from 'element-plus';
import path from 'path-browserify';
import { startsWith } from 'lodash-es';
import { DefaultLayout } from '@/layout/index';
import dynamicRouters from '@/router/dynamic-router';
import { asyncRequest } from '@/utils/request-util';
import menuApiModule from '@/api/system/menu';
import { errorMessage, warningMessage } from '@/element-plus/notification';

type MenuRouterInfo = Omit<Menu, 'enabled' | 'sort' | 'createTime' | 'updateTime'> & {
  // 子级
  children: MenuRouterInfo[];
};

interface DynamicRoutesState {
  /**
   * 菜单是否已经获取过了
   */
  isFetched: boolean;
  /**
   * 菜单
   */
  menus: MenuRouterInfo[];
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
function buildRoutes(menus: MenuRouterInfo[], basePath = ''): RouteRecordRaw[] {
  return menus.map(menu => {
    const route: RouteRecordRaw = {
      name: menu.component,
      path: menu.uri,
      redirect: menu.redirectUri,
      props: true,
      meta: {
        title: menu.name,
        icon: menu.icon,
        keepAlive: menu.keepAlive,
        topLevel: menu.topLevel,
        hidden: menu.hidden,
      },
      children: [],
    };

    if (route?.meta?.topLevel) {
      route.name = undefined;
      route.component = DefaultLayout;
      const uri = startsWith(menu.uri, '/') ? menu.uri : path.join(basePath, menu.uri);
      const dynamicRouter = dynamicRouters[uri];
      route.children.push(buildTopRouterChildren(menu, dynamicRouter));
      route.children.push(...buildRoutes(menu.children, path.join(basePath, menu.uri)));
      return route;
    }
    if (menu.children?.length) {
      route.component = DefaultLayout;
      route.children = buildRoutes(menu.children, path.join(basePath, menu.uri));
    } else {
      const uri = startsWith(menu.uri, '/') ? menu.uri : path.join(basePath, menu.uri);
      const dynamicRouter = dynamicRouters[uri];
      if (!dynamicRouter) {
        ElMessage.warning(`页面 ${uri} 不存在，请检查！`);
      }
      route.component = dynamicRouter;
    }
    // 处理路由参数
    if (menu.params) {
      // 将路由参数拼接到path中，如/user/:id
      const params = menu.params.map(param => `:${param}`).join('/');
      if (params) {
        route.path = route.path.endsWith('/')
          ? `${route.path}${params}`
          : `${route.path}/${params}`;
      }
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
function buildTopRouterChildren(menu: MenuRouterInfo, componentPath: RouteComponent): RouteRecordRaw {
  return {
    path: '',
    name: menu.name,
    redirect: menu.redirectUri,
    component: componentPath,
    children: [],
  };
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
    async fetchMenus() {
      return asyncRequest(menuApiModule.apis.fetchRoutes)
        .then(res => {
          this.menus = res.data;
          this.isFetched = true;
          if (!isArray(this.menus) || !this.menus.length) {
            warningMessage('获取到菜单信息为空，请联系管理员授权！');
          }
        })
        .catch(() => {
          errorMessage('系统菜单加载失败，请刷新页面重试！');
          return false;
        });
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
