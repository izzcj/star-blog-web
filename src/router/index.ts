import type { Router } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import commonRouter from '@/router/common-router';
import adminRouter from '@/router/admin-router';

type RouterGuardSetter = (router: Router) => void;

const guardModules: Recordable<RouterGuardSetter> = import.meta.glob('./guards/**/*.ts', {
  eager: true,
  import: 'default',
  exhaustive: false,
});

const router = createRouter({
  history: createWebHistory(),
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: [
    ...commonRouter,
    ...adminRouter,
  ],
});

for (const guard of values(guardModules)) {
  guard.call(undefined, router);
}

export default router;
