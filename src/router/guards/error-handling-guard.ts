import type { Router } from 'vue-router';

import { errorNotification } from '@/element-plus/notification';

export default (router: Router) => {
  router.onError((error, to) => {
    errorNotification(`路由跳转出现错误：${error}！${to.fullPath}`, '路由跳转错误');
  });
};
