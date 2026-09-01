import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  shortcuts: [],
  theme: {
    colors: {}
  },
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      scale: 1.5,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {},
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
