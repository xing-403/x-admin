import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRoute, type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router';
import { translate } from '#/locales';
import { walkRoutes } from '#/router/routes/helper';

/** 标签页信息 */
export interface RouteTab {
  /** 唯一标识：完整路径（含 query / hash），同一路由不同参数各占一个标签 */
  key: string;
  /** 路由 path（不含 query） */
  path: string;
  /** 完整路径（用于跳转） */
  fullPath: string;
  /** 标题对应的 i18n key（menus.xxx） */
  titleKey: string;
  /** 路由名称 */
  name?: string;
  /** 菜单图标 */
  icon?: string;
  /** 固定标签：不可关闭，且不参与批量关闭 */
  affix: boolean;
}

export interface TabsItem {
  key: string;
  label: string;
  icon?: string;
  affix: boolean;
}
/** 关闭所有标签后的兜底跳转地址（会由路由重定向到首页） */
export const FALLBACK_PATH = '/';

export const useTabsStore = defineStore(
  'tabs',
  () => {
    /** 已打开的标签页 */
    const tabs = ref<RouteTab[]>([]);
    const route = useRoute();
    const activeKey = ref('');

    const tabItems = computed(() =>
      tabs.value
        .map((tab) => ({
          key: tab.key,
          label: translate(`menus.${tab.titleKey}`, tab.titleKey),
          icon: tab.icon,
          affix: tab.affix,
        }))
        .sort((a, b) => {
          if (a.affix && !b.affix) return -1;
          if (!a.affix && b.affix) return 1;
          return 0;
        }),
    );
    const activeTab = computed(() => tabItems.value.find((tab) => tab.key === activeKey.value));
    const onlyOneTab = computed(() => tabs.value.length === 1);

    function getIndex(key: string) {
      return tabs.value.findIndex((tab) => tab.key === key);
    }

    /** 路由记录转标签页；登录页等无需入栈的路由返回 null */
    function toTab(route: RouteLocationNormalized): RouteTab | null {
      if (!route.name || route.meta?.hideInTabs) {
        return null;
      }
      const titleKey = String(route.meta?.title ?? route.name);
      return {
        key: route.fullPath,
        path: route.path,
        fullPath: route.fullPath,
        titleKey,
        name: route.name ? String(route.name) : undefined,
        icon: route.meta?.icon,
        affix: route.meta?.affix === true,
      };
    }

    /** 新增 / 更新标签并激活（路由变化时调用） */
    function addTab(route: RouteLocationNormalized) {
      const tab = toTab(route);
      if (!tab) {
        return;
      }
      const index = getIndex(tab.key);
      if (index === -1) {
        tabs.value.push(tab);
      } else {
        // 已存在则刷新标题等信息（如语言/菜单调整）
        const oldTab = tabs.value[index];
        tabs.value.splice(index, 1, { ...oldTab, ...tab, affix: oldTab.affix });
      }
      activeKey.value = tab.key;
    }

    /** 初始化固定标签（扫描路由表中 meta.affix 的页面，幂等） */
    function initAffixTabs(routes: RouteRecordRaw[]) {
      walkRoutes(routes, (route, fullPath) => {
        if (!route.meta?.affix || route.children?.length || !route.meta.title) {
          return;
        }
        if (getIndex(fullPath) !== -1) {
          return;
        }
        tabs.value.push({
          key: fullPath,
          path: fullPath,
          fullPath,
          titleKey: String(route.meta.title),
          name: route.name ? String(route.name) : undefined,
          icon: route.meta.icon,
          affix: true,
        });
      });
    }

    /**
     * 关闭单个标签
     * @returns 需要跳转的地址；null 表示当前路由未受影响，无需跳转
     */
    function closeTab(key: string): string | null {
      const index = getIndex(key);
      if (index === -1) {
        return null;
      }
      // 固定标签不可关闭
      if (tabs.value[index].affix) {
        return null;
      }
      const isActive = activeKey.value === key;
      // 关闭后优先激活右侧标签，其次左侧
      const next = tabs.value[index + 1] ?? tabs.value[index - 1] ?? null;
      tabs.value.splice(index, 1);

      if (!isActive) {
        return null;
      }
      if (next) {
        activeKey.value = next.key;
        return next.fullPath;
      }
      activeKey.value = '';
      return FALLBACK_PATH;
    }
    function affixTab(key: string): string | null {
      const index = getIndex(key);
      if (index < 0) {
        return null;
      }
      const tab = tabs.value[index];
      tabs.value = [
        ...tabs.value.slice(0, index),
        { ...tab, affix: !tab.affix },
        ...tabs.value.slice(index + 1),
      ];
      return syncActive(key);
    }
    /** 关闭左侧标签（保留固定标签） */
    function closeLeft(key: string): string | null {
      const index = getIndex(key);
      if (index <= 0) {
        return null;
      }
      const kept = tabs.value.slice(0, index).filter((tab) => tab.affix);
      tabs.value = [...kept, ...tabs.value.slice(index)];
      return syncActive(key);
    }

    /** 关闭右侧标签（保留固定标签） */
    function closeRight(key: string): string | null {
      const index = getIndex(key);
      if (index === -1) {
        return null;
      }
      const kept = tabs.value.slice(index + 1).filter((tab) => tab.affix);
      tabs.value = [...tabs.value.slice(0, index + 1), ...kept];
      return syncActive(key);
    }

    /** 关闭其他标签（保留固定标签与目标标签） */
    function closeOther(key: string): string | null {
      const index = getIndex(key);
      if (index === -1) {
        return null;
      }
      tabs.value = tabs.value.filter((tab) => tab.affix || tab.key === key);
      return syncActive(key);
    }

    /** 关闭全部标签（保留固定标签） */
    function closeAll(): string | null {
      tabs.value = tabs.value.filter((tab) => tab.affix);
      const next = tabs.value[0];
      if (next) {
        return syncActive(next.key);
      } else {
        setTimeout(() => {
          addTab(route);
        }, 300);
      }
      return FALLBACK_PATH;
    }

    /** 若当前激活标签已被批量关闭，则激活目标标签并返回跳转地址 */
    function syncActive(key: string): string | null {
      const stillAlive = tabs.value.some((tab) => tab.key === activeKey.value);
      if (stillAlive) {
        return null;
      }
      activeKey.value = key;
      return key;
    }

    /** 清空标签（退出登录时调用） */
    function reset() {
      tabs.value = [];
      activeKey.value = '';
    }

    return {
      tabs,
      activeKey,
      activeTab,
      tabItems,
      onlyOneTab,
      addTab,
      initAffixTabs,
      closeTab,
      closeLeft,
      closeRight,
      closeOther,
      closeAll,
      reset,
      affixTab,
    };
  },
  {
    persist: true,
  },
);
