/**
 * 博客类型定义
 */
export interface Blog extends BaseEntity {
  // 博客类型
  type: string;
  // 博客类型名称
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
  // 标签
  tags: Recordable[];
}

/**
 * 博客详情
 */
export interface BlogDetail extends Blog {
  // 内容
  content: string;
}
