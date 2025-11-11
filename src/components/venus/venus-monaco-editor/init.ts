import loader from '@monaco-editor/loader';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import TypeScriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

loader.config({
  'paths': {
    vs: '/libs/monaco-editor',
  },
  'vs/nls': {
    availableLanguages: {
      '*': 'zh-cn',
    },
  },
});

// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'json') {
      return new JsonWorker();
    }
    if (['css', 'scss', 'less'].includes(label)) {
      return new CssWorker();
    }
    if (['html', 'handlebars', 'razor'].includes(label)) {
      return new HtmlWorker();
    }
    if (['typescript', 'javascript'].includes(label)) {
      return new TypeScriptWorker();
    }
    return new EditorWorker();
  },
};

/**
 * 初始化Monaco编辑器
 */
export async function initMonaco() {
  const monaco = await loader.init();

  if (!monaco?.editor) {
    throw new Error('Monaco 加载失败');
  }

  monaco.editor.defineTheme('venus-dark', {
    base: 'vs-dark',
    inherit: true,
    colors: {},
    rules: [
      {
        token: 'keyword',
        fontStyle: 'bold',
      },
    ],
  });

  monaco.editor.defineTheme('venus-light', {
    base: 'vs',
    inherit: true,
    colors: {},
    rules: [
      {
        token: 'keyword',
        fontStyle: 'bold',
      },
    ],
  });

  return monaco;
}
