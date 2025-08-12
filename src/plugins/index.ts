import type { Plugin } from 'vue';

const pluginModules: Recordable<Plugin> = import.meta.glob('./**/*.ts', {
  eager: true,
  import: 'default',
  exhaustive: false,
});

const plugins = keys(pluginModules)
  .filter(key => !key.endsWith('index.ts'))
  .map(key => {
    return pluginModules[key];
  });

/**
 * 安装插件的顶级插件
 */
export default {
  install(app) {
    for (const plugin of plugins) {
      app.use(plugin);
    }
  },
} as Plugin;
