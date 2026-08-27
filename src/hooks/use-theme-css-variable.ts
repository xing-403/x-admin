import { watch } from 'vue';
import { usePreferencesStore } from '#/store/modules/preferences';

/**
 * 主题 CSS 变量联动
 *
 * 项目的明暗主题通过 `theme.css` 中的 CSS 变量实现：
 * - 亮色变量定义在 `:root`
 * - 暗色变量定义在 `.dark`（即 `html.dark`）
 *
 * 因此「切换主题」本质上就是同步 `<html>` 元素上的 `dark` 类，
 * 浏览器会自动应用对应的 CSS 变量。本 composable 负责把
 * `preferencesStore.isDark` 与 `html.dark` 类保持同步，
 * 并在运行时切换时加入颜色过渡动画，避免生硬跳变。
 */
export function useThemeCssVariable() {
  const preferencesStore = usePreferencesStore();

  /** 根据当前主题模式更新 <html> 上的 dark 类（立即生效，无过渡） */
  const applyTheme = (isDark: boolean) => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.dataset.theme = isDark ? 'dark' : 'light';
  };

  /**
   * 运行时切换主题：先开启过渡，再改 class，过渡结束后移除。
   * 仅在 html.theme-anim 存在的短暂窗口内对颜色属性做过渡，
   * 不影响 hover 等常态交互。
   */
  let transitionTimer: ReturnType<typeof setTimeout> | undefined;
  const applyThemeWithTransition = (isDark: boolean) => {
    const root = document.documentElement;
    root.classList.add('theme-anim');
    // 强制重排，确保 transition 属性在本帧已生效，否则颜色变化不会动画
    void root.offsetHeight;
    applyTheme(isDark);
    if (transitionTimer) clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      root.classList.remove('theme-anim');
    }, 320);
  };

  // 初始化时立即同步（保证从持久化状态恢复时 CSS 变量正确），不加过渡避免首屏闪动
  applyTheme(preferencesStore.isDark);

  // 主题切换时自动更新对应的 CSS 变量（带过渡动画）
  watch(
    () => preferencesStore.isDark,
    (value) => applyThemeWithTransition(value),
  );

  return { applyTheme, applyThemeWithTransition };
}
