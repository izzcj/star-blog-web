/**
 * 字典数据
 */
export interface DictData extends BaseEntity {
  // 字典标签
  dictLabel: string;
  // 字典值
  dictValue: string;
  // 字典key
  dictKey: string;
  // 样式属性（其他样式扩展）
  cssClass: string;
  // 表格回显样式
  listClass: string;
  // 是否可删除
  deletable: boolean;
  // 排序
  sort: number;
  // 是否启用
  enabled: boolean;
}
