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
 * 标签查询参数
 */
export interface TagQueryParams {
  // 标签名称（模糊搜索）
  name?: string;
}
