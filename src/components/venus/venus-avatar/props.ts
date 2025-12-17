import { bool, func, number, oneOf, string } from 'vue-types';

export const venusAvatarProps = {
  // OSS实现
  ossProvider: oneOf(['minio'] as const).def('minio'),
  // 尺寸配置
  size: oneOf(['small', 'default', 'large', 'auto'] as const).def('default'),
  // 自定义尺寸（像素），优先级高于size
  customSize: number(),
  // 形状
  shape: oneOf(['circle', 'square'] as const).def('circle'),
  // 用户名（用于文字头像）
  name: string(),
  // 文字颜色
  textColor: string().def('#ffffff'),
  // 背景色（不传则自动生成）
  bgColor: string(),
  // 是否启用裁剪功能
  enableCrop: bool().def(true),
  // 模式
  mode: oneOf(['view', 'edit']).def('view'),
  // 取消回调函数
  onCancel: func<() => void>(),
} as const;
