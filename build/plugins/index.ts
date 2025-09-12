import vue from '@vitejs/plugin-vue';
import type { ConfigEnv, PluginOption } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import autoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import components from 'unplugin-vue-components/vite';
import checkerPlugin from 'vite-plugin-checker';
import { configCompressPlugin } from './compress';
import { configHtmlPlugin } from './html';
import { configSvgIconsPlugin } from './svg-sprite';

/**
 * 创建vite插件
 *
 * @param _configEnv vite config env
 * @param viteEnv    vite env
 * @param isBuild    是否为build
 */
export function createVitePlugins(_configEnv: ConfigEnv, viteEnv: Record<string, string>, isBuild: boolean) {
  const { STAR_BLOG_VITE_COMPRESS, STAR_BLOG_VITE_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;

  const vitePlugins: Array<PluginOption> = [
    // have to
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),
    // have to
    vueJsx(),
    // 自动引入配置
    autoImport({
      dts: './types/auto-imports.d.ts',
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
        })
      ],
      vueTemplate: true,
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/head',
        '@vueuse/core',
        '@vueuse/math',
        {
          'lodash-es': [
            'isString',
            'isBoolean',
            'isArray',
            'isNumber',
            'isFunction',
            'isPlainObject',
            'isEqual',
            'isNaN',
            'isNil',
            'isNull',
            'isUndefined',
            'isEmpty',
            'cloneDeep',
            'trim',
            'trimStart',
            'trimEnd',
            'merge',
            'omit',
            'pick',
            'chunk',
            'keys',
            'values',
            'camelCase',
            'kebabCase',
            'lowerCase',
            'snakeCase',
            'startCase',
            'upperCase',
            'upperFirst',
            'lowerFirst',
            'toLower',
            'toUpper',
            'groupBy',
            'debounce',
            'throttle',
            'last',
            'assign',
            'assignWith',
          ],
        },
        {
          from: 'vue',
          imports: ['Ref', 'ComputedRef', 'PropType'],
          type: true,
        },
      ],
    }),
    components({
      dts: './types/components.d.ts',
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
        })
      ],
      extensions: ['vue', 'tsx'],
      deep: true,
    }),
    checkerPlugin({
      eslint: {
        lintCommand: 'eslint ./src/**/*.{ts,tsx,vue}',
        useFlatConfig: true,
      },
      enableBuild: false,
    })
  ];

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));
  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin({ isBuild }));

  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(configCompressPlugin(STAR_BLOG_VITE_COMPRESS, Boolean(STAR_BLOG_VITE_COMPRESS_DELETE_ORIGIN_FILE)));
  }

  return vitePlugins;
}
