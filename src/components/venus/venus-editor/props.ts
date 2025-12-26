import { bool } from 'vue-types';

export const venusEditorProps = {
  // 是否输出为html
  outputHtml: bool().def(false),
} as const;
