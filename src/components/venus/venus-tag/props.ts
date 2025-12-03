import { bool, oneOf, object, string } from 'vue-types';

/**
 * VenusTag 组件 Props 定义
 */
export const venusTagProps = {
  // Tag对象模式
  tag: object<Tag>(),
  // 属性模式
  name: string(),
  // 图标
  icon: string(),
  // 颜色
  color: string(),
  // 尺寸
  size: oneOf(['large', 'default', 'small'] as const).def('default'),
  // 主题
  effect: oneOf(['dark', 'light', 'plain'] as const).def('light'),
  // 是否可关闭
  closable: bool().def(false),
  // 是否禁用渐变动画
  disableTransitions: bool().def(false),
  // 是否有边框描边
  hit: bool().def(false),
  // 是否圆形
  round: bool().def(false),
} as const;
