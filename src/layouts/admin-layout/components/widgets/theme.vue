<script setup lang="ts">
import { useI18n } from '#/locales';
import { usePreferencesStore } from '#/store/modules/preferences';
import { computed } from 'vue';

const { t } = useI18n()

function toggleTheme() {
  preferencesStore.theme.mode = isDark.value ? 'light' : 'dark'
}
const preferencesStore = usePreferencesStore()
const isDark = computed(() => preferencesStore.isDark)
</script>

<template>
  <a-button type="text" shape="circle" :aria-label="t('header.toggleTheme')" @click="toggleTheme">
    <template #icon>
      <SvgIcon :name="isDark ? 'SunOutlined' : 'MoonOutlined'" />
    </template>
  </a-button>

</template>
