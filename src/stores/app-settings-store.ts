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
  headerSettings: object;
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
  /**
   * 管理后台侧边栏是否折叠
   */
  asideCollapsed: boolean;
}

export const useAppSettingsStore = defineStore({
  id: 'app-settings',
  state: (): AppSettingsState => {
    // 从localStorage读取侧边栏折叠状态
    const savedCollapsed = localStorage.getItem('admin-aside-collapsed');
    const asideCollapsed = savedCollapsed !== null ? savedCollapsed === 'true' : appSettings.asideCollapsed;

    return {
      ...appSettings,
      asideCollapsed,
    };
  },
  getters: {
    /**
     * 计算侧边栏宽度
     */
    asideWidth(state): string {
      // 移动端或折叠状态返回60px，否则返回200px
      if (state.isMobile || state.asideCollapsed) {
        return '60px';
      }
      return '200px';
    },
  },
  actions: {
    /**
     * 切换侧边栏折叠状态
     */
    toggleAsideCollapse() {
      this.asideCollapsed = !this.asideCollapsed;
      // 同步到localStorage
      try {
        localStorage.setItem('admin-aside-collapsed', String(this.asideCollapsed));
      } catch (e) {
        console.error('Failed to save aside collapsed state:', e);
      }
    },
    /**
     * 设置侧边栏折叠状态
     */
    setAsideCollapse(value: boolean) {
      this.asideCollapsed = value;
      // 同步到localStorage
      try {
        localStorage.setItem('admin-aside-collapsed', String(this.asideCollapsed));
      } catch (e) {
        console.error('Failed to save aside collapsed state:', e);
      }
    },
  },
});
