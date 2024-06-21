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
    './src/markdown/twoslash/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'rgb(var(--border) / <alpha-value>)',
      },
      colors: {
        brand: 'rgb(var(--brand) / <alpha-value>)',
        'color-1': 'rgb(var(--text-1) / <alpha-value>)',
        'color-2': 'rgb(var(--text-2) / <alpha-value>)',
        'color-3': 'rgb(var(--text-3) / <alpha-value>)',
        'color-4': 'rgb(var(--text-4) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-1': 'rgb(var(--surface-1) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        'surface-3': 'rgb(var(--surface-3) / <alpha-value>)',
        'surface-4': 'rgb(var(--surface-4) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
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
          'Segoe UI',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        primary: ['var(--font-remote)', 'sans-serif', 'Segoe UI'],
        handwriting: [
          'var(--font-remote-handwriting)',
          'var(--font-remote-sans)',
          'sans-serif',
        ],
      },
      keyframes: {
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
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
