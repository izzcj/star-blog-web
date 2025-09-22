import loginApi from '@/api/login';
import { useDynamicRouteStore } from '@/stores/dynamic-route-store';
import { useInstantMessageStore } from '@/stores/instant-message-store';
import { useUserInfoStore } from '@/stores/user-info-store';
import { asyncRequest } from '@/utils/request-util';
import { createStorage } from '@/utils/storage-util';

const storageKeyPrefix = 'AUTHENTICATION_';
const storage = createStorage(storageKeyPrefix, 'session');

/**
 * 认证信息
 */
export interface AuthenticationState {
  /**
   * 访问Token
   */
  accessToken: Nullable<string>;
}

export const useAuthenticationStore = defineStore({
  id: 'app-authentication',
  state: (): Partial<AuthenticationState> => {
    return {
      accessToken: storage.get<string>('accessToken'),
    };
  },
  getters: {
    /**
     * 判断是否已经登录
     */
    isLoggedIn(): boolean {
      return !!this.accessToken;
    },
  },
  actions: {
    /**
     * 登录
     *
     * @param formData 登录表单数据
     */
    async login(formData: LoginData) {
      const { message, data } = await asyncRequest(loginApi.login, {
        data: {
          ...formData,
        },
      });

      this.accessToken = data.accessToken;
      storage.set('accessToken', this.accessToken);
      return message;
    },

    /**
     * 退出登录
     */
    async logout() {
      const { message } = await asyncRequest(loginApi.logout);
      this.clearAuthentication();
      return message;
    },

    /**
     * 清除认证信息
     */
    clearAuthentication() {
      this.accessToken = null;
      storage.clear();

      const userInfoStore = useUserInfoStore();
      userInfoStore.clearUserInfo();

      const dynamicRoutesStore = useDynamicRouteStore();
      dynamicRoutesStore.clearMenus();
      dynamicRoutesStore.removeAllRoute();

      const instantMessageStore = useInstantMessageStore();
      instantMessageStore.disconnectMessageServer();
    },
  },
});
