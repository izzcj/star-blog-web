/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * 应用标题
   */
  readonly STAR_BLOG_APP_TITLE: string;
  /**
   * 应用API基路径
   */
  readonly STAR_BLOG_APP_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}
