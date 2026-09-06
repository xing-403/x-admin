<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import SvgIcon from '#/components/SvgIcon/index.vue';
import Scrollbar from '#/components/Scrollbar/index.vue';
import { useTabsStore, type TabsItem } from '#/store/modules/tabs';

import { useTabbar, type TabsActionKey } from './use-tabbar';
import { useI18n } from '#/locales';
import { computed, ref } from 'vue';
import { usePreferencesStore } from '#/store/modules/preferences';

defineOptions({ name: 'LayoutTabbar' });

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();
const preferencesStore = usePreferencesStore()
const { t } = useI18n();
const scrollContainerRef = ref()
const isOverflow = computed(() => scrollContainerRef.value?.isOverflow)

/** 跳转到目标地址（地址为空或与当前一致时跳过） */
function navigate(path: string | null) {
  if (path && path !== route.fullPath) {
    router.push(path);
  }
}
const { getTabMenuItems, handleAction } = useTabbar()
/** 点击标签切换路由 */
function handleTabClick(key: string) {
  navigate(key);
}
function handleRemoveScrollbarLeft() {
  scrollContainerRef.value?.scrollLeft(200)
}
function handleRemoveScrollbarRight() {
  scrollContainerRef.value?.scrollRight(200)
}

</script>

<template>
  <div class="layout-tabbar" w-full>
    <a-flex align="center" gap="small">
      <a-button v-if="isOverflow" type="text" size="small" @click="handleRemoveScrollbarLeft">
        <template #icon>
          <SvgIcon name="DoubleLeftOutlined"></SvgIcon>
        </template>
      </a-button>
      <div flex="1" overflow-hidden>
        <Scrollbar w-full ref="scrollContainerRef">
          <a-flex flex-1 gap="small">
            <a-dropdown v-for="item in tabsStore.tabItems" :key="item.key"
              :menu="{ items: getTabMenuItems(item as TabsItem) }"
              @menu-click="({ key }) => handleAction(item as TabsItem, key as TabsActionKey)"
              :trigger="['contextmenu']">
              <a-button :variant="item.key === tabsStore.activeKey ? 'solid' : 'filled'" color="default"
                @click="handleTabClick(item.key)" size="small">
                <template v-if="preferencesStore.tabbar.showIcon" #icon>
                  <SvgIcon v-if="item.icon" :name="item.icon" size="14px" />
                </template>
                <a-flex gap="small" align="center">
                  <span>{{ item.label }}</span>
                  <div v-if="!tabsStore.onlyOneTab"
                    @click.stop="handleAction(item as TabsItem, item.affix ? 'unaffix' : 'close')">
                    <SvgIcon v-if="item.affix" name="PushpinFilled" size="14px" />
                    <SvgIcon v-else name="CloseOutlined" size="14px" />
                  </div>
                </a-flex>
              </a-button>
            </a-dropdown>
          </a-flex>
        </Scrollbar>
      </div>
      <a-button v-if="isOverflow" type="text" size="small" @click="handleRemoveScrollbarRight">
        <template #icon>
          <SvgIcon name="DoubleRightOutlined"></SvgIcon>
        </template>
      </a-button>
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
  </div>
</template>

<style scoped>
.layout-tabbar {
  padding: 4px 12px;
  background: var(--base-background);
  border-bottom: 1px solid var(--border);
}
</style>
