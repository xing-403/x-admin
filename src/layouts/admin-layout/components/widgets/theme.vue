<script setup lang="ts">
import { useI18n } from '#/locales';
import { usePreferencesStore } from '#/store/modules/preferences';
import type { ThemeMode } from '#/store/modules/preferences';
import { computed } from 'vue';
import SvgIcon from '#/components/SvgIcon/index.vue';

const { t } = useI18n();
const preferencesStore = usePreferencesStore();

const mode = computed(() => preferencesStore.theme.mode);

const menuItems = [
  { key: 'light', label: t('theme.light') },
  { key: 'dark', label: t('theme.dark') },
  { key: 'auto', label: t('theme.auto') },
];

function handleMenuClick({ key }: { key: string }) {
  preferencesStore.theme.mode = key as ThemeMode;
}
function handleToggleTheme() {
  preferencesStore.theme.mode = preferencesStore.isDark ? 'light' : 'dark';
}

/** 当前图标：跟随系统时用显示器图标，否则按明暗显示太阳/月亮 */
const currentIcon = computed(() => {
  if (mode.value === 'auto') return 'MonitorOutlined';
  return preferencesStore.isDark ? 'MoonOutlined' : 'SunOutlined';
});
</script>

<template>
  <a-dropdown placement="bottomRight" :menu="{ items: menuItems, onClick: handleMenuClick }">
    <a-button type="text" shape="circle" :aria-label="t('header.toggleTheme')" @click="handleToggleTheme">
      <template #icon>
        <SvgIcon :name="currentIcon" />
      </template>
    </a-button>
    <template #labelRender="item">
      <a-flex w-100px justify="space-between" gap="small">
        <a-typography-text>{{ item.label }}</a-typography-text>
        <SvgIcon v-if="item.key === mode" name="CheckCircleOutlined" color="var(--color-primary)" />
      </a-flex>
    </template>
  </a-dropdown>
</template>
