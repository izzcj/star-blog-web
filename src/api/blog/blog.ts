import RequestMethod from '@/enum/request-method';

const blogApiModule: ApiModule = {
  apis: {
    /**
     * 分页获取博客列表
     */
    fetchPage: {
      uri: '/blog/page',
      method: RequestMethod.GET,
    },
    /**
     * 获取博客详情
     */
    fetchDetail: {
      uri: '/blog/{id}',
      method: RequestMethod.GET,
    },
    /**
     * 新增博客
     */
    create: {
      uri: '/blog',
      method: RequestMethod.POST,
    },
    /**
     * 修改博客
     */
    modify: {
      uri: '/blog',
      method: RequestMethod.PUT,
    },
    /**
     * 增加博客浏览次数
     */
    incrementViewCount: {
      uri: '/blog/{id}/view-count',
      method: RequestMethod.PUT,
    },
    /**
     * 发布博客
     */
    publish: {
      uri: '/blog/{id}/publish',
      method: RequestMethod.POST,
    },
    /**
     * 置顶博客
     */
    top: {
      uri: '/blog/{id}/top',
      method: RequestMethod.POST,
    },
    /**
     * 删除博客
     */
    delete: {
      uri: '/blog/{id}',
      method: RequestMethod.DELETE,
    },
    /**
     * 获取热门博客
     */
    hotBlogs: {
      uri: '/blog/hot',
      method: RequestMethod.GET,
    },
  },
};

export default blogApiModule;
