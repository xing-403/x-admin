import { createRouter, createWebHistory } from 'vue-router';

// 初始路由列表。
import { routes } from './routes';
import { useUserStore } from '#/store/modules/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE),
  routes,
  scrollBehavior: (to, _from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return to.hash ? { behavior: 'smooth', el: to.hash } : { left: 0, top: 0 };
  },
});

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore();
  const hasToken = !!userStore.token;

  if (hasToken) {
    // 已登录访问登录页 → 跳首页
    if (to.path === '/login') {
      next('/');
      return;
    }
    // 首次进入：拉取用户信息，失败则清除登录态
    if (!userStore.userInfo) {
      try {
        await userStore.fetchUserInfo();
      } catch {
        await userStore.logout();
        next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
        return;
      }
    }
    next();
    return;
  }

  // 未登录
  if (to.path === '/login') {
    next();
  } else {
    next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});

export default router;
