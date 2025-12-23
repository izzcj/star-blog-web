import RequestMethod from '@/enums/request-method';

const noticeApiModule: ApiModule = {
  apis: {
    /**
     * 获取通知列表
     */
    fetchPage: {
      uri: '/notice/page',
      method: RequestMethod.GET,
    },
    /**
     * 获取通知
     */
    fetchOne: {
      uri: '/notice/detail/{id}',
      method: RequestMethod.GET,
    },
    /**
     * 新增通知
     */
    create: {
      uri: '/notice',
      method: RequestMethod.POST,
    },
    /**
     * 修改通知
     */
    modify: {
      uri: '/notice',
      method: RequestMethod.PUT,
    },
    /**
     * 删除通知
     */
    delete: {
      uri: '/notice/{id}',
      method: RequestMethod.DELETE,
    },
  },
};

export default noticeApiModule;
