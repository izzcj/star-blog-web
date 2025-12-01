import RequestMethod from '@/enums/request-method';

const articleApiModule: ApiModule = {
  apis: {
    /**
     * 分页获取文章列表
     */
    fetchPage: {
      uri: '/blog/article/page',
      method: RequestMethod.GET,
    },
    /**
     * 获取文章详情
     */
    fetchDetail: {
      uri: '/blog/article/{id}',
      method: RequestMethod.GET,
    },
    /**
     * 新增文章
     */
    create: {
      uri: '/blog/article',
      method: RequestMethod.POST,
    },
    /**
     * 修改文章
     */
    modify: {
      uri: '/blog/article',
      method: RequestMethod.PUT,
    },
    /**
     * 增加文章浏览次数
     */
    incrementViewCount: {
      uri: '/blog/article/{id}/view-count',
      method: RequestMethod.PUT,
    },
    /**
     * 发布文章
     */
    publish: {
      uri: '/blog/article/{id}/publish',
      method: RequestMethod.POST,
    },
    /**
     * 置顶文章
     */
    top: {
      uri: '/blog/article/{id}/top',
      method: RequestMethod.POST,
    },
    /**
     * 删除文章
     */
    delete: {
      uri: '/blog/article/{id}',
      method: RequestMethod.DELETE,
    },
    /**
     * 获取热门文章
     */
    hotArticles: {
      uri: '/blog/article/hot',
      method: RequestMethod.GET,
    },
  },
};

export default articleApiModule;
