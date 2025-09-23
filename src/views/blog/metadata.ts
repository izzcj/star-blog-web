/**
 * 博客类型定义
 */
export interface Blog {
  id: string;
  type: string;
  typeName: string;
  title: string;
  summary: string;
  coverImage: string;
  viewCount: number;
  top: boolean;
  publishTime: string;
  createByName: string;
  tags: Recordable[];
}
