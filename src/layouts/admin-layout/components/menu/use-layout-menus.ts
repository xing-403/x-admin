import { computed, ref, watch } from 'vue';
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router';
import { adminRoutes } from '#/router/routes';
import { joinPath } from '#/router/routes/helper';
import { translate } from '#/locales';
import type { LayoutMenuItem, LayoutMenuProps } from './type';

/** 布局根路由：自身不承载页面（无 title），仅用于挂载子路由 */
function isLayoutRoute(route: RouteRecordRaw) {
  return !!route.children?.length && !route.meta?.title;
}

/** 将路由记录转换为菜单项 */
function toMenuItem(route: RouteRecordRaw, parentPath: string): LayoutMenuItem | null {
  const { hideInMenu, icon, title } = route.meta ?? {};
  if (hideInMenu) {
    return null;
  }

  const path = joinPath(parentPath, route.path);
  const item: LayoutMenuItem = {
    key: path,
    label: title ? translate(`menus.${title}`) : path,
    icon,
  };

  const children = generateMenus(route.children ?? [], path);
  if (children.length > 0) {
    item.children = children;
  }
  return item;
}

/** 递归生成菜单列表：布局根路由的子路由提升为当前层级 */
function generateMenus(routes: RouteRecordRaw[], parentPath = ''): LayoutMenuItem[] {
  return routes
    .filter((route) => !route.meta?.hideInMenu)
    .sort((a, b) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0))
    .flatMap((route) => {
      const path = joinPath(parentPath, route.path);
      // 布局根路由（如 AdminLayout 根节点）不生成菜单项，子路由提升
      if (isLayoutRoute(route)) {
        return generateMenus(route.children ?? [], path);
      }
      const item = toMenuItem(route, parentPath);
      return item ? [item] : [];
    });
}

/** 收集当前路径所有父级菜单的 key，用于展开子菜单 */
function findOpenKeys(items: LayoutMenuItem[], path: string): string[] {
  for (const item of items) {
    if (item.key === path) {
      return [];
    }
    if (item.children?.length) {
      const keys = findOpenKeys(item.children, path);
      if (keys.length > 0 || item.children.some((c) => c.key === path)) {
        return [item.key, ...keys];
      }
    }
  }
  return [];
}

export function useLayoutMenus(props: LayoutMenuProps) {
  const route = useRoute();
  const router = useRouter();

  const menuMode = computed(() => {
    if (props.collapsed && props.mode === 'vertical') {
      return 'inline';
    }
    return props.mode;
  });

  // 根据路由信息生成的菜单列表
  const menuItems = computed(() => generateMenus(adminRoutes));

  const selectedKeys = ref<string[]>([]);
  const openKeys = ref<string[]>([]);

  watch(
    () => route.path,
    (path) => {
      selectedKeys.value = path ? [path] : [];
      openKeys.value = findOpenKeys(menuItems.value, path);
    },
    { immediate: true },
  );

  /** 菜单点击跳转（key 为路由完整路径） */
  function handleMenuClick(info: { key: string | number }) {
    const path = String(info.key);
    if (path && path !== route.path) {
      router.push(path);
    }
  }

  return {
    menuMode,
    menuItems,
    openKeys,
    selectedKeys,
    handleMenuClick,
  };
}
