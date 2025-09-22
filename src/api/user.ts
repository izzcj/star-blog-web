import RequestMethod from '@/enum/request-method';

const userApiModule: ApiModule = {
  apis: {
    // 获取登录用户信息
    info: {
      uri: '/system/user/profile',
      method: RequestMethod.GET,
    },
  },
};

export default userApiModule;
