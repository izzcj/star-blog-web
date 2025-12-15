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
      method: RequestMethod.PUT,
    },
    /**
     * 切换置顶状态
     */
    toggleTop: {
      uri: '/blog/article/{id}/toggle-top',
      method: RequestMethod.PUT,
    },
    /**
     * 切换推荐状态
     */
    toggleRecommend: {
      uri: '/blog/article/{id}/toggle-recommended',
      method: RequestMethod.PUT,
    },
    /**
     * 删除文章
     */
    delete: {
      uri: '/blog/article/{id}',
      method: RequestMethod.DELETE,
    },
    /**
     * 获取文章分类导航栏
     */
    fetchCategoryNavbar: {
      uri: '/blog/article/category-navbar',
      method: RequestMethod.GET,
    },
  },
};

export default articleApiModule;
