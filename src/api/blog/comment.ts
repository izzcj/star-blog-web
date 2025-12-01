import RequestMethod from '@/enums/request-method';

const commentApiModule: ApiModule = {
  apis: {
    /**
     * 获取评论详情
     */
    fetchDetail: {
      uri: '/blog/comment/{id}',
      method: RequestMethod.GET,
    },
    /**
     * 分页获取评论列表
     */
    fetchPage: {
      uri: '/blog/comment/page',
      method: RequestMethod.GET,
    },
    /**
     * 新增评论
     */
    create: {
      uri: '/blog/comment',
      method: RequestMethod.POST,
    },
    /**
     * 删除评论
     */
    delete: {
      uri: '/blog/comment/{id}',
      method: RequestMethod.DELETE,
    },
    /**
     * 点赞评论
     */
    like: {
      uri: '/blog/comment/{id}/like',
      method: RequestMethod.POST,
    },
    /**
     * 取消点赞
     */
    unLike: {
      uri: '/blog/comment/{id}/like',
      method: RequestMethod.DELETE,
    },
    /**
     * 审核通过
     */
    auditPass: {
      uri: '/blog/comment/{id}/audit/pass',
      method: RequestMethod.PUT,
    },
    /**
     * 审核拒绝
     */
    auditReject: {
      uri: '/blog/comment/{id}/audit/reject',
      method: RequestMethod.PUT,
    },
    /**
     * 批量审核
     */
    batchAudit: {
      uri: '/blog/comment/batch/audit',
      method: RequestMethod.PUT,
    },
  },
};

export default commentApiModule;
