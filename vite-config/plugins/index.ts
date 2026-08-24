import createComponentsPlugin from "./components"
import createViteVueDevToolsPlugin from "./dev-tools"
import createUnoCSSPlugin from "./unocss"
import createVuePlugin from "./vue"

export function generateVitePlugins() {
  return [
    // vite vue 插件
    createVuePlugin(),
    // unocss 原子化样式插件
    createUnoCSSPlugin(),
    // antd-next 自动导入插件
    createComponentsPlugin(),
    // vue dev-tools 插件
    createViteVueDevToolsPlugin()
  ]
}
