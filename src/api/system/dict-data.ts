import RequestMethod from '@/enum/request-method';

const dictDataApiModule: ApiModule = {
  apis: {
    /**
     * 获取字典数据列表
     */
    list: {
      uri: '/system/dict/data',
      method: RequestMethod.GET,
    },
    /**
     * 获取字典数据选项
     */
    fetchOptions: {
      uri: '/system/dict/data/options',
      method: RequestMethod.GET,
    },
  },
};

export default dictDataApiModule;
