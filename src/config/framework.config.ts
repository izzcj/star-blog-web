import CommonRouterPathName from '@/enum/common-router-path-name';

interface FrameworkConfig {
  /**
   * 忽略获取菜单的路由名称
   */
  ignoreFetchMenusRouteNames: string[];
  /**
   * 登录API命名空间
   */
  loginApiNamespace: string;
  /**
   * 登录成功跳转的路由名称
   */
  loginSuccessRouteName?: string;
  /**
   * 退出登录API命名空间
   */
  logoutApiNamespace: string;
  /**
   * 获取用户信息API命名空间
   */
  fetchUserInfoApiNamespace: string;
  /**
   * 获取用户菜单API命名空间
   */
  fetchUserMenusApiNamespace: string;
  /**
   * 获取OSS基础URL API命名空间
   */
  fetchOssBaseUrlsApiNamespace: string;
  /**
   * 删除临时对象API命名空间
   */
  removeTempObjectApiNamespace: string;
}

export const frameworkConfig: FrameworkConfig = {
  ignoreFetchMenusRouteNames: [CommonRouterPathName.SSO_LOGIN],
  loginApiNamespace: 'auth.login',
  loginSuccessRouteName: '',
  logoutApiNamespace: 'auth.logout',
  fetchUserInfoApiNamespace: 'aas.fetchUserInfo',
  fetchUserMenusApiNamespace: 'aas.fetchUserMenus',
  fetchOssBaseUrlsApiNamespace: 'oss.fetchOssBaseUrls',
  removeTempObjectApiNamespace: 'oss.removeTempObject',
};
