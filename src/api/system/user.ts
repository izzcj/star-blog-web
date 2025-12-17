import RequestMethod from '@/enums/request-method';

const userApiModule: ApiModule = {
  apis: {
    /**
     * 分页获取用户
     */
    fetchPage: {
      uri: '/system/user/page',
      method: RequestMethod.GET,
    },
    /**
     * 获取用户详情
     */
    fetchDetail: {
      uri: '/system/user/{id}',
      method: RequestMethod.GET,
    },
    /**
     * 获取登录用户信息
     */
    info: {
      uri: '/system/user/profile',
      method: RequestMethod.GET,
    },
    /**
     * 获取站长信息
     */
    masterInfo: {
      uri: '/system/user/profile/master',
      method: RequestMethod.GET,
    },
    /**
     * 创建用户
     */
    create: {
      uri: '/system/user',
      method: RequestMethod.POST,
    },
    /**
     * 修改用户
     */
    modify: {
      uri: '/system/user',
      method: RequestMethod.PUT,
    },
    /**
     * 重置密码
     */
    resetPassword: {
      uri: '/system/user/{id}/password',
      method: RequestMethod.PUT,
    },
    /**
     * 分页获取已授权的用户
     */
    fetchAllocatedPage: {
      uri: '/system/user/authorized/{roleId}/page',
      method: RequestMethod.GET,
    },
    /**
     * 分页获取未授权的用户
     */
    fetchUnallocatedPage: {
      uri: '/system/user/unauthorized/{roleId}/page',
      method: RequestMethod.GET,
    },
    /**
     * 授权
     */
    authorization: {
      uri: '/system/user/authorization',
      method: RequestMethod.POST,
    },
    /**
     * 取消授权
     */
    cancelAuthorization: {
      uri: '/system/user/authorization/cancel',
      method: RequestMethod.PUT,
    },
    /**
     * 删除用户
     */
    delete: {
      uri: '/system/user/{id}',
      method: RequestMethod.DELETE,
    },
  },
};

export default userApiModule;
