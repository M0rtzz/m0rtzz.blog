'use client'
import { useRouter } from 'next/navigation'

import { I18nProvider, RouterProvider } from 'react-aria-components'

import { FontProvider } from '@/context/font'

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  return (
    <I18nProvider locale='en-US'>
      <RouterProvider navigate={router.push}>
        <FontProvider>{children}</FontProvider>
      </RouterProvider>
    </I18nProvider>
  )
}
