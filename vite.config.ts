import { resolve } from 'node:path';
import type { ConfigEnv, UserConfig } from 'vite';
import { format } from 'date-fns';
import { loadEnv } from 'vite';
import { createVitePlugins } from './build/plugins';
import { OUTPUT_DIR } from './build/constants';
import pkg from './package.json';

const { dependencies, devDependencies, name, version } = pkg;

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
};
function pathResolve(dir: string) {
  // eslint-disable-next-line node/prefer-global/process
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default (configEnv: ConfigEnv): UserConfig => {
  const { command, mode } = configEnv;
  const env = loadEnv(mode, pathResolve('env'), 'STAR_BLOG');
  const publicPath = env.STAR_BLOG_VITE_PUBLIC_PATH;
  const port = Number.parseInt(env.STAR_BLOG_VITE_PORT);
  const isBuild = command === 'build';
  return {
    base: publicPath,
    esbuild: {
      sourcemap: true,
    },
    envDir: './env',
    envPrefix: 'STAR_BLOG_APP',
    appType: 'spa',
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: `${pathResolve('types')}/`,
        },
        {
          find: '@',
          replacement: `${pathResolve('src')}/`,
        },
      ],
      dedupe: ['vue'],
    },
    plugins: createVitePlugins(configEnv, env, isBuild),
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      modules: {
        scopeBehaviour: 'local',
        localsConvention: 'camelCase',
      },
      preprocessorOptions: {
        less: {
          modifyVars: {},
          javascriptEnabled: true,
          additionalData: `@import "src/styles/global-variables.less";`,
        },
      },
    },
    server: {
      host: true,
      port,
      open: false,
    },
    optimizeDeps: {
      include: [],
      exclude: [],
    },
    build: {
      minify: true,
      target: 'esnext',
      cssTarget: 'chrome80',
      outDir: OUTPUT_DIR,
      reportCompressedSize: false,
      // chunkSizeWarningLimit: 2000,
      sourcemap: false,
      rollupOptions: {
        external: ['/app.config.js'],
        output: {
          manualChunks: {
            lodash: ['lodash-es'],
          },
        },
      },
    },
  };
};
