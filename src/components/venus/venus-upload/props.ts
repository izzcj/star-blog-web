import { bool, integer, oneOf, string } from 'vue-types';
import { getAppConfig } from '@/utils/env-util';

export const venusUploadProps = {
  // OSS实现
  ossProvider: oneOf(getAppConfig().ossProviders).def(getAppConfig().defaultOssProvider),
  // 文件类型
  fileType: oneOf(['image', 'file'] as const).def('image'),
  // 是否批量上传
  multiple: bool().def(false),
  // 最大上传文件数量，multiple开启后有效
  max: integer().def(1),
  // 是否可以拖拽上传
  draggable: bool().def(true),
  // 上传文件提示，进在draggable开启后有效
  uploadTip: string(),
  // 是否禁用
  disabled: bool().def(false),
} as const;
