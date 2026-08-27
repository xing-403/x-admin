import zhCN from 'antdv-next/dist/locale/zh_CN';
import enUS from 'antdv-next/dist/locale/en_US';
import type { LocaleType } from './index';

/** antdv-next 组件库自带的 locale 包，用于本地化 DatePicker 等内置文案 */
export const antdLocales: Record<LocaleType, any> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};
