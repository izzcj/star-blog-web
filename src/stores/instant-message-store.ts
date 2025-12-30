import { defineStore } from 'pinia';
import { errorNotification, successNotification } from '@/element-plus/notification';
import { useUserInfoStore } from '@/stores/user-info-store';
import { useAuthenticationStore } from '@/stores/authentication-store';
import { getAppConfig } from '@/utils/env-util';
import { emitter } from '@/utils/event-util';
import InstantMessageType from '@/enums/instant-message-type';

export interface InstantMessageState {
  // WebSocket 实例
  client: WebSocket | null;
  // 心跳定时器
  heartTimer: number | null;
  // 重连次数
  retry: number;
  // 是否手动关闭
  manuallyClosed: boolean;
}
// 重连最大次数
const MAX_RETRY = 5;
// 心跳间隔
const HEARTBEAT_INTERVAL = 30_000;

export const useInstantMessageStore = defineStore('app-instant-message', {
  state: (): InstantMessageState => ({
    client: null,
    heartTimer: null,
    retry: 0,
    manuallyClosed: false,
  }),

  actions: {
    /**
     * 创建 WebSocket 实例并绑定事件
     */
    createClient(token: string) {
      const appConfig = getAppConfig();
      const url = `${appConfig.instantMessageServerUrl}?token=${token}`;
      const ws = new WebSocket(url);

      ws.onopen = () => {
        this.retry = 0;
        this.startHeartbeat();
        setTimeout(() => {
          successNotification('成功提示', '欢迎来到星站！');
        }, 3000);
      };

      ws.onmessage = event => {
        try {
          const message = JSON.parse(event.data) as InstantMessage;
          if (message.type !== InstantMessageType.PONG) {
            if (message.type === InstantMessageType.PUSH) {
              emitter.emit('global-im', message);
            } else {
              emitter.emit('user-im', message);
            }
          }
        } catch (e) {
          console.warn('消息解析失败', e);
        }
      };

      ws.onclose = () => {
        this.stopHeartbeat();
        this.client = null;

        if (!this.manuallyClosed) {
          this.reconnect(() => this.createClient(token));
        }
      };

      ws.onerror = err => {
        console.error('WebSocket 错误', err);
        errorNotification('错误提示', '已与星站断开连接！');
      };

      this.client = ws;
    },

    /**
     * 连接即时消息服务
     */
    connectMessageServer() {
      if (this.client) {
        return;
      }
      const authenticationStore = useAuthenticationStore();
      const token = authenticationStore.isLoggedIn ? authenticationStore.accessToken : authenticationStore.anonymousToken;

      if (!token) {
        console.error('连接即时消息服务失败，未获取到token！');
        return;
      }

      this.manuallyClosed = false;
      this.createClient(token);

      // 页面关闭时主动断开
      useEventListener(window, 'beforeunload', () => {
        this.disconnectMessageServer();
      });
    },

    /**
     * 启动心跳
     */
    startHeartbeat() {
      this.stopHeartbeat();
      this.heartTimer = window.setInterval(() => {
        if (this.client?.readyState === WebSocket.OPEN) {
          this.client.send(JSON.stringify({ type: InstantMessageType.PING }));
        }
      }, HEARTBEAT_INTERVAL);
    },

    /**
     * 停止心跳
     */
    stopHeartbeat() {
      if (this.heartTimer) {
        clearInterval(this.heartTimer);
        this.heartTimer = null;
      }
    },

    /**
     * 重连
     */
    reconnect(connect: () => void) {
      if (this.retry >= MAX_RETRY) {
        console.warn('WebSocket 重连次数已达上限');
        return;
      }
      // 指数退避
      const delay = ++this.retry * 2000;
      setTimeout(connect, delay);
    },

    /**
     * 主动断开连接
     */
    disconnectMessageServer() {
      this.manuallyClosed = true;
      this.stopHeartbeat();

      if (this.client) {
        this.client.close();
        this.client = null;
      }
    },

    /**
     * 发送消息
     */
    sendMessage(message: InstantMessage) {
      if (this.client?.readyState !== WebSocket.OPEN) {
        console.warn('WebSocket 未连接，消息发送失败');
        return;
      }

      const userInfoStore = useUserInfoStore();
      message.from = userInfoStore.id;

      this.client.send(
        JSON.stringify(message),
      );
    },
  },
});
