import RequestMethod from '@/enums/request-method';

export const uploadApiModule: ApiModule = {
  apis: {
    /**
     * 获取访问地址
     */
    fetchVisitUrl: {
      uri: '/oss/visit-url',
      method: RequestMethod.GET,
    },
    /**
     * 上传
     */
    uploadObject: {
      uri: '/oss/upload/{ossProvider}/{fileType}',
      method: RequestMethod.POST,
    },
    /**
     * 下载
     */
    downloadObject: {
      uri: '/oss/download',
      method: RequestMethod.GET,
    },
    /**
     * 删除临时对象
     */
    removeTempObject: {
      uri: '/oss',
      method: RequestMethod.DELETE,
    },
  },
};
