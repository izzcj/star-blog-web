import { camelCase, keys } from 'lodash-es';

import { APP_CONFIG_NAME } from '../../build/constants';

const envPrefix = 'STAR_BLOG_APP_';

export function transformAppConfig(config: Recordable<string>): AppConfig {
  const appConfig: Recordable<string> = {};
  for (const key of keys(config)
    .filter(key => key.startsWith(envPrefix))) {
    appConfig[camelCase(key.replace(envPrefix, ''))] = config[key];
  }

  return appConfig as unknown as AppConfig;
}

export function getAppConfig(): AppConfig {
  if (import.meta.env.DEV) {
    return transformAppConfig(import.meta.env);
  }

  return (window as Recordable)[APP_CONFIG_NAME] as AppConfig;
}
