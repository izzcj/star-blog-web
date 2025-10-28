import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import frontMatter from '@bytemd/plugin-frontmatter';
import math from '@bytemd/plugin-math';
import mermaid from '@bytemd/plugin-mermaid';
import gEmoji from '@bytemd/plugin-gemoji';
import breaks from '@bytemd/plugin-breaks';
import mediumZoom from '@bytemd/plugin-medium-zoom';

export const index = [
  gfm(
    {
      locale: {
        table: '表格',
        task: '任务',
        strike: '自动链接文字',
      },
    },
  ),
  highlight(),
  frontMatter(),
  math(),
  mermaid(),
  gEmoji(),
  breaks(),
  mediumZoom(),
];
