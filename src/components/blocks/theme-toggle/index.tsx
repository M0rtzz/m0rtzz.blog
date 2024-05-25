import { IconNorthStar, IconSparkles } from '@tabler/icons-react'
import { tw } from 'tw-styled'

import { Block } from '@/components/blocks/block'

import { Toggle } from './toggle'

const Cloud = tw.div`absolute h-1/5 w-1/5 rounded-full bg-gradient-to-b from-sky-100 to-white transition-all duration-1000 before:absolute before:-left-1/3 before:top-1/4 before:-z-10 before:h-2/3 before:w-2/3 before:rounded-full before:bg-gradient-to-b before:from-sky-100 before:to-white before:content-["_"] after:absolute after:-right-1/4 after:top-1/3 after:-z-10 after:h-1/2 after:w-1/2 after:rounded-full after:bg-gradient-to-b after:from-sky-100 after:to-white`

export function ThemeToggle() {
  return (
    <Block
      data-type='setting'
      className='group overflow-hidden border-none bg-surface shadow-none transition-transform hover:scale-105 dark:bg-transparent dark:before:content-none'
    >
      <Toggle>
        <Cloud className='left-[15%] top-[10%] dark:-left-1/3' />
        <Cloud className='right-[10%] top-1/4 [transform:rotateY(180deg)_scale(0.75)] dark:-right-1/4' />
        <Cloud className='left-[5%] top-1/2 scale-75 dark:-left-1/3' />
        <div className='absolute left-1/2 top-1/3 z-20 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-bl from-orange-300 via-orange-500 to-red-600 transition-all duration-1000 after:absolute after:right-0 after:top-0 after:h-3/4 after:w-3/4 after:origin-top-right after:scale-0 after:rounded-full after:bg-surface after:transition-transform after:duration-1000 after:content-["_"] group-hover:-translate-y-[15%] group-hover:scale-90 dark:from-slate-600 dark:via-indigo-600 dark:to-indigo-900 dark:after:scale-100' />
        <IconSparkles className='absolute -top-1/4 left-[15%] size-6 fill-yellow-100 text-yellow-100 transition-all duration-1000 dark:top-[15%]' />
        <IconNorthStar className='absolute -top-1/4 left-1/2 size-5 text-yellow-50 transition-all duration-1000 dark:top-[5%]' />
        <IconNorthStar className='absolute -top-1/4 right-[10%] size-6 text-yellow-50 transition-all duration-1000 dark:top-[20%]' />
      </Toggle>
    </Block>
  )
}
