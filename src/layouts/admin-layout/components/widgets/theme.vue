<script setup lang="ts">
import { useI18n } from '#/locales';
import { usePreferencesStore } from '#/store/modules/preferences';
import type { ThemeMode } from '#/store/modules/preferences';
import { computed } from 'vue';
import SvgIcon from '#/components/SvgIcon/index.vue';

const { t } = useI18n();
const preferencesStore = usePreferencesStore();

const mode = computed(() => preferencesStore.theme.mode);

const menuItems = computed(() => [
  { key: 'light', label: t('theme.light') },
  { key: 'dark', label: t('theme.dark') },
  { key: 'auto', label: t('theme.auto') },
]);

function handleMenuClick({ key }: { key: string }) {
  preferencesStore.theme.mode = key as ThemeMode;
}

/** 当前图标：跟随系统时用显示器图标，否则按明暗显示太阳/月亮 */
const currentIcon = computed(() => {
  if (mode.value === 'auto') return 'MonitorOutlined';
  return preferencesStore.isDark ? 'SunOutlined' : 'MoonOutlined';
});
</script>

<template>
  <a-dropdown :trigger="['click']" placement="bottomRight" :menu="{ items: menuItems, onClick: handleMenuClick }">
    <a-button type="text" shape="circle" :aria-label="t('header.toggleTheme')">
      <template #icon>
        <SvgIcon :name="currentIcon" />
      </template>
    </a-button>
  </a-dropdown>
</template>
