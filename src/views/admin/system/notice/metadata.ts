/**
 * 系统通知
 */
export interface Notice extends BaseEntity {
  /**
   * 分类
   */
  type: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 内容
   */
  content: string;
  /**
   * 是否发布
   */
  published: boolean;
  /**
   * 发布时间
   */
  publishedTime: string;
  /**
   * 备注
   */
  remark: string;
}

/**
 * 系统通知查询参数
 */
export interface NoticeQueryParams {
  /**
   * 分类
   */
  type?: string;
  /**
   * 标题
   */
  title?: string;
  /**
   * 是否发布
   */
  published?: boolean;
}
