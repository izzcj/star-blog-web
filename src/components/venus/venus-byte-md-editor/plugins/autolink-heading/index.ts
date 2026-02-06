import type { BytemdPlugin } from 'bytemd';
import { visit } from 'unist-util-visit';

export default function autolinkHeading(): BytemdPlugin {
  return {
    rehype: processor =>
      processor.use(() => {
        return (tree: any) => {
          let index = 0;

          visit(tree, 'element', (node: any) => {
            const tag = node.tagName;

            // 只处理 h1 ~ h6
            if (/^h[1-6]$/.test(tag)) {
              // 初始化 properties
              node.properties = node.properties || {};

              // 已有 id 不覆盖（避免锤爆用户自定义锚点）
              if (!node.properties.id) {
                node.properties.id = `heading-${index++}`;
              }
            }
          });
        };
      }),
  };
};
