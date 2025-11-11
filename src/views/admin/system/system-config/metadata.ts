import type SystemConfigType from '@/enum/systme-config-type';
import type DataOptionType from '@/enum/data-option-type';

/**
 * 系统配置
 */
export interface SystemConfig extends BaseEntity {
  // 类别
  category: string;
  // 排序
  sort: Nullable<number>;
  // 名称
  name: string;
  // 类型
  type: SystemConfigType;
  // key
  key: string;
  // 值
  value: Nullable<string>;
  // 数据源类型
  dataSourceType: Nullable<DataOptionType>;
  // 数据源配置
  dataSourceConfig: Nullable<string>;
}
