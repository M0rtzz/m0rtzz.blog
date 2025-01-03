import { clsx } from 'clsx'
import { DarkToggleProvider, DarkToggleScript } from 'dark-toggle/react'
import { Nunito, Handlee, Sorts_Mill_Goudy } from 'next/font/google'

import { Provider } from '@/provider'

import Footer from './footer'

import type { Metadata, Viewport } from 'next'

import './globals.css'

const sans = Nunito({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-remote-sans',
  display: 'swap',
})

const serif = Sorts_Mill_Goudy({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-remote-serif',
  display: 'swap',
})

const handwriting = Handlee({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-remote-handwriting',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000212' },
  ],
  colorScheme: 'light dark',
}

export const metadata: Metadata = {
  title: {
    absolute: '学海航行',
    template: '%s | 学海航行',
  },
  description:
    'Dive into front-end development with a focus on React, cutting-edge frameworks, JavaScript, TypeScript, Swift, Animation and more',
  keywords: [
    'Front-end Development',
    'React',
    'JavaScript',
    'TypeScript',
    'CSS',
    'Animation',
    'Swift',
  ],
  applicationName: 'm0rtzz.com',
  authors: {
    name: 'M0rtzz',
    url: 'https://github.com/M0rtzz',
  },
  creator: 'M0rtzz',
  publisher: 'M0rtzz',
  generator: 'Next.js',
  verification: {
    google: 'saBLo0mZh0Y72IhjxjOC1sExDHA-8WH6vp4NSAavmUQ',
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      suppressHydrationWarning
      lang='en'
      className={clsx(sans.variable, serif.variable, handwriting.variable)}
    >
      <head>
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/icons/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/icons/favicon-16x16.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/icons/apple-touch-icon.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <link
          rel='icon'
          type='image/png'
          sizes='192x192'
          href='/icons/android-chrome-192x192.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='512x512'
          href='/icons/android-chrome-512x512.png'
        />
        <DarkToggleScript />
      </head>
      <body className='bg-surface font-primary text-color-1'>
        <div className='fixed inset-0 bottom-1/4 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:hidden' />
        <Provider>
          <DarkToggleProvider>{children}</DarkToggleProvider>
        </Provider>
        <Footer />
      </body>
    </html>
  )
}
