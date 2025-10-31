import { bool, oneOf, string } from 'vue-types';

export const venusImageProps = {
  // OSS实现
  ossProvider: oneOf(['minio'] as const).def('minio'),
  // 图片地址
  src: string(),
  // 图片宽度
  width: string().def('100%'),
  // 图片高度
  height: string().def('100%'),
  // 图片填充方式
  fit: oneOf(['fill', 'contain', 'cover', 'none', 'scale-down'] as const).def('contain'),
  // 是否可以通过点击遮罩层关闭 preview
  hideOnClickModal: bool().def(false),
  // 是否可以通过按下 ESC 键关闭 preview
  hideOnPressEscape: bool().def(true),
  // 是否懒加载
  lazy: bool().def(false),
  // 图片描述
  alt: string().def('图片'),
} as const;
