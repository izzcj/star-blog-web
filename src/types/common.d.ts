import type { RawAxiosRequestHeaders } from 'axios';
import type RequestMethod from '@/enum/request-method';

/**
 * 通用类型
 *
 * @author Ale
 * @version 1.0.0
 * @since 2024/8/30
 */
export {};

declare global {
  /**
   * 允许为null的类型
   */
  type Nullable<T> = T | null;
  /**
   * 允许为undefined的类型
   */
  type Undefinable<T> = T | undefined;
  /**
   * 简化Record类型
   * k默认为string
   */
  type Recordable<T = any> = Record<string, T>;

  /**
   * 应用配置
   */
  interface AppConfig {
    /**
     * 应用标题
     */
    title: string;
    /**
     * 应用API请求基地址
     */
    apiBaseUrl: string;
    /**
     * 是否显示快速的连续请求警告
     */
    showRapidDuplicateRequestWarning: 'true' | 'false';
    /**
     * 即时消息服务地址
     */
    instantMessageServerUrl: string;
  }

  /**
   * 头部设置
   */
  interface HeaderSettings {
    backgroundColor: string;
    fixed: boolean;
    showReload: boolean;
  }

  /**
   * API描述符
   */
  interface ApiDescriptor {
    /**
     * API的请求方法
     */
    method: RequestMethod;
    /**
     * API URI
     */
    uri: string;
    /**
     * 固定查询参数
     */
    fixedParams?: Recordable<string>;
    /**
     * 固定API请求数据
     */
    fixedData?: Recordable;
    /**
     * 固定头部信息
     */
    fixedHeaders?: Recordable<string>;
    /**
     * 是否为加密传输数据
     */
    isEncrypt?: boolean;
  }

  /**
   * Api结果
   */
  interface ApiResponse<T = any> {
    /**
     * 响应码
     */
    readonly code: number;
    /**
     * 响应消息
     */
    readonly message: string;
    /**
     * 响应数据
     */
    readonly data: T;
  }

  /**
   * API请求数据
   */
  interface ApiRequest<D extends Recordable = Recordable> {
    /**
     * API查询参数
     */
    params?: Recordable<Nullable<string>>;
    /**
     * API数据参数
     */
    data?: D;
    /**
     * API头信息
     */
    headers?: RawAxiosRequestHeaders;
  }

  /**
   * 即时消息
   */
  interface InstantMessage {
    /**
     * 消息类型
     */
    type: string;
    /**
     * 消息标题
     */
    title: string;
    /**
     * 消息内容
     */
    content: string;
    /**
     * 消息属性
     */
    attributes: Recordable;
  }

  /**
   * 登录数据
   */
  interface LoginData {
    /**
     * 账号
     */
    account: string;
    /**
     * 密码
     */
    password: string;
  }

  /**
   * 菜单设置
   */
  interface MenuSettings {
    minMenuWidth: number;
    menuWidth: number;
    fixed: boolean;
    mixMenu: boolean;
    collapsed: boolean;
    mobileWidth: number;
  }

  /**
   * 菜单信息
   */
  interface Menu {
    /**
     * 菜单ID
     */
    id: string;
    /**
     * 父级菜单ID
     */
    parentId: string;
    /**
     * 菜单名称
     */
    name: string;
    /**
     * 组件名称
     */
    componentName: string;
    /**
     * 菜单URI
     */
    uri: string;
    /**
     * 重定向菜单URI
     */
    redirectUri?: string;
    /**
     * 菜单图标
     */
    icon: string;
    /**
     * 菜单是否为一级菜单
     */
    topLevel: boolean;
    /**
     * 菜单是否缓存
     */
    keepAlive: boolean;
    /**
     * 菜单是否隐藏
     */
    hidden: boolean;
    /**
     * 菜单类型
     */
    type: string;
    /**
     * 子菜单
     */
    children: Menu[];
  }
}
