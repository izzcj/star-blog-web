import RequestMethod from '@/enum/request-method';

const loginApi = {
  /**
   * 登录接口
   */
  login: {
    uri: '/web/login',
    method: RequestMethod.POST,
  },
  /**
   * 退出登录接口
   */
  logout: {
    uri: '/web/logout',
    method: RequestMethod.POST,
  },
};

export default loginApi;
