import { defineConfig } from 'vite';
import { generateVitePlugins, resolve } from './vite-config';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    resolve,
    plugins: generateVitePlugins(),
  };
});
