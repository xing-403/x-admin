<script setup lang="ts">
import SvgIcon from '#/components/SvgIcon/index.vue';
import { useTabsStore, type TabsItem } from '#/store/modules/tabs';
import ScrollbarList from './scrollbar-list.vue';

import { useTabbar, type TabsActionKey } from './use-tabbar';
import { useI18n } from '#/locales';

defineOptions({ name: 'LayoutTabbar' });

const tabsStore = useTabsStore();
const { t } = useI18n();
const { getTabMenuItems, handleAction } = useTabbar()

</script>

<template>
  <a-flex class="layout-tabbar" align="center" gap="small" w-full>
    <div flex-1 overflow-auto>
      <ScrollbarList />
    </div>
    <a-dropdown placement="bottomRight"
      :menu="{ items: tabsStore.activeTab ? getTabMenuItems(tabsStore.activeTab as TabsItem) : [] }"
      @menu-click="({ key }) => handleAction(tabsStore.activeTab as TabsItem, key as TabsActionKey)">
      <a-button type="text" size="small" :aria-label="t('tabbar.more')">
        <template #icon>
          <SvgIcon name="EllipsisOutlined" />
        </template>
      </a-button>
    </a-dropdown>
  </a-flex>
</template>

<style scoped>
.layout-tabbar {
  padding: 4px 12px;
  background: var(--base-background);
  border-bottom: 1px solid var(--border);
}
</style>
