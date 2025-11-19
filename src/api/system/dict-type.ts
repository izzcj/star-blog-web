import RequestMethod from '@/enum/request-method';

const dictTypeApiModule: ApiModule = {
  apis: {
    /**
     * 获取字典类型列表
     */
    fetchPage: {
      uri: '/system/dict-type/page',
      method: RequestMethod.GET,
    },
    /**
     * 获取字典类型详情
     */
    fetchDetail: {
      uri: '/system/dict-type/{id}',
      method: RequestMethod.GET,
    },
    /**
     * 新增字典类型
     */
    create: {
      uri: '/system/dict-type',
      method: RequestMethod.POST,
    },
    /**
     * 修改字典类型
     */
    modify: {
      uri: '/system/dict-type',
      method: RequestMethod.PUT,
    },
    /**
     * 删除字典类型
     */
    delete: {
      uri: '/system/dict-type/{ids}',
      method: RequestMethod.DELETE,
    },
    /**
     * 刷新缓存
     */
    refreshCache: {
      uri: '/system/dict-type/refresh-cache',
      method: RequestMethod.PUT,
    },
  },
};

export default dictTypeApiModule;
