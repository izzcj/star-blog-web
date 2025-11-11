import { array, bool, nullable, number, oneOf, oneOfType, string } from 'vue-types';
import DataOptionType from '@/enum/data-option-type';

export const venusCheckboxProps = {
  // 是否禁用
  disabled: bool().def(false),
  // 最小选择数量
  min: number().def(1),
  // 最大选择数量
  max: number().def(5),
  // 选项类型
  type: oneOf(['checkbox', 'button'] as const).def('checkbox'),
  // 选项类型
  optionType: oneOf(values(DataOptionType)).def(DataOptionType.DICT),
  // 选项key，字典为字典类型，枚举为枚举全路径，常量为常量值
  optionKey: oneOfType([string(), array<DataOption>()]),
  // 值
  value: oneOfType([string(), number(), bool(), nullable()]).def(null),
} as const;
