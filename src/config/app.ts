import type { AppSettingsState } from '@/stores/app-settings-store';

/**
 * 系统设置
 *
 * @author Ale
 * @version 1.0.0
 * @since 2024/8/30
 */
const appSettings: AppSettingsState = {
  /**
   * 顶部
   */
  headerSettings: {
    /**
     * 背景色
     */
    backgroundColor: '#fff',
    /**
     * 固定顶部
     */
    fixed: true,
    /**
     * 显示重载按钮
     */
    showReload: true,
  },
  /**
   * 页脚
   */
  showFooter: false,
  /**
   * 是否开启路由动画
   */
  pageAnimation: true,
  /**
   * 路由动画类型
   * @/styles/transition
   */
  pageAnimationType: 'fade-bottom',
  /**
   * 触发移动端侧边栏的宽度
   */
  mobileWidth: 800,
  /**
   * 是否是移动端
   */
  isMobile: false,
};

export default appSettings;
