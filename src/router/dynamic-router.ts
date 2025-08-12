/**
 * 动态路由
 *
 * @author Ale
 * @version 1.0.0
 * @since 2024/8/30
 */
const viewModules: Recordable<() => Promise<Recordable>> = import.meta.glob(
  ['@/views/**/index.{vue,tsx}', '!@/views/**/components/**/index.{vue,tsx}'],
  {
    eager: false,
  },
);

const views: Recordable<() => Promise<Recordable>> = {};
for (const key of keys(viewModules)) {
  // 截取组件名称
  const name = key.replace('/src/views', '').replace(/\/index\.(vue|tsx)/, '');
  views[name] = viewModules[key];
}

export default views;
