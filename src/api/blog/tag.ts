import RequestMethod from '@/enums/request-method';

const tagApiModule: ApiModule = {
  apis: {
    /**
     * 获取标签列表
     */
    fetchPage: {
      uri: '/blog/tag/page',
      method: RequestMethod.GET,
    },
    /**
     * 获取标签
     */
    fetchOne: {
      uri: '/blog/tag/{id}',
      method: RequestMethod.GET,
    },
    /**
     * 获取标签选项
     */
    fetchOptions: {
      uri: '/blog/tag/options',
      method: RequestMethod.GET,
    },
    /**
     * 获取热门标签
     */
    fetchHot: {
      uri: '/blog/tag/hot',
      method: RequestMethod.GET,
    },
    /**
     * 新增标签
     */
    create: {
      uri: '/blog/tag',
      method: RequestMethod.POST,
    },
    /**
     * 修改标签
     */
    modify: {
      uri: '/blog/tag',
      method: RequestMethod.PUT,
    },
    /**
     * 删除标签
     */
    delete: {
      uri: '/blog/tag/{id}',
      method: RequestMethod.DELETE,
    },
  },
};

export default tagApiModule;
