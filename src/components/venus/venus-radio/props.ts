import { array, bool, oneOf, oneOfType, string } from 'vue-types';
import DataOptionType from '@/enum/data-option-type';

export const venusRadioProps = {
  // 是否禁用
  disabled: bool().def(false),
  // 是否默认选中第一个选项
  autoFirst: bool().def(true),
  // 选项类型
  type: oneOf(['radio', 'button'] as const).def('radio'),
  // 选项类型
  optionType: oneOf(values(DataOptionType)).def(DataOptionType.DICT),
  // 选项key，字典为字典类型，枚举为枚举全路径，常量为常量值
  optionKey: oneOfType([string(), array<DataOption>()]),
} as const;
