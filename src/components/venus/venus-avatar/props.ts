import { bool, func, number, oneOf, oneOfType, string } from 'vue-types';
import { ComponentsSize } from '@/enums/components-size';
import { getAppConfig } from '@/utils/env-util';

export const venusAvatarProps = {
  // OSS实现
  ossProvider: oneOf(getAppConfig().ossProviders).def(getAppConfig().defaultOssProvider),
  // 尺寸
  size: oneOfType([number(), oneOf(values(ComponentsSize))]).def(ComponentsSize.DEFAULT),
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
