import { bool } from 'vue-types';

export const venusMdEditorProps = {
  // 是否仅预览
  preview: bool().def(false),
} as const;
