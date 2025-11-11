import RequestMethod from '@/enum/request-method';

export const systemConfigApiModule: ApiModule = {
  apis: {
    /**
     * 获取系统配置
     */
    fetchOne: {
      uri: '/system/config',
      method: RequestMethod.GET,
    },
    /**
     * 获取系统配置列表
     */
    fetchList: {
      uri: '/system/config/list',
      method: RequestMethod.GET,
    },
    /**
     * 新增系统配置
     */
    create: {
      uri: '/system/config',
      method: RequestMethod.POST,
    },
    /**
     * 修改系统配置
     */
    modify: {
      uri: '/system/config',
      method: RequestMethod.PUT,
    },
    /**
     * 删除系统配置
     */
    delete: {
      uri: '/system/config',
      method: RequestMethod.DELETE,
    },
  },
};
