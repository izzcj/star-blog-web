export interface VenusUploadProps {
  /**
   * OSS提供器
   */
  ossProvider?: 'minio';
  /**
   * 上传文件类型
   */
  fileType: 'image' | 'file';
  /**
   * 是否批量上传
   */
  multiple?: boolean;
  /**
   * 最大上传文件数量，multiple开启后有效
   */
  max?: number;
  /**
   * 是否可以拖拽上传
   */
  draggable?: boolean;
  /**
   * 上传文件提示，进在draggable开启后有效
   */
  uploadTip?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 文件Key
   */
  value?: Nullable<string> | string[];
  /**
   * 文件Key更新
   *
   * @param value 文件Key
   */
  onUpdateValue?: (value: Nullable<string> | string[]) => void;
}
