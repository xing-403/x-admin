import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('#/views/login.vue'),
    meta: {
      icon: 'carbon:workspace',
      title: '登录',
    },
  },
];
export default routes;
