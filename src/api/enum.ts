import RequestMethod from '@/enum/request-method';

const enumApiModule: ApiModule = {
  apis: {
    /**
     * 获取枚举选项列表
     */
    fetchOptions: {
      uri: '/enumeration/options',
      method: RequestMethod.GET,
    },
  },
};

export default enumApiModule;
