/**
 * 文章查询参数
 */
export interface ArticleQueryParams {
  // 分类
  category?: string;
  // 标题（模糊搜索）
  title?: string;
  // 状态
  status?: string;
}
