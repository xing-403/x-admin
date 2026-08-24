import type { RouteRecordRaw } from 'vue-router';
import adminRoutes from './admin-routes';
import staticRoutes from './static-routes';

export const routes: RouteRecordRaw[] = [...adminRoutes, ...staticRoutes];
