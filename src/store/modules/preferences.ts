import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import type { LocaleType } from '#/locales';

export type ThemeMode = 'light' | 'dark';

export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const sidebar = reactive({
      /** 是否显示侧边栏 */
      enable: false,
      /** 是否折叠为图标栏 */
      collapsed: false,
    });

    const theme = reactive({
      mode: 'light' as ThemeMode,
    });

    /** 是否为暗夜模式 */
    const isDark = computed(() => theme.mode === 'dark');

    /** 当前语言 */
    const locale = ref<LocaleType>('zh-CN');

    return {
      sidebar,
      theme,
      isDark,
      locale,
    };
  },
  {
    persist: true,
  },
);
