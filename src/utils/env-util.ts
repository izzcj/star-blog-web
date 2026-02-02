import { camelCase, keys } from 'lodash-es';

import { APP_CONFIG_NAME } from '../../build/constants';

const envPrefix = 'STAR_BLOG_APP_';

export function transformAppConfig(config: Recordable<string>): AppConfig {
  const appConfig: Recordable<string> = {};
  for (const key of keys(config)
    .filter(key => key.startsWith(envPrefix))) {
    appConfig[camelCase(key.replace(envPrefix, ''))] = parseEnvValue(config[key]);
  }

  return appConfig as unknown as AppConfig;
}

function parseEnvValue(value: any): any {
  if (typeof value !== 'string') {
    return value;
  }

  const v = value.trim();

  // 空字符串直接返回
  if (v === '') {
    return v;
  }

  // JSON 解析（数组 / 对象 / true / false / null / 数字JSON）
  if (
    (v.startsWith('{') && v.endsWith('}'))
    || (v.startsWith('[') && v.endsWith(']'))
  ) {
    try {
      return JSON.parse(v);
    } catch {
      return value;
    }
  }

  // boolean
  if (v === 'true') {
    return true;
  }
  if (v === 'false') {
    return false;
  }

  // number
  if (/^-?\d+(\.\d+)?$/.test(v)) {
    return Number(v);
  }

  return value;
}

export function getAppConfig(): AppConfig {
  if (import.meta.env.DEV) {
    return transformAppConfig(import.meta.env);
  }

  return (window as Recordable)[APP_CONFIG_NAME] as AppConfig;
}
