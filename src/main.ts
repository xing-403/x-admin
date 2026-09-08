import { createApp } from 'vue';
import 'virtual:uno.css';

import './assets/styles/main.css';
import App from './App.vue';

import { initStores } from './store';
import router from './router';
import { usePreferencesStore } from './store/modules/preferences';
import { setGlobalLocale } from './locales';

const app = createApp(App);

app.use(router);
initStores(app, { namespace: import.meta.env.VITE_APP_NAMESPACE });

// 用持久化的语言偏好初始化全局 i18n locale
setGlobalLocale(usePreferencesStore().locale ?? 'zh-CN');

app.mount('#app');
