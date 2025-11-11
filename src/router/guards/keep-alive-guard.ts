import type { Router } from 'vue-router';
import { useDynamicRouteStore } from '@/stores/dynamic-route-store';

export default (router: Router) => {
  router.afterEach(to => {
    if (isEmpty(to.name)) {
      return;
    }
    if (!to.meta) {
      return;
    }
    const name = to.name?.toString();
    if (name) {
      const dynamicRoutesStore = useDynamicRouteStore();
      if (to.meta.keepAlive) {
        if (!dynamicRoutesStore.hasCachedRoute(name)) {
          dynamicRoutesStore.addCachedRoute(name);
        }
      } else {
        dynamicRoutesStore.removeCacheRoute(name);
      }
    }
  });
};
