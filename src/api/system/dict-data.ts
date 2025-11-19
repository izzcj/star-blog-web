import RequestMethod from '@/enum/request-method';

const dictDataApiModule: ApiModule = {
  apis: {
    /**
     * 分页获取字典数据列表
     */
    fetchPage: {
      uri: '/system/dict-data/page',
      method: RequestMethod.GET,
    },
    /**
     * 获取字典数据列表
     */
    list: {
      uri: '/system/dict-data',
      method: RequestMethod.GET,
    },
    /**
     * 获取字典数据选项
     */
    fetchOptions: {
      uri: '/system/dict-data/options',
      method: RequestMethod.GET,
    },
    /**
     * 获取字典数据详情
     */
    fetchDetail: {
      uri: '/system/dict-data/{id}',
      method: RequestMethod.GET,
    },
    /**
     * 新增字典数据
     */
    create: {
      uri: '/system/dict-data',
      method: RequestMethod.POST,
    },
    /**
     * 修改字典数据
     */
    modify: {
      uri: '/system/dict-data',
      method: RequestMethod.PUT,
    },
    /**
     * 删除字典数据
     */
    delete: {
      uri: '/system/dict-data/{ids}',
      method: RequestMethod.DELETE,
    },
  },
};

export default dictDataApiModule;
