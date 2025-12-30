import RequestMethod from '@/enums/request-method';

const noticeApiModule: ApiModule = {
  apis: {
    /**
     * 获取通知列表
     */
    fetchPage: {
      uri: '/system/notice/page',
      method: RequestMethod.GET,
    },
    /**
     * 获取通知
     */
    fetchOne: {
      uri: '/system/notice/detail/{id}',
      method: RequestMethod.GET,
    },
    /**
     * 新增通知
     */
    create: {
      uri: '/system/notice',
      method: RequestMethod.POST,
    },
    /**
     * 修改通知
     */
    modify: {
      uri: '/system/notice',
      method: RequestMethod.PUT,
    },
    /**
     * 切换通知发布状态
     */
    togglePublished: {
      uri: '/system/notice/{id}/toggle-published',
      method: RequestMethod.PUT,
    },
    /**
     * 删除通知
     */
    delete: {
      uri: '/system/notice/{id}',
      method: RequestMethod.DELETE,
    },
  },
};

export default noticeApiModule;
