import AdminLayout from '#/layouts/admin-layout/AdminLayout.vue';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      order: -1,
    },
    name: 'Dashboard',
    path: '/',
    redirect: '/home',
    component: AdminLayout,
    children: [
      {
        name: 'Home',
        path: 'home',
        component: () => import('#/views/home.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: '工作台',
        },
      },
    ],
  },
];
export default routes;
