import { errorNotification, infoNotification, successNotification } from '@/element-plus/notification';
import { useAuthenticationStore } from '@/stores/authentication-store';
import { useUserInfoStore } from '@/stores/user-info-store';
import { getAppConfig } from '@/utils/env-util';
import { emitter } from '@/utils/event-util';

export interface InstantMessageState {
  /**
   * Stomp客户端
   */
  client: Nullable<WebSocket>;
  /**
   * 消息列表
   */
  notificationList: Recordable[];
  /**
   * 消息条数
   */
  notificationCount: number;
}

export const useInstantMessageStore = defineStore({
  id: 'app-instant-message',
  state: (): InstantMessageState => {
    return {
      client: null,
      notificationList: [],
      notificationCount: 0,
    };
  },
  actions: {
    /**
     * 连接即时消息服务
     *
     * @param _id 用户ID
     */
    connectMessageServer(_id: string) {
      const appConfig = getAppConfig();
      const authenticationStore = useAuthenticationStore();

      this.client = new WebSocket(`${appConfig.instantMessageServerUrl}?accessToken=${authenticationStore.accessToken}`);
      this.client.onopen = () => {
        successNotification('成功提示', '即时消息服务连接成功！');
      };
      this.client.onmessage = e => {
        const result = JSON.parse(e.data);
        this.notificationList = result.attributes.messageList;
        this.notificationCount = result.attributes.unreadCount;
        infoNotification('系统提醒', result.content);
        emitter.emit('user-im', result);
      };
      this.client.onclose = () => {
        this.disconnectMessageServer();
      };
      this.client.onerror = e => {
        console.log('WebSocket连接错误', e);
        errorNotification('错误提示', '已中断即时消息服务连接！');
      };

      useEventListener(window, 'beforeunload', () => {
        this.disconnectMessageServer();
      });
    },
    /**
     * 断开即时消息服务连接
     */
    disconnectMessageServer() {
      this.client?.close();
      this.client = null;
    },
    /**
     * 发送消息
     *
     * @param attributes 消息属性
     */
    sendMessage(attributes: Recordable) {
      if (this.client?.readyState === WebSocket.OPEN) {
        const userInfoStore = useUserInfoStore();
        this.client.send(
          JSON.stringify({
            '@class': 'xxx',
            'userId': userInfoStore.id,
            'attributes': {
              '@class': 'java.util.HashMap',
              ...attributes,
            },
          }),
        );
      }
    },
    /**
     * 清理消息缓存
     */
    cleanMessageCache() {
      this.notificationList = [];
      this.notificationCount = 0;
    },
    /**
     * 已读消息
     */
    readMessage(id: string) {
      const index = this.notificationList.findIndex(item => item.id === id);
      this.notificationList.splice(index, 1);
      this.notificationCount -= 1;
    },
  },
});
