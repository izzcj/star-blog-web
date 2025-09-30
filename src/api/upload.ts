import RequestMethod from '@/enum/request-method';

export const uploadApiModule: ApiModule = {
  apis: {
    /**
     * 获取oss基地址
     */
    fetchOssBaseUrls: {
      uri: '/oss/base-urls',
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
      uri: '/oss/download/{ossProvider}',
      method: RequestMethod.GET,
    },
    /**
     * 删除临时对象
     */
    removeTempObject: {
      uri: '/oss/temp/{ossProvider}',
      method: RequestMethod.DELETE,
    },
  },
};
