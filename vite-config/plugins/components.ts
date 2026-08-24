import { AntdvNextResolver } from '@antdv-next/auto-import-resolver';

import Components from 'unplugin-vue-components/vite';

function createComponentsPlugin() {
  return Components({
    resolvers: [AntdvNextResolver()],
    globs: ['src/components/**/*.vue'],
    dts: 'typing/components.d.ts',
  });
}

export default createComponentsPlugin;
