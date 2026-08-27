import { reactive, watch } from 'vue';
import { usePreferencesStore } from '#/store/modules/preferences';

/** 读取 CSS 变量当前值（theme.css 中变量已是完整颜色值，无需再包裹 hsl()） */
const getCssVariableValue = (variable: string) => {
  const rootStyles = getComputedStyle(document.documentElement);
  return rootStyles.getPropertyValue(variable).trim();
};

export function useAntdDesignTokens() {
  const preferencesStore = usePreferencesStore();

  const tokens = reactive({
    colorPrimary: getCssVariableValue('--primary'),
    colorBgContainer: getCssVariableValue('--background'),
    colorBgLayout: getCssVariableValue('--background-deep'),
    colorText: getCssVariableValue('--foreground'),
  });

  const componentToken = reactive({
    Layout: {
      siderBg: getCssVariableValue('--background'),
      headerHeight: getCssVariableValue('--header-height'),
      headerPadding: '0 20px',
      headerBg: getCssVariableValue('--header'),
      footerBg: getCssVariableValue('--background'),
      footerPadding: '10px 20px',
    },
  });

  // 主题切换时重新读取 CSS 变量，使 antd token 同步
  watch(
    () => preferencesStore.isDark,
    () => {
      tokens.colorPrimary = getCssVariableValue('--primary');
      tokens.colorBgContainer = getCssVariableValue('--background');
      tokens.colorBgLayout = getCssVariableValue('--background-deep');
      tokens.colorText = getCssVariableValue('--foreground');
      componentToken.Layout.siderBg = getCssVariableValue('--background');
      componentToken.Layout.headerBg = getCssVariableValue('--header');
      componentToken.Layout.footerBg = getCssVariableValue('--background');
    },
    { immediate: true },
  );

  return {
    tokens,
    componentToken,
  };
}
