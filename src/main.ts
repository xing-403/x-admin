import { createApp } from 'vue';
import 'virtual:uno.css';

import './assets/styles/main.css';
import App from './App.vue';

import { initStores } from './store';
import router from './router';

const app = createApp(App);

app.use(router);
initStores(app, { namespace: import.meta.env.VITE_APP_NAMESPACE });
app.mount('#app');
