import RequestMethod from '@/enum/request-method';

const loginApiModule: ApiModule = {
  apis: {
    // 登录
    login: {
      uri: '/auth/login',
      method: RequestMethod.POST,
    },
    // 退出登录
    logout: {
      uri: '/auth/logout',
      method: RequestMethod.POST,
    },
  },
};

export default loginApiModule;
