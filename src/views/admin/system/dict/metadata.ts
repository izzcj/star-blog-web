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
