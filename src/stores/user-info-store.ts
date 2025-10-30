import userApiModule from '@/api/system/user';
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
   * 用户账号
   */
  account: string;
  /**
   * 用户昵称
   */
  nickname: string;
  /**
   * 用户头像
   */
  avatar: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 上次登录时间
   */
  lastLoginIp: string;
  /**
   * 上次登录时间
   */
  lastLoginTime: string;
  /**
   * 是否是管理员
   */
  admin: boolean;
  /**
   * 权限信息
   */
  permissions: string[];
}

export const useUserInfoStore = defineStore({
  id: 'app-user-info',
  state: (): UserInfoState => {
    return {
      id: '',
      account: '',
      nickname: '',
      avatar: '',
      remark: '',
      email: '',
      lastLoginIp: '',
      lastLoginTime: '',
      admin: false,
      permissions: [],
    };
  },
  getters: {
    /**
     * 用户信息是否已经获取过
     */
    isFetched(): boolean {
      return !!this.id;
    },
    /**
     * 是否是管理员
     */
    isAdmin(): boolean {
      return this.admin;
    },
  },
  actions: {
    /**
     * 清除用户信息
     */
    clearUserInfo() {
      this.$patch({
        id: '',
        account: '',
        nickname: '',
        avatar: '',
        remark: '',
        email: '',
        lastLoginIp: '',
        lastLoginTime: '',
        admin: false,
        permissions: [],
      });
    },
    /**
     * 获取用户信息
     */
    async fetchUserInfo() {
      const instantMessageStore = useInstantMessageStore();
      return asyncRequest<UserInfoState>(userApiModule.apis.info)
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
