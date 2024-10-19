import { tw } from 'tw-styled/merge'

import { Block } from '@/components/blocks/block'

import { Toggle } from './toggle'

const AnimateSpan = tw.span`hidden origin-bottom-right text-sm transition-transform duration-700 group-hover:rotate-[360deg] lg:block xl:text-base`

export const Font = () => {
  return (
    <Block
      data-type='setting'
      className='group grid grid-cols-3 grid-rows-4 items-center justify-items-center bg-surface-1 text-lg font-semibold text-color-1 lg:grid-cols-5 lg:grid-rows-6'
    >
      <AnimateSpan className='block'>Aa</AnimateSpan>
      <AnimateSpan className='block'>Bb</AnimateSpan>
      <AnimateSpan className='block'>Cc</AnimateSpan>
      <AnimateSpan className='block'>Dd</AnimateSpan>
      <AnimateSpan className='block'>Ee</AnimateSpan>
      <AnimateSpan className='block'>Ff</AnimateSpan>
      <AnimateSpan className='block'>Gg</AnimateSpan>
      <AnimateSpan className='block'>Hh</AnimateSpan>
      <AnimateSpan className='block'>Ii</AnimateSpan>
      <AnimateSpan className='block'>Jj</AnimateSpan>
      <AnimateSpan className='block'>Kk</AnimateSpan>
      <AnimateSpan className='block'></AnimateSpan>
      <AnimateSpan className='block'>Ll</AnimateSpan>
      <AnimateSpan className='block'></AnimateSpan>
      <AnimateSpan className='block'>Mm</AnimateSpan>
      <AnimateSpan className='block'></AnimateSpan>
      <Toggle />
      <AnimateSpan className='block'></AnimateSpan>
      <AnimateSpan className='block'>Nn</AnimateSpan>
      <AnimateSpan className='block'></AnimateSpan>
      <AnimateSpan className='block'>Oo</AnimateSpan>
      <AnimateSpan className='block'></AnimateSpan>
      <AnimateSpan className='block'>Pp</AnimateSpan>
      <AnimateSpan className='block'>Qq</AnimateSpan>
      <AnimateSpan className='block'>Rr</AnimateSpan>
      <AnimateSpan className='block'>Ss</AnimateSpan>
      <AnimateSpan className='block'>Tt</AnimateSpan>
      <AnimateSpan className='block'>Uu</AnimateSpan>
      <AnimateSpan className='block'>Vv</AnimateSpan>
      <AnimateSpan className='block'>Ww</AnimateSpan>
      <AnimateSpan className='block'>Xx</AnimateSpan>
      <AnimateSpan className='block'>Yy</AnimateSpan>
      <AnimateSpan className='block'>Zz</AnimateSpan>
    </Block>
  )
}