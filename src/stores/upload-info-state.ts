import { getAppConfig } from '@/utils/env-util';
import { loadingMessage, successMessage, warningMessage } from '@/element-plus/notification';
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
  /**
   * 标识是否已经获取过OSS基URL
   */
  fetched: boolean;
  /**
   * OSS对象存储基URL
   */
  ossBaseUrls: Recordable<string>;
}

export const useUploadInfoStore = defineStore({
  id: 'app-upload-info',
  state: (): UploadInfoState => {
    return {
      loading: false,
      loadingPromise: null,
      fetched: false,
      ossBaseUrls: {
        minio: getAppConfig().minioServerUrl,
      },
    };
  },
  actions: {
    /**
     * 获取OSS上传基URL
     *
     * @param ossProvider 实现类型
     */
    getOssBaseUrl(ossProvider: string): string {
      if (!this.fetched) {
        return '';
      }

      const baseUrl = this.ossBaseUrls[ossProvider];
      if (!baseUrl) {
        warningMessage(
          `OSS实现类型[${ossProvider}]不存在基URL，请检查OSS实现类型是否正确或后端是否正确实现了获取基URL的方法！`,
        );
        return '';
      }

      return baseUrl;
    },
    /**
     * 获取OSS实现基URL
     */
    fetchOssBaseUrls() {
      if (this.fetched) {
        return;
      }

      if (this.loading) {
        return this.loadingPromise;
      }

      this.loading = true;
      this.loadingPromise = asyncRequest(uploadApiModule.apis.fetchOssBaseUrls)
        .then(resp => {
          this.ossBaseUrls = resp.data as Recordable<string>;
          this.fetched = true;
          this.loadingPromise = null;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });

      return this.loadingPromise;
    },
    /**
     * 移除临时上传对象文件
     *
     * @param ossProvider OSS实现
     * @param objectKey 对象文件Key
     */
    async removeTempObject(ossProvider: string, objectKey: string) {
      if (!objectKey.startsWith('temp/')) {
        return Promise.resolve(true);
      }
      const closeLoading = loadingMessage('删除中...');
      return asyncRequest(uploadApiModule.apis.removeTempObject, {
        pathParams: {
          ossProvider,
        },
        params: {
          objectKey,
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
