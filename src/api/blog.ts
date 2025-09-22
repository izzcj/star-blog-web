import RequestMethod from '@/enum/request-method';

const blogApiModule: ApiModule = {
  apis: {
    /**
     * 分页获取博客列表
     */
    page: {
      uri: '/blog/blog/page',
      method: RequestMethod.GET,
    },
    /**
     * 获取博客详情
     */
    detail: {
      uri: '/blog/blog/{id}',
      method: RequestMethod.GET,
    },
  },
};

export default blogApiModule;
