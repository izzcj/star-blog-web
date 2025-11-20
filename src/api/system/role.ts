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
