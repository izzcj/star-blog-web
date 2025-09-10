import userApi from '@/api/user';
import { errorMessage, errorNotification } from '@/element-plus/notification';
import { useInstantMessageStore } from '@/stores/instant-message-store';
import { asyncRequest } from '@/utils/request-util';

/**
 * 用户信息
 */
export interface UserInfoState {
  /**
   * 用户ID
   */
  id: string;
  /**
   * 用户名称
   */
  name: string;
  /**
   * 用户头像
   */
  avatar: string;
  /**
   * 权限信息
   */
  functionPermissions: string[];
}

export const useUserInfoStore = defineStore({
  id: 'app-user-info',
  state: (): UserInfoState => {
    return {
      id: '',
      name: '',
      avatar: '',
      functionPermissions: [],
    };
  },
  getters: {
    /**
     * 用户信息是否已经获取过
     */
    isFetched(): boolean {
      return !!this.id;
    },
  },
  actions: {
    /**
     * 清除用户信息
     */
    clearUserInfo() {
      this.$patch({
        id: '',
        name: '',
        avatar: '',
        functionPermissions: [],
      });
    },
    /**
     * 获取用户信息
     */
    async fetchUserInfo() {
      const instantMessageStore = useInstantMessageStore();
      return asyncRequest<UserInfoState>(userApi.info)
        .then(resp => {
          this.$patch({
            ...resp.data,
          });

          // 连接IM
          instantMessageStore.connectMessageServer(resp.data.id);
          return true;
        })
        .catch(e => {
          if (e) {
            errorNotification('错误提示', typeof e == 'string' ? e : e.message);
          }
          errorMessage('登录用户信息加载失败，请刷新页面重试！');
          return false;
        });
    },
  },
});
