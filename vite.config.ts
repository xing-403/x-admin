import { defineConfig } from 'vite'
import { generateVitePlugins } from './vite-config'


// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: generateVitePlugins(),
  }
})
