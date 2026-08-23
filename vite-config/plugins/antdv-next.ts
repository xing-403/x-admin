
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver';

import Components from 'unplugin-vue-components/vite';

function createAntdvNextPlugin() {
  return Components({
    resolvers: [
      AntdvNextResolver()
    ],
    dts: 'typing/components.d.ts'
  })
}

export default createAntdvNextPlugin
