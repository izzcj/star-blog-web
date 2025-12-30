import type { BytemdPlugin } from 'bytemd';
import { visit } from 'unist-util-visit';
import { clipboardCheckIcon, successTip } from './icon';
import './style.css';

// 复制的方法,直接使用浏览器的 API 即可实现复制
async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('复制代码失败，请手动复制');
      console.error('复制失败!', err);
    }
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch (err) {
      document.body.removeChild(textarea);
      console.error('无法复制到剪贴板', err);
    }
  }
}

export default function codeCopy(): BytemdPlugin {
  return {
    rehype: processor =>
      processor.use(() => (tree: any) => {
        visit(tree, 'element', node => {
          if (node.tagName === 'pre') {
            const codeNode = node.children.find((child: any) => child.tagName === 'code');
            const language
              = codeNode?.properties?.className
                ?.find((cls: any) => cls.startsWith('language-'))
                ?.replace('language-', '') || 'text';

            if (codeNode) {
              node.children.unshift({
                type: 'element',
                tagName: 'div',
                properties: {
                  className: ['code-block-extension-header'],
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'div',
                    properties: {
                      className: ['code-block-extension-headerLeft'],
                    },
                    children: [
                      {
                        type: 'element',
                        tagName: 'div',
                        properties: {
                          className: ['code-block-extension-foldBtn'],
                        },
                        children: [
                          {
                            type: 'text',
                            value: '▼',
                          },
                        ],
                      },
                      {
                        type: 'element',
                        tagName: 'span',
                        properties: {
                          className: ['code-block-extension-lang'],
                        },
                        children: [{ type: 'text', value: language }],
                      },
                    ],
                  },
                  {
                    type: 'element',
                    tagName: 'div',
                    properties: {
                      className: ['code-block-extension-headerRight'],
                    },

                    children: [
                      {
                        type: 'element',
                        tagName: 'div',
                        properties: {
                          className: ['code-block-extension-copyCodeBtn'],
                        },
                        children: [{ type: 'text', value: '复制代码' }],
                      },
                    ],
                  },
                ],
              });

              node.properties = {
                ...node.properties,
              };
            }
          }
        });
      }),

    viewerEffect({ markdownBody }) {
      const copyButtons = markdownBody.querySelectorAll('.code-block-extension-copyCodeBtn');
      const foldButtons = markdownBody.querySelectorAll('.code-block-extension-foldBtn');

      copyButtons.forEach(button => {
        button.addEventListener('click', () => {
          const pre = button.closest('pre');
          const code = pre?.querySelector('code')?.textContent || '';
          void copyToClipboard(code);

          const tmp = button.innerHTML;
          button.innerHTML = clipboardCheckIcon + successTip;
          setTimeout(() => {
            button.innerHTML = tmp;
          }, 1500);
        });
      });

      // 处理折叠按钮的点击事件，实现旋转
      foldButtons.forEach(foldButton => {
        foldButton.addEventListener('click', () => {
          // 切换折叠类名
          foldButton.classList.toggle('code-block-extension-fold');
          // 找到最近的 pre 标签
          const pre = foldButton.closest('pre');

          // 在 pre 标签下找到 code 标签
          const code = pre?.querySelector('code');
          // 切换 code 标签的类名
          if (code) {
            code.classList.toggle('code-block-extension-fold');
          }

          // 在 pre 标签下找到 code-block-extension-header
          const headerElement = pre?.querySelector('.code-block-extension-header');

          // 切换 code-block-extension-header 的类名
          if (headerElement) {
            headerElement.classList.toggle('code-block-extension-fold');
          }
        });
      });
    },
  };
};
