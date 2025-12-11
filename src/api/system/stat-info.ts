import RequestMethod from '@/enums/request-method';

const statInfoApiModule: ApiModule = {
  apis: {
    /**
     * 获取日数据统计信息
     */
    fetchDailyStatInfo: {
      uri: '/system/stat-info/daily',
      method: RequestMethod.GET,
    },
    /**
     * 获取累计数据统计信息
     */
    fetchAccumulativeStatInfo: {
      uri: '/system/stat-info/accumulative',
      method: RequestMethod.GET,
    },
  },
};

export default statInfoApiModule;
