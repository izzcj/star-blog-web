/**
 * 字典类型
 */
export interface DictType extends BaseEntity {
  // 字典名称
  dictName: string;
  // 字典key
  dictKey: string;
  // 排序
  sort: number;
}

/**
 * 字典类型查询参数
 */
export interface DictTypeQueryParams {
  // 字典名称（模糊搜索）
  dictName?: string;
}
