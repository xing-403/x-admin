import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import type { LocaleType } from '#/locales';

export type ThemeMode = 'light' | 'dark' | 'auto';

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
      /** 主题模式：light 浅色 / dark 暗色 / auto 跟随系统 */
      mode: 'light' as ThemeMode,
    });

    /**
     * 系统是否偏好暗色（prefers-color-scheme: dark）。
     * 响应式：注册 matchMedia 监听，系统切换明暗时实时更新，
     * 配合 mode='auto' 实现「主题跟随系统」的响应式体验。
     */
    const systemPrefersDark = ref(false);
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      systemPrefersDark.value = mql.matches;
      const onChange = (e: MediaQueryListEvent) => {
        systemPrefersDark.value = e.matches;
      };
      // addEventListener 为新标准，addListener 兼容旧浏览器
      if (mql.addEventListener) {
        mql.addEventListener('change', onChange);
      } else if (mql.addListener) {
        mql.addListener(onChange);
      }
    }

    /** 是否为暗夜模式（mode=auto 时跟随系统实时变化） */
    const isDark = computed(
      () => theme.mode === 'dark' || (theme.mode === 'auto' && systemPrefersDark.value),
    );

    /** 当前语言 */
    const locale = ref<LocaleType>('zh-CN');

    return {
      sidebar,
      theme,
      isDark,
      systemPrefersDark,
      locale,
    };
  },
  {
    persist: true,
  },
);
