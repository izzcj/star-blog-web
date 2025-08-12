import RequestMethod from '@/enum/request-method';

const userApi = {
  /**
   * 登录接口
   */
  info: {
    uri: '/user/info',
    method: RequestMethod.GET,
  },
};

export default userApi;
