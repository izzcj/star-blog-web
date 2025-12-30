import { nanoid } from 'nanoid';
import loginApiModule from '@/api/login';
import { useDynamicRouteStore } from '@/stores/dynamic-route-store';
import { useInstantMessageStore } from '@/stores/instant-message-store';
import { useUserInfoStore } from '@/stores/user-info-store';
import { asyncRequest } from '@/utils/request-util';
import { createStorage } from '@/utils/storage-util';

const storageKeyPrefix = 'AUTHENTICATION_';
const storage = createStorage(storageKeyPrefix);

/**
 * 认证信息
 */
export interface AuthenticationState {
  /**
   * 访问Token
   */
  accessToken: Nullable<string>;
  /**
   * 访问Token过期事件（秒）
   */
  expiresIn: number;
  /**
   * 匿名token
   */
  anonymousToken: Nullable<string>;
}

export const useAuthenticationStore = defineStore({
  id: 'app-authentication',
  state: (): Partial<AuthenticationState> => {
    return {
      accessToken: storage.get<string>('accessToken'),
      anonymousToken: storage.get<string>('anonymousToken'),
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
      const { message, data } = await asyncRequest<AuthenticationState>(loginApiModule.apis.login, {
        data: {
          ...formData,
        },
      });

      this.accessToken = data.accessToken;
      storage.set('accessToken', this.accessToken, data.expiresIn);
      // 清除匿名token
      storage.remove('anonymousToken');
      return message;
    },

    /**
     * 退出登录
     */
    async logout() {
      const { message } = await asyncRequest(loginApiModule.apis.logout);
      this.clearAuthentication();
      return message;
    },

    /**
     * 构建匿名Token
     */
    async buildAnonymousToken() {
      try {
        if (!this.anonymousToken) {
          this.anonymousToken = nanoid(12);
          storage.set('anonymousToken', this.anonymousToken);
        }
        const userInfoStore = useUserInfoStore();
        return await userInfoStore.buildAnonymousUserInfo();
      } catch {
        console.error('构建匿名Token失败');
        return false;
      }
    },

    /**
     * 清除认证信息
     */
    clearAuthentication() {
      this.accessToken = null;
      this.anonymousToken = null;
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
