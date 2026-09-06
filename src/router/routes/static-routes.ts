import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('#/views/login.vue'),
    meta: {
      icon: 'carbon:workspace',
      title: 'login',
    },
  },
  {
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
    component: () => import('#/views/error/NotFound.vue'),
    meta: {
      title: 'NotFound',
      hideInMenu: true,
      hideInTabs: true,
    },
  },
];
export default routes;
