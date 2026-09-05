import { useI18n } from '#/locales';
import SvgIcon from '#/components/SvgIcon/index.vue';
import { useTabsStore, type TabsItem } from '#/store/modules/tabs';
import type { ItemType } from 'antdv-next/dist/menu/interface';
import { h } from 'vue';

export type TabsActionKey =
  | 'affix'
  | 'unaffix'
  | 'closeLeft'
  | 'closeRight'
  | 'closeOther'
  | 'closeAll'
  | 'close';
function getActiveIndex(tabs: TabsItem[], activeKey: string) {
  return tabs.findIndex((tab) => tab.key === activeKey);
}
export function useTabbar() {
  const { t } = useI18n();
  const tabsStore = useTabsStore();

  function getTabMenuItems(tab: TabsItem): ItemType[] {
    const activeIndex = getActiveIndex(tabsStore.tabItems, tab.key);
    return [
      {
        key: tab.affix ? 'unaffix' : 'affix',
        label: t(`tabbar.${tab.affix ? 'unaffixCurrent' : 'affixCurrent'}`),
        icon: h(SvgIcon, { name: tab.affix ? 'mdi:pin-off' : 'mdi:pin' }),
      },
      {
        key: 'closeLeft',
        label: t('tabbar.closeLeft'),
        icon: h(SvgIcon, { name: 'mdi:arrow-collapse-left' }),
        disabled:
          activeIndex == 0 ||
          !tabsStore.tabItems.slice(0, activeIndex).some((tab: TabsItem) => !tab.affix),
      },
      {
        key: 'closeRight',
        label: t('tabbar.closeRight'),
        icon: h(SvgIcon, { name: 'mdi:arrow-collapse-right' }),
        disabled:
          activeIndex === tabsStore.tabItems.length - 1 ||
          !tabsStore.tabItems.slice(activeIndex).some((tab: TabsItem) => !tab.affix),
      },
      {
        key: 'closeOther',
        label: t('tabbar.closeOther'),
        icon: h(SvgIcon, { name: 'mdi:arrow-split-vertical' }),
        disabled: !tabsStore.tabItems.some((item: TabsItem) => !item.affix && item.key !== tab.key),
      },
      {
        key: 'closeAll',
        icon: h(SvgIcon, { name: 'mdi:swap-horizontal' }),
        label: t('tabbar.closeAll'),
      },
      {
        type: 'divider',
      },
      {
        key: 'close',
        icon: h(SvgIcon, { name: 'mdi:close' }),
        disabled: tabsStore.tabItems.length <= 1,
        label: t('tabbar.closeCurrent'),
      },
    ];
  }
  /** 右侧下拉：作用于当前激活的标签 */
  function handleAction(item: TabsItem, key: TabsActionKey) {
    switch (key) {
      case 'affix':
      case 'unaffix':
        tabsStore.affixTab(item.key);
        break;
      case 'close':
        tabsStore.closeTab(item.key);
        break;
      case 'closeAll':
        tabsStore.closeAll();
        break;
      case 'closeLeft':
        tabsStore.closeLeft(item.key);
        break;
      case 'closeRight':
        tabsStore.closeRight(item.key);
        break;
      case 'closeOther':
        tabsStore.closeOther(item.key);
        break;
    }
  }
  return {
    getTabMenuItems,
    handleAction,
  };
}
