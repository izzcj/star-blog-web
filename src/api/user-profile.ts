import RequestMethod from '@/enums/request-method';

const userProfileApiModule: ApiModule = {
  apis: {
    /**
     * 获取登录用户信息
     */
    info: {
      uri: '/system/user/profile',
      method: RequestMethod.GET,
    },
    /**
     * 修改个人信息
     */
    modify: {
      uri: '/system/user/profile',
      method: RequestMethod.PUT,
    },
    /**
     * 修改密码
     */
    changePassword: {
      uri: '/system/user/profile/password',
      method: RequestMethod.PUT,
    },
    /**
     * 获取站长信息
     */
    fetchMasterInfo: {
      uri: '/system/user/profile/master',
      method: RequestMethod.GET,
    },
  },
};

export default userProfileApiModule;
