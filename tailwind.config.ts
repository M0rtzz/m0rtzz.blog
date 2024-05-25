import typography from '@tailwindcss/typography'
import plugin from 'tailwindcss/plugin'
import tailwindAnimate from 'tailwindcss-animate'
import reactAriaComponent from 'tailwindcss-react-aria-components'

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/markdown/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'var(--border)',
      },
      colors: {
        brand: 'var(--brand)',
        'color-1': 'var(--text-1)',
        'color-2': 'var(--text-2)',
        'color-3': 'var(--text-3)',
        'color-4': 'var(--text-4)',
        surface: 'var(--surface)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        'surface-4': 'var(--surface-4)',
      },
      boxShadow: {
        bento: '0 2px 4px rgba(0,0,0,.04)',
      },
      backgroundImage: ({ theme }) => ({
        paper: `linear-gradient(90deg, transparent 0%, transparent 5%, ${theme('colors.orange.600')} 5%, ${theme('colors.orange.600')} calc(5% + 2px), transparent calc(5% + 2px), transparent 100%), linear-gradient(180deg, white 56px, transparent 56px), repeating-linear-gradient(180deg, ${theme('colors.sky.500')} 0px, ${theme('colors.sky.500')} 2px, transparent 2px, transparent 32px), linear-gradient(white,white);`,
        'paper-dark': `linear-gradient(90deg, transparent 0%, transparent 5%, ${theme('colors.zinc.500')} 5%, ${theme('colors.zinc.500')} calc(5% + 2px), transparent calc(5% + 2px), transparent 100%), linear-gradient(180deg, ${theme('colors.gray.900')} 56px, transparent 56px), repeating-linear-gradient(180deg, ${theme('colors.zinc.700')} 0px, ${theme('colors.zinc.700')} 2px, transparent 2px, transparent 32px), linear-gradient(${theme('colors.gray.900')},${theme('colors.gray.900')});`,
      }),
      fontFamily: {
        sans: [
          'var(--font-remote-sans)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        primary: ['var(--font-remote)', 'sans-serif'],
        handwriting: [
          'var(--font-remote-handwriting)',
          'var(--font-remote-sans)',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [
    typography,
    reactAriaComponent,
    tailwindAnimate,
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': value => {
            return {
              'animation-delay': value,
            }
          },
        },
        {
          values: theme('transitionDelay'),
        },
      )
    }),
  ],
}
export default config
