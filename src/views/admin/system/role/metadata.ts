/**
 * 系统角色
 */
export interface Role extends BaseEntity {
  // 角色名称
  name: string;
  // 角色类型
  type: string;
  // 备注
  remark?: string;
  // 排序
  sort: number;
  // 是否默认角色
  defaultRole: boolean;
}

/**
 * 角色查询参数
 */
export interface RoleQueryParams {
  // 角色名称（模糊搜索）
  name?: string;
  // 角色类型
  type?: string;
}
