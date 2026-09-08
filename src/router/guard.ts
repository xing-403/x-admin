import type { Router } from 'vue-router';

import { useUserStore } from '#/store/modules/user';
import { useTabsStore } from '#/store/modules/tabs';
import { useNprogress } from '#/hooks/use-nprogress';

export function createRouterGuard(router: Router) {
  const { startProgress, stopProgress } = useNprogress();
  router.beforeEach(async (to, _from) => {
    startProgress();
    const userStore = useUserStore();
    const tabsStore = useTabsStore();

    if (userStore.hasToken) {
      // 已登录访问登录页 → 跳首页
      if (to.path === '/login') {
        return '/';
      }
      // 首次进入：拉取用户信息，失败则清除登录态
      if (!userStore.userInfo) {
        try {
          await userStore.fetchUserInfo();
        } catch {
          await userStore.logout();
          return `/login?redirect=${encodeURIComponent(to.fullPath)}`;
        }
      }
      tabsStore.addTab(to);
      return true;
    } else if (to.path === '/login') {
      return true;
    } else {
      return `/login?redirect=${encodeURIComponent(to.fullPath)}`;
    }
  });

  router.afterEach(() => {
    stopProgress();
  });
}
