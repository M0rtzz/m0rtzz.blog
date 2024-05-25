import {
  IconPinFilled,
  IconStar,
  IconBook2,
  IconGitFork,
} from '@tabler/icons-react'
import { clsx } from 'clsx'

import { Block } from '@/components/blocks/block'
import { queryPinnedItems } from '@/service'

export const Pinned = async () => {
  const {
    user: {
      pinnedItems: { nodes: pinnedItems },
    },
  } = await queryPinnedItems()

  return (
    <Block
      data-type='projects'
      className='z-10 col-span-2 row-span-5 flex flex-col border-none bg-paper !p-0 font-handwriting shadow-md dark:bg-paper-dark sm:col-span-3 sm:row-span-4 md:row-span-2 xl:col-span-2'
    >
      <h2 className='flex items-center gap-2 pl-[10%] pt-4 text-2xl font-bold text-brand xl:pt-6'>
        <IconPinFilled className='size-6' />
        Pinned
      </h2>
      <div className='grid flex-1 grid-cols-1 justify-center gap-3 px-4 py-2 text-color-1 sm:grid-cols-2 sm:grid-rows-3 lg:gap-5 xl:p-6 xl:pl-[10%]'>
        {pinnedItems.map((item, index) => {
          const language = item.languages.nodes[0]
          const round = index % 3 === 0
          const rotate = Math.random() * 10 - 5
          return (
            <a
              key={item.url}
              href={item.url}
              target='_blank'
              style={{ transform: `rotate(${rotate}deg)` }}
              className='group/note relative z-10 flex flex-col border-transparent p-4 text-xs transition-transform before:absolute before:inset-x-[3%] before:bottom-[15%] before:top-3/4 before:-z-20 before:skew-y-[5deg] before:shadow-[0_15px_10px_rgba(0,0,0,.6)] before:transition-transform before:duration-500 before:content-["_"] after:absolute after:inset-x-[3%] after:bottom-[15%] after:top-3/4 after:-skew-y-[5deg] after:shadow-[0_15px_10px_rgba(0,0,0,.6)] after:transition-transform after:duration-500 after:content-["_"] hover:before:scale-[1.03] hover:after:scale-[1.03]'
            >
              <div
                className={clsx(
                  'absolute inset-0 z-10 bg-yellow-100 shadow-[0_0_5px_rgba(0,0,0,.5)] transition-transform duration-500 group-hover/note:scale-[1.03] dark:bg-slate-800',
                  round && 'rounded-[0_0_90px_90px/0_0_20px_20px]',
                )}
              />
              <p className='relative z-20 flex items-center gap-2'>
                <IconBook2 className='size-4 flex-none' />
                <span className='text-base font-semibold'>{item.name}</span>
              </p>
              <p className='relative z-20 flex-1'>{item.description}</p>
              <div className='relative z-20 flex gap-5'>
                {language && (
                  <div className='flex items-center'>
                    <i
                      className='box-content inline-block h-2.5 w-2.5 rounded-full border border-[rgb(255,255,255,0.2)]'
                      style={{
                        background: language.color,
                        color: language.color,
                      }}
                    />
                    <span className='ml-1.5'>{language.name}</span>
                  </div>
                )}
                {item.stargazerCount !== 0 && (
                  <div className='flex items-center'>
                    <IconStar className='size-4' />
                    <span className='ml-1'>{item.stargazerCount}</span>
                  </div>
                )}
                {item.forkCount !== 0 && (
                  <div className='flex items-center'>
                    <IconGitFork className='size-4' />
                    <span className='ml-1'>{item.forkCount}</span>
                  </div>
                )}
              </div>
            </a>
          )
        })}
      </div>
    </Block>
  )
}
