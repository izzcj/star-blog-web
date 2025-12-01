import type { RawAxiosRequestHeaders } from 'axios';
import type RequestMethod from '@/enum/request-method';

declare global {
  /**
   * 允许为null的类型
   */
  type Nullable<T> = T | null;
  /**
   * 允许undefined的类型
   */
  type Undefinable<T> = T | undefined;
  /**
   * 可能为数组的类型
   */
  type MaybeArray<T = any> = T | T[];
  /**
   * 简化Record类型
   * k默认为string
   */
  type Recordable<T = any> = Record<string, T>;
  /**
   * 决定函数
   */
  type DecisionFunction<T = Recordable, R = string> = (t: T) => R;
  /**
   * 二元决定函数
   */
  type BiDecisionFunction<T = any, S = Recordable, R = string> = (t: T, s?: S) => R;
  /**
   * 二元控制函数
   */
  type BiControlFunction<T = Recordable, S = any> = BiDecisionFunction<T, S, boolean>;
  /**
   * 消费函数
   */
  type ConsumerFunction<T> = (t: T) => void;

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
    showRapidDuplicateRequestWarning: true | false;
    /**
     * Minio 服务地址
     */
    minioServerUrl: string;
    /**
     * 即时消息服务地址
     */
    instantMessageServerUrl: string;
  }

  /**
   * API描述符
   */
  interface ApiDescriptor {
    /**
     * API URI
     */
    uri: string;
    /**
     * API的请求方法
     */
    method: RequestMethod;
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
   * API模块
   */
  interface ApiModule {
    /**
     * API描述
     */
    apis: Recordable<Readonly<ApiDescriptor>>;
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
    params?: Recordable<Undefinable<string | number>>;
    /**
     * 路径参数
     */
    pathParams?: Recordable<Undefinable<string | number>>;
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
   * 数据选项
   */
  interface DataOption extends Recordable {
    /**
     * 名称
     */
    label: string;
    /**
     * 名称拼音
     */
    labelPinyin?: string;
    /**
     * 值
     */
    value: string | number | boolean;
    /**
     * 描述
     */
    description?: string;
    /**
     * 是否禁用
     */
    disabled?: boolean;
  }

  /**
   * 分组数据选项
   */
  interface DataOptionsGroup extends Recordable {
    /**
     * 分组名称
     */
    label: string;
    /**
     * 分组唯一标识
     */
    key: string | number;
    /**
     * 分组下面的选项
     */
    options: DataOption[];
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
    /**
     * 登录类型
     */
    loginType: string;
  }

  /**
   * 基本实体
   */
  interface BaseEntity {
    /**
     * ID
     */
    id: Undefinable<string>;
    /**
     * 创建时间
     */
    createTime?: string;
    /**
     * 更新时间
     */
    updateTime?: string;
  }

  /**
   * 菜单信息
   */
  interface Menu extends BaseEntity {
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
    component: string;
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
     * 是否启用
     */
    enabled: boolean;
    /**
     * 是否公共菜单
     */
    common: boolean;
    /**
     * 排序
     */
    sort: number;
    /**
     * 备注
     */
    remark?: string;
    /**
     * 路由参数
     */
    params?: string[];
  }

  /**
   * 系统用户
   */
  export interface User extends BaseEntity {
    // 账号
    account: string;
    // 头像
    avatar?: string;
    // 昵称
    nickname: string;
    // 性别
    sex: string;
    // 手机号
    mobile?: string;
    // 邮箱
    email?: string;
    // 排序
    sort: number;
    // 角色ID列表
    roleIds?: number[];
  }

  /**
   * 用户简介
   */
  export interface UserProfile extends Omit<User, 'createTime' | 'updateTime' | 'sort'> {
    // 是否是管理员
    admin: boolean;
    // 上次登录IP
    lastLoginIp: string;
    // 上次登录时间
    lastLoginTime: string;
    // 角色
    roleIds: number[];
    // 权限
    permissions: string[];
  }

  /**
   * 文章
   */
  export interface Article extends BaseEntity {
    // 类型
    type: string;
    // 类型名称
    typeName: string;
    // 标题
    title: string;
    // 概要
    summary: string;
    // 封面
    coverImage: string;
    // 浏览数
    viewCount: number;
    // 是否置顶
    top: boolean;
    // 发布时间
    publishTime: string;
    // 创建人
    createByName: string;
  }

  /**
   * 文章详情
   */
  export interface ArticleDetail extends Article {
    // 内容
    content: string;
    // 标签
    tags: Tag[];
  }

  /**
   * 标签
   */
  export interface Tag extends BaseEntity {
    // 标签名
    name: string;
    // 标签颜色
    color: string;
    // 标签描述
    description: string;
  }

  /**
   * 评论
   */
  export interface Comment extends BaseEntity {
    // 文章ID
    articleId: string;
    // 根评论ID
    rootId: string;
    // 父级评论ID
    parentId: string;
    // 评论内容
    content: string;
    // 点赞数
    likeCount: number;
    // 状态
    status: string;
    // 评论人
    userId: string;
    // 回复目标用户ID
    replyUserId: string;
  }

  /**
   * 评论详情
   */
  export interface CommentDetail extends Comment {
    // 是否点赞
    liked: boolean;
    // 评论人昵称
    userName: string;
    // 评论人头像
    userAvatar: string;
    // 回复目标用户昵称
    replyUserName: string;
    // 回复数
    replyCount: number;
  }
}
