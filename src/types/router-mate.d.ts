/**
 * RouteMeta类型
 *
 * @author Ale
 * @version 1.0.0
 * @since 2024/8/30
 */
// 这段可以直接添加到你的任何 `.ts` 文件中，例如 `router.ts`
// 也可以添加到一个 `.d.ts` 文件中。确保这个文件包含在
// 项目的 `tsconfig.json` 中的 "file" 字段内。
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 标题
     */
    title: string;
    /**
     * 图标
     */
    icon?: string;
    /**
     * 是否缓存
     */
    keepAlive: boolean;
    /**
     * 激活的菜单（默认为自身）
     */
    activeMenu?: string;
    /**
     * 是否为一级路由
     * 当路由自身为一级菜单时设为true，存在子级则设为false
     */
    topLevel: boolean;
    /**
     * 是否隐藏
     */
    hidden?: boolean;
    /**
     * 是否无需鉴权
     */
    ignoreAuthentication?: boolean;
  }
}
