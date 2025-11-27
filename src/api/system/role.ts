import RequestMethod from '@/enum/request-method';

const roleApiModule: ApiModule = {
  apis: {
    /**
     * 获取角色详情
     */
    fetchDetail: {
      uri: '/system/role/detail/{id}',
      method: RequestMethod.GET,
    },
    /**
     * 分页获取角色
     */
    fetchPage: {
      uri: '/system/role/page',
      method: RequestMethod.GET,
    },
    /**
     * 获取角色选项
     */
    fetchOptions: {
      uri: '/system/role/options',
      method: RequestMethod.GET,
    },
    /**
     * 获取角色菜单权限
     */
    fetchMenuPermissions: {
      uri: '/system/role/{id}/menu',
      method: RequestMethod.GET,
    },
    /**
     * 保存角色菜单权限
     */
    saveMenuPermissions: {
      uri: '/system/role/{id}/menu',
      method: RequestMethod.POST,
    },
    /**
     * 创建角色
     */
    create: {
      uri: '/system/role',
      method: RequestMethod.POST,
    },
    /**
     * 修改角色
     */
    modify: {
      uri: '/system/role',
      method: RequestMethod.PUT,
    },
    /**
     * 删除角色
     */
    delete: {
      uri: '/system/role/{id}',
      method: RequestMethod.DELETE,
    },
  },
};

export default roleApiModule;
