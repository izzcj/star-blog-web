import appSettings from '@/config/app';

/**
 * 系统设置
 *
 * @author Ale
 * @version 1.0.0
 * @since 2024/8/30
 */
export interface AppSettingsState {
  /**
   * 顶部设置
   */
  headerSettings: HeaderSettings;
  /**
   * 页脚
   */
  showFooter: boolean;
  /**
   * 是否开启路由动画
   */
  pageAnimation: boolean;
  /**
   * 路由动画类型
   */
  pageAnimationType: string;
  /**
   * 触发移动端侧边栏的宽度
   */
  mobileWidth: number;
  /**
   * 是否处于移动端模式
   */
  isMobile: boolean;
}

export const useAppSettingsStore = defineStore({
  id: 'app-settings',
  state: (): AppSettingsState => {
    return {
      ...appSettings,
    };
  },
});
