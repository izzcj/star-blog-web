import { bool, string } from 'vue-types';
import { getAppConfig } from '@/utils/env-util';

export const venusMdEditorProps = {
  // OSS实现(图片上传使用)
  ossProvider: string().def(getAppConfig().defaultOssProvider),
  // 是否仅预览
  preview: bool().def(false),
} as const;
