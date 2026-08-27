import { defineConfig, loadEnv } from 'vite';
import { generateVitePlugins, resolve } from './vite-config';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:8080';

  return {
    resolve,
    plugins: generateVitePlugins(),
    server: {
      proxy: {
        // 将 /dev-api 代理到 RuoYi-Vue-Plus 后端并去掉前缀
        '/dev-api': {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dev-api/, ''),
        },
      },
    },
  };
});
