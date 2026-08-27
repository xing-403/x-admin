<script lang="ts" setup>
import { useAntdDesignTokens } from '#/hooks/use-antd-design-tokens';
import { useThemeCssVariable } from '#/hooks/use-theme-css-variable';
import { antdLocales } from '#/locales/antd-locale';
import { setGlobalLocale } from '#/locales';
import { theme } from 'antdv-next';
import { computed, ref, watch } from 'vue';
import { usePreferencesStore } from '#/store/modules/preferences';

defineOptions({ name: 'App' });

const preferencesStore = usePreferencesStore();
const isDark = computed(() => preferencesStore.isDark);

// 主题切换时自动更新对应的 CSS 变量（html.dark 类）
useThemeCssVariable();

const { tokens, componentToken } = useAntdDesignTokens();

const algorithm = computed(() => {
  return [isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm];
});

// 语言切换：同步全局 i18n locale、antd 组件 locale、html lang 属性
const antdLocale = ref(antdLocales[preferencesStore.locale]);
watch(
  () => preferencesStore.locale,
  (locale) => {
    setGlobalLocale(locale);
    antdLocale.value = antdLocales[locale];
    document.documentElement.lang = locale;
  },
  { immediate: true },
);
</script>

<template>
  <a-config-provider :locale="antdLocale" :theme="{ algorithm, token: tokens, components: componentToken }">
    <a-app class="h-full">
      <router-view />
    </a-app>
  </a-config-provider>
</template>
