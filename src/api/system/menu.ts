import RequestMethod from '@/enum/request-method';

const menuApiModule: ApiModule = {
  apis: {
    /**
     * 获取菜单详情
     */
    fetchDetail: {
      uri: '/system/menu/{id}',
      method: RequestMethod.GET,
    },
    /**
     * 获取菜单树列表
     */
    fetchTreeList: {
      uri: '/system/menu/tree',
      method: RequestMethod.GET,
    },
    /**
     * 获取路由菜单
     */
    fetchRoutes: {
      uri: '/system/menu/routers',
      method: RequestMethod.GET,
    },
    /**
     * 新增菜单
     */
    create: {
      uri: '/system/menu',
      method: RequestMethod.POST,
    },
    /**
     * 修改菜单
     */
    modify: {
      uri: '/system/menu',
      method: RequestMethod.PUT,
    },
    /**
     * 删除菜单
     */
    delete: {
      uri: '/system/menu/{id}',
      method: RequestMethod.DELETE,
    },
  },
};

export default menuApiModule;
