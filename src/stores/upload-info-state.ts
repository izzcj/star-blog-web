import { loadingMessage, successMessage } from '@/element-plus/notification';
import { asyncRequest } from '@/utils/request-util';
import { uploadApiModule } from '@/api/upload';

export interface UploadInfoState {
  /**
   * 标记是否正在加载信息
   */
  loading: boolean;
  /**
   * 加载Promise
   */
  loadingPromise: Nullable<Promise<void>>;
}

export const useUploadInfoStore = defineStore({
  id: 'app-upload-info',
  state: (): UploadInfoState => {
    return {
      loading: false,
      loadingPromise: null,
    };
  },
  actions: {
    /**
     * 获取文件访问url
     */
    fetchVisitUrl(fileId: string) {
      return asyncRequest(uploadApiModule.apis.fetchVisitUrl, {
        params: {
          fileId,
        },
      });
    },
    /**
     * 移除临时上传对象文件
     *
     * @param fileId 文件ID
     */
    async removeTempObject(fileId: string) {
      const closeLoading = loadingMessage('删除中...');
      return asyncRequest(uploadApiModule.apis.removeTempObject, {
        params: {
          fileId,
        },
      })
        .then(resp => {
          successMessage(resp.message);
          return true;
        })
        .catch(() => {})
        .finally(() => closeLoading());
    },
  },
});
