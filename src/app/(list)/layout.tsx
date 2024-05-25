import { IconArrowBack } from '@tabler/icons-react'

import { GoBack } from '@/components/go-back'
import { Header } from '@/components/header/article'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex flex-col items-center gap-16'>
      <Header sticky />
      <GoBack className='flex h-16 w-16 items-center justify-center rounded-full border bg-surface shadow'>
        <IconArrowBack className='size-8' />
      </GoBack>
      {children}
    </main>
  )
}
