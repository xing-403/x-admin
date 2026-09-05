import type { RouteRecordRaw } from 'vue-router';

/** 拼接父子路由路径，得到完整绝对路径 */
export function joinPath(parentPath: string, childPath: string): string {
  if (childPath.startsWith('/')) {
    return childPath;
  }
  const parent = parentPath === '/' ? '' : parentPath;
  return `${parent}/${childPath}` || '/';
}

/**
 * 递归遍历路由表
 * @param routes 路由记录列表
 * @param callback 每项回调，第二项为拼接后的完整路径
 * @param parentPath 父级完整路径
 */
export function walkRoutes(
  routes: RouteRecordRaw[],
  callback: (route: RouteRecordRaw, fullPath: string) => void,
  parentPath = '',
): void {
  routes.forEach((route) => {
    const fullPath = joinPath(parentPath, route.path);
    callback(route, fullPath);
    if (route.children?.length) {
      walkRoutes(route.children, callback, fullPath);
    }
  });
}
