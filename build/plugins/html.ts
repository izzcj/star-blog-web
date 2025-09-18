/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */
import type { PluginOption } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

import { APP_CONFIG_FILE_NAME } from '../constants';

export function configHtmlPlugin(env: Record<string, string>, isBuild: boolean) {
  const { STAR_BLOG_APP_TITLE } = env;

  const getAppConfigSrc = () => {
    return `/${APP_CONFIG_FILE_NAME}`;
  };

  const htmlPlugin: PluginOption = createHtmlPlugin({
    minify: isBuild,
    /**
     * 配置entry后，你将不需要在`index.html`内添加 script 标签，原有标签需要删除
     * @default src/main.ts
     */
    entry: 'src/main.ts',
    /**
     * 如果你想将 `index.html`存放在指定文件夹，可以修改它，否则不需要配置
     * @default index.html
     */
    template: '/index.html',
    /**
     * 需要注入 index.html ejs 模版的数据
     */
    inject: {
      // Inject data into ejs template
      data: {
        title: STAR_BLOG_APP_TITLE,
      },
      // Embed the generated app.config.js file
      tags: [
        ...(isBuild
          ? [
              {
                tag: 'script',
                attrs: {
                  type: 'module',
                  src: getAppConfigSrc(),
                },
              },
            ]
          : []),
      ],
    },
  });
  return htmlPlugin;
}
