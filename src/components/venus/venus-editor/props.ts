import { bool, number, oneOf } from 'vue-types';

export const venusEditorProps = {
  // 模式 sv-（分屏预览）markdown ir-（即时渲染）markdown wysiwyg-（所见即所得）富文本模式
  mode: oneOf(['sv', 'ir', 'wysiwyg'] as const).def('wysiwyg'),
  // 编辑器高度
  height: number().def(800),
  // 是否输出为html
  outputHtml: bool().def(false),
} as const;
