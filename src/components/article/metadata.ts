/**
 * 文章类型定义
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
  // 标签
  tags: Recordable[];
}

/**
 * 文章详情
 */
export interface ArticleDetail extends Article {
  // 内容
  content: string;
}
