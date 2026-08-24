import type { Pinia } from 'pinia';
import type { App } from 'vue';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

interface InitStoreOptions {
  namespace: string;
}

const pinia: Pinia = createPinia();
export async function initStores(app: App, options: InitStoreOptions) {
  const { namespace } = options;

  pinia.use(
    createPersistedState({
      key: (storeKey: string) => `${namespace}-${storeKey}`,
      storage: localStorage,
    }),
  );
  app.use(pinia);
  return pinia;
}
