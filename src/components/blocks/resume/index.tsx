import dynamic from 'next/dynamic'
import Link from 'next/link'

import { IconTerminal } from '@tabler/icons-react'
import { tw } from 'tw-styled'

import { Block } from '@/components/blocks/block'

const ResumeText = dynamic(
  () => import('./text').then(module => module.ResumeText),
  {
    loading: () => <span>Resume</span>,
  },
)

export const Dot = tw.i`block h-3 w-3 rounded-full`

export const Resume = () => (
  <Block
    data-type='about'
    tabIndex={0}
    className='overflow-clip bg-[#282935] !p-0 outline-offset-4 transition-transform hover:scale-105 dark:bg-surface-1'
  >
    <span className='absolute left-0 right-0 top-0 flex gap-2 border-b-black bg-slate-700 px-6 py-3 dark:bg-surface-2'>
      <Dot className='bg-red-500' />
      <Dot className='bg-yellow-400' />
      <Dot className='bg-green-500' />
    </span>
    <Link
      className='flex h-full w-full items-center justify-center text-lg text-gray-200 md:text-2xl'
      aria-label='Go to resume page'
      href='/resume'
    >
      <IconTerminal className='mr-2 size-4 text-green-400 md:size-6' />
      <ResumeText />
    </Link>
  </Block>
)
