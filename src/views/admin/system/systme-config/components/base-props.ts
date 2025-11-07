import { object, oneOf, string } from 'vue-types';

export const configItemProps = {
  /**
   * 配置Key
   */
  name: string().isRequired,
  /**
   * 配置名称
   */
  label: string().isRequired,
  /**
   * 配置数据
   */
  configData: object<Recordable>().isRequired,
  /**
   * 数据源类型
   */
  dataSourceType: oneOf(['dict', 'enum', 'const'] as const),
  /**
   * 数据源配置
   */
  dataSourceConfig: string(),
} as const;
