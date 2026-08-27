import AdminLayout from '#/layouts/admin-layout/AdminLayout.vue';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      order: -1,
    },
    path: '/',
    component: AdminLayout,
    children: [
      {
        name: 'Dashboard',
        path: '',
        redirect: '/home',
        meta: {
          icon: 'carbon:workspace',
        },
        children: [
          {
            name: 'Home',
            path: 'home',
            component: () => import('#/views/dashboard/home.vue'),
            meta: {
              icon: 'carbon:workspace',
              title: 'workbench',
            },
          },
          {
            name: 'About',
            path: 'about',
            component: () => import('#/views/dashboard/about.vue'),
            meta: {
              icon: 'carbon:information',
              title: 'about',
            },
          },
        ],
      },
    ],
  },
];
export default routes;
