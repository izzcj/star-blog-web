import { number, oneOf, string } from 'vue-types';
import { getAppConfig } from '@/utils/env-util';

export const avatarDisplayProps = {
  // 图片地址（objectKey）
  src: string().required,
  // 用户名
  name: string(),
  // 尺寸（像素）
  size: number(),
  // 形状
  shape: oneOf(['circle', 'square'] as const),
  // 文字颜色
  textColor: string(),
  // 背景色
  bgColor: string(),
  // OSS实现
  ossProvider: oneOf(getAppConfig().ossProviders).def(getAppConfig().defaultOssProvider),
} as const;
