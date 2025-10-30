import { bool, func, nullable, oneOfType, string } from 'vue-types';

export const venusMdEditorProps = {
  // 是否只读
  isRead: bool().def(false),
  // 值
  value: oneOfType([nullable(), string()]).def(null),
  // 值更新函数
  onUpdateValue: func<ConsumerFunction<Undefinable<string>>>(),
} as const;
