import RequestMethod from '@/enums/request-method';

const activityApiModule: ApiModule = {
  apis: {
    /**
     * 分页获取动态列表
     */
    fetchPage: {
      uri: '/blog/activity/page',
      method: RequestMethod.GET,
    },
  },
};

export default activityApiModule;
