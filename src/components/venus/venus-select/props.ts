import { array, bool, func, number, oneOf, oneOfType, string } from 'vue-types';
import DataOptionType from '@/enums/data-option-type';

export const venusSelectProps = {
  // 是否多选
  multiple: bool().def(false),
  // 多选时最多可选择数
  multipleLimit: number().def(0),
  // 占位符
  placeholder: string().def('请选择'),
  // 是否禁用
  disabled: bool().def(false),
  // 是否可以清除
  clearable: bool().def(false),
  // 多选时是否将选中值按文字的形式展示
  collapseTags: bool().def(true),
  // 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。使用此属性collapseTags必须启用
  collapseTagsTooltip: bool().def(true),
  // 是否可筛选
  filterable: bool().def(false),
  // 是否为远程搜索
  remote: bool().def(false),
  // 远程搜索方法
  remoteMethod: func<ConsumerFunction<string>>().def(() => {}),
  // 无匹配数据提示
  noMatchText: string().def('无匹配数据'),
  // 无数据提示
  noDataText: string().def('无数据'),
  // 是否分组
  group: bool().def(false),
  // 选项类型
  optionType: oneOf(values(DataOptionType)).def(DataOptionType.DICT),
  // 选项key，字典为字典类型，枚举为枚举全路径，常量为常量值
  optionKey: oneOfType([string(), array<DataOption | DataOptionsGroup>()]),
} as const;
