import userProfileApiModule from '@/api/user-profile';
import { errorMessage, errorNotification } from '@/element-plus/notification';
import { useInstantMessageStore } from '@/stores/instant-message-store';
import { asyncRequest } from '@/utils/request-util';

export const useUserInfoStore = defineStore({
  id: 'app-user-info',
  state: (): UserProfile => {
    return {
      id: '',
      account: '',
      nickname: '',
      sex: '',
      avatar: '',
      remark: '',
      email: '',
      lastLoginIp: '',
      lastLoginTime: '',
      admin: false,
      roleIds: [],
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
    /**
     * 是否是匿名用户
     */
    isAnonymousUser(): boolean {
      return this.account == 'anonymous';
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
      return asyncRequest<UserProfile>(userProfileApiModule.apis.info)
        .then(resp => {
          this.$patch({
            ...resp.data,
          });

          // 连接IM
          instantMessageStore.connectMessageServer();
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
    /**
     * 构建匿名用户信息
     */
    async buildAnonymousUserInfo() {
      this.$patch({
        id: '',
        account: 'anonymous',
        nickname: '匿名用户',
        avatar: '',
        remark: '',
        email: '',
        lastLoginIp: '',
        lastLoginTime: '',
        admin: false,
        roleIds: [],
        permissions: [],
      });
      try {
        const instantMessageStore = useInstantMessageStore();
        instantMessageStore.connectMessageServer();
        return true;
      } catch {
        errorMessage('用户信息构建失败，请刷新页面重试！');
        return false;
      }
    },
  },
});
