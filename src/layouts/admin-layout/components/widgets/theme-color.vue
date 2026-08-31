<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '#/locales';
import SvgIcon from '#/components/SvgIcon/index.vue';
import { usePreferencesStore } from '#/store/modules/preferences';
import type { ItemType } from 'antdv-next/dist/menu/interface';

const { t } = useI18n();
const preferencesStore = usePreferencesStore();

const current = computed(() => preferencesStore.theme.color);

const PRESET_COLORS = computed(() => [
  { key: 'default', label: t('theme.themes.default'), color: '#165dff' },
  { key: 'cyan', label: t('theme.themes.cyan'), color: '#008699' },
  { key: 'purple', label: t('theme.themes.purple'), color: '#722ed1' },
  { key: 'carbon', label: t('theme.themes.carbon'), color: '#36454F' },
  { key: 'forest', label: t('theme.themes.forest'), color: '#007860' },
  { key: 'redbiz', label: t('theme.themes.redbiz'), color: '#b83333' },
]);

function select({ key }: { key: string }) {
  preferencesStore.theme.color = key;
}
</script>

<template>
  <a-dropdown placement="bottomRight" :menu="{ items: PRESET_COLORS as unknown as ItemType[], onClick: select }">
    <a-button type="text" shape="circle" :aria-label="t('header.toggleTheme')">
      <template #icon>
        <SvgIcon name="BgColorsOutlined" />
      </template>
    </a-button>
    <template #labelRender="item">
      <a-flex w-100px justify="space-between" align="center" gap="small">
        <a-badge :color="item.color" :text="item.label" />
        <SvgIcon v-if="item.key === current" name="CheckCircleOutlined" color="var(--color-primary)" />
      </a-flex>
    </template>
  </a-dropdown>
</template>
