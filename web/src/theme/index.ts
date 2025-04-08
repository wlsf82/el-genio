import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { buttonRecipe } from './recipes/button.recipe'

const BRAND_PALETTE = 'purple'

const config = defineConfig({
  globalCss: {
    html: {
      colorPalette: 'brand',
      fontSize: '15px',
    },
  },

  theme: {
    recipes: {
      button: buttonRecipe,
    },
    tokens: {
      fonts: {
        heading: { value: 'Inter' },
        body: { value: 'Inter' },
      },

      colors: {
        brand: {
          50: { value: `{colors.${BRAND_PALETTE}.50}` },
          100: { value: `{colors.${BRAND_PALETTE}.100}` },
          200: { value: `{colors.${BRAND_PALETTE}.200}` },
          300: { value: `{colors.${BRAND_PALETTE}.300}` },
          400: { value: `{colors.${BRAND_PALETTE}.400}` },
          500: { value: `{colors.${BRAND_PALETTE}.500}` },
          600: { value: `{colors.${BRAND_PALETTE}.600}` },
          700: { value: `{colors.${BRAND_PALETTE}.700}` },
          800: { value: `{colors.${BRAND_PALETTE}.800}` },
          900: { value: `{colors.${BRAND_PALETTE}.900}` },
        },
      },
    },

    semanticTokens: {
      radii: {
        l1: { value: '0.375rem' },
        l2: { value: '0.5rem' },
        l3: { value: '0.75rem' },
      },
      colors: {
        brand: {
          solid: { value: `{colors.${BRAND_PALETTE}.600}` },
          contrast: { value: `white` },
          fg: { value: `{colors.${BRAND_PALETTE}.700}` },
          muted: { value: `{colors.${BRAND_PALETTE}.100}` },
          subtle: { value: `{colors.${BRAND_PALETTE}.50}` },
          emphasized: { value: `{colors.${BRAND_PALETTE}.200}` },
          focusRing: { value: `{colors.${BRAND_PALETTE}.600}` },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
