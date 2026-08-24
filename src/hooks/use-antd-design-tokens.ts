import { reactive, watch } from 'vue';
const getCssVariableValue = (variable: string, isColor: boolean = true) => {
  const rootStyles = getComputedStyle(document.documentElement);
  const value = rootStyles.getPropertyValue(variable);
  return isColor ? `hsl(${value})` : value;
};
export function useAntdDesignTokens() {
  const tokens = reactive({
    colorPrimary: '#00b96b',
    colorBgContainer: '#f6ffed',
  });

  watch(
    () => true,
    () => {
      tokens.colorBgContainer = getCssVariableValue('--background');
    },
    {
      immediate: true,
    },
  );

  const componentToken = reactive({
    Layout: {
      siderBg: getCssVariableValue('--background'),
      headerPadding: '0 20px',
      headerBg: getCssVariableValue('--background'),
      footerBg: getCssVariableValue('--background'),
      footerPadding: '10px 20px',
    },
  });
  return {
    tokens,
    componentToken,
  };
}
