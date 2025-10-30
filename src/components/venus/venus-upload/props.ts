import { arrayOf, bool, func, integer, nullable, oneOf, oneOfType, string } from 'vue-types';

export const venusUploadProps = {
  // OSS实现
  ossProvider: oneOf(['minio'] as const).def('minio'),
  // 文件类型
  fileType: oneOf(['image', 'file'] as const).def('image'),
  // 是否批量上传
  multiple: bool().def(false),
  // 最大上传文件数量，multiple开启后有效
  max: integer(),
  // 是否可以拖拽上传
  draggable: bool().def(true),
  // 上传文件提示，进在draggable开启后有效
  uploadTip: string(),
  // 是否禁用
  disabled: bool().def(false),
  // 值
  value: oneOfType([nullable(), string(), arrayOf(string())]).def(null),
  // 值更新函数
  onUpdateValue: func<ConsumerFunction<Undefinable<MaybeArray<string>>>>(),
} as const;
