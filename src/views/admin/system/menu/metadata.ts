/**
 * 菜单树
 */
export interface MenuTree extends Menu {
  // 子菜单
  children?: MenuTree[];
}

/**
 * 菜单查询参数
 */
export interface MenuQueryParams {
  // 菜单名称（模糊搜索）
  name?: string;
}
