import { computed, reactive } from 'vue';
import zhCN from './lang/zh-CN';
import enUS from './lang/en-US';

export type LocaleType = 'zh-CN' | 'en-US';

export const localeMessages: Record<LocaleType, Record<string, any>> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

export const availableLocales: LocaleType[] = Object.keys(localeMessages) as LocaleType[];

const state = reactive({
  locale: 'zh-CN' as LocaleType,
});

/** 按点号路径查找嵌套文案，例如 'menus.workbench' */
function lookup(obj: any, key: string): string | undefined {
  return key.split('.').reduce<any>((acc, k) => (acc == null ? undefined : acc[k]), obj);
}

/** 翻译：读取当前 locale 对应消息（reactive，切语言时自动更新） */
export function translate(key: string, fallback?: string): string {
  const msg = localeMessages[state.locale];
  const val = lookup(msg, key);
  if (val !== undefined && val !== null) return String(val);
  return fallback ?? key;
}

export function getLocale(): LocaleType {
  return state.locale;
}

export function setGlobalLocale(locale: LocaleType): void {
  state.locale = locale;
}

export function useI18n() {
  const t = (key: string, fallback?: string): string => translate(key, fallback);
  return {
    t,
    locale: computed(() => state.locale),
    availableLocales,
    setLocale: setGlobalLocale,
  };
}
