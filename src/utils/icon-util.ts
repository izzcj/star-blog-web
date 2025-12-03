/**
 * 图标前缀常量
 */
export const ICON_PREFIX = {
  // Element-plus
  ELEMENT_PLUS: 'ep:',
  // 本地
  SVG: 'svg:',
} as const;

/**
 * 图标类型
 */
export type IconType = 'ep' | 'svg';

/**
 * 解析后的图标信息
 */
export interface ParsedIcon {
  // 图标类型
  type: IconType;
  // 图标名称
  name: string;
  // 原始图标值
  raw: string;
}

/**
 * 图标项
 */
export interface IconItem {
  // 图标名称
  name: string;
  // 图标显示名称
  displayName?: string;
  // 图标关键字
  keywords?: string[];
}

/**
 * 解析图标值
 * 将带前缀的图标值解析为类型和名称
 *
 * @param value 图标值（如 'ep:User', 'svg:home', 'User'）
 * @return 解析结果
 */
export function parseIconValue(value: string): ParsedIcon {
  if (!value) {
    return {
      type: 'ep',
      name: '',
      raw: value,
    };
  }

  // 检查是否包含前缀
  if (value.startsWith(ICON_PREFIX.ELEMENT_PLUS)) {
    return {
      type: 'ep',
      name: value.substring(ICON_PREFIX.ELEMENT_PLUS.length),
      raw: value,
    };
  }

  if (value.startsWith(ICON_PREFIX.SVG)) {
    return {
      type: 'svg',
      name: value.substring(ICON_PREFIX.SVG.length),
      raw: value,
    };
  }

  // 向后兼容：无前缀默认为 Element Plus 图标
  return {
    type: 'ep',
    name: value,
    raw: value,
  };
}

/**
 * 格式化图标值
 * 根据类型和名称生成带前缀的图标值
 *
 * @param type 图标类型
 * @param name 图标名称
 * @return 格式化后的图标值
 */
export function formatIconValue(type: IconType, name: string): string {
  if (!name) {
    return '';
  }

  switch (type) {
    case 'ep':
      return `${ICON_PREFIX.ELEMENT_PLUS}${name}`;
    case 'svg':
      return `${ICON_PREFIX.SVG}${name}`;
    default:
      return name;
  }
}

/**
 * 规范化图标值（向后兼容）
 * 无前缀的值自动添加 ep: 前缀
 *
 * @param value 图标值
 * @return 规范化后的图标值
 */
export function normalizeIconValue(value: string): string {
  if (!value) {
    return '';
  }

  // 如果已经有前缀，直接返回
  if (value.includes(':')) {
    return value;
  }

  // 添加默认前缀
  return `${ICON_PREFIX.ELEMENT_PLUS}${value}`;
}

/**
 * 获取本地 SVG 图标列表
 * 使用 Vite Glob Import 读取 src/assets/icons 目录下的所有 SVG 文件
 *
 * @return SVG 图标名称列表
 */
export function getLocalSvgIcons(): string[] {
  // 使用 Vite 的 Glob Import 功能
  const svgModules = import.meta.glob('@/assets/icons/*.svg', {
    eager: true,
  });

  // 提取文件名作为图标名称
  return Object.keys(svgModules).map(path => {
    const match = path.match(/\/([^/]+)\.svg$/);
    return match ? match[1] : '';
  })
    .filter(name => name !== '');
}

/**
 * 将图标名称列表转换为 IconItem 数组
 *
 * @param names 图标名称列表
 * @return IconItem 数组
 */
export function convertToIconItems(names: string[]): IconItem[] {
  return names.map(name => ({
    name,
    displayName: name,
    keywords: [name.toLowerCase()],
  }));
}

/**
 * 搜索图标
 * 支持大小写不敏感的模糊匹配
 *
 * @param icons 图标列表
 * @param keyword 搜索关键词
 * @return 过滤后的图标列表
 */
export function searchIcons(icons: IconItem[], keyword: string): IconItem[] {
  if (!keyword) {
    return icons;
  }

  const lowerKeyword = keyword.toLowerCase();

  return icons.filter(icon => {
    // 匹配名称
    if (icon.name.toLowerCase().includes(lowerKeyword)) {
      return true;
    }

    // 匹配显示名称
    if (icon.displayName?.toLowerCase().includes(lowerKeyword)) {
      return true;
    }

    // 匹配关键词
    return !!icon.keywords?.some(kw => kw.includes(lowerKeyword));
  });
}
