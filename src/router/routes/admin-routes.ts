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
      {
        // 个人信息：仅右上角 user-dropdown 入口，不在侧边栏展示
        name: 'Profile',
        path: 'account/profile',
        component: () => import('#/views/account/profile.vue'),
        meta: {
          icon: 'carbon:user',
          title: 'profile',
          hideInMenu: true,
        },
      },
      {
        name: 'Todo',
        path: 'todo',
        component: () => import('#/views/todo/index.vue'),
        meta: {
          icon: 'carbon:task',
          title: 'todo',
        },
      },
    ],
  },
];
export default routes;
