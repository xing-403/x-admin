import { reactive, watch } from 'vue';
import { usePreferencesStore } from '#/store/modules/preferences';
import type { GlobalToken } from 'antdv-next';

const getCssVariableValue = (variable: string) => {
  const rootStyles = getComputedStyle(document.documentElement);
  return rootStyles.getPropertyValue(variable).trim();
};

export function useAntdDesignTokens() {
  const preferencesStore = usePreferencesStore();

  const tokens = reactive<Partial<GlobalToken>>({
    colorPrimary: getCssVariableValue('--color-primary'),
    colorBgContainer: getCssVariableValue('--base-background'),
    colorBgLayout: getCssVariableValue('--page-background'),
    colorText: getCssVariableValue('--text-primary'),
    colorBgElevated: getCssVariableValue('--color-background-10'),
  });

  const componentToken = reactive({
    Layout: {
      siderBg: getCssVariableValue('--base-background'),
      headerPadding: '0 20px',
      headerHeight: preferencesStore.tabbar.enable ? 42 : 64,
      headerBg: getCssVariableValue('--base-background'),
      footerBg: getCssVariableValue('--base-background'),
      footerPadding: '10px 20px',
    },
  });

  // 主题切换时重新读取 CSS 变量，使 antd token 同步
  watch(
    () => [preferencesStore.isDark, preferencesStore.theme.color],
    () => {
      tokens.colorPrimary = getCssVariableValue('--color-primary');
      tokens.colorBgContainer = getCssVariableValue('--base-background');
      tokens.colorBgLayout = getCssVariableValue('--page-background');
      tokens.colorText = getCssVariableValue('--text-primary');
      tokens.colorBgElevated = getCssVariableValue('--color-background-10');
      componentToken.Layout.siderBg = getCssVariableValue('--base-background');
      componentToken.Layout.headerBg = getCssVariableValue('--base-background');
      componentToken.Layout.headerHeight = preferencesStore.tabbar.enable ? 42 : 64;
      componentToken.Layout.footerBg = getCssVariableValue('--base-background');
    },
    { immediate: true },
  );

  return {
    tokens,
    componentToken,
  };
}
