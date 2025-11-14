import { bool } from 'vue-types';

export const venusMdEditorProps = {
  // 是否只读
  isRead: bool().def(false),
} as const;
