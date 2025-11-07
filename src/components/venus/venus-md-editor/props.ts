import { bool, nullable, oneOfType, string } from 'vue-types';

export const venusMdEditorProps = {
  // 是否只读
  isRead: bool().def(false),
  // 值
  value: oneOfType([nullable(), string()]).def(null),
} as const;
