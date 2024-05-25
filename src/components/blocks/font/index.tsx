import { tw } from 'tw-styled'

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
      <AnimateSpan className='block'>a</AnimateSpan>
      <AnimateSpan className='block'>A</AnimateSpan>
      <AnimateSpan>Aa</AnimateSpan>
      <AnimateSpan>a</AnimateSpan>
      <AnimateSpan>a</AnimateSpan>
      <AnimateSpan>Aa</AnimateSpan>
      <AnimateSpan>a</AnimateSpan>
      <AnimateSpan>A</AnimateSpan>
      <AnimateSpan>a</AnimateSpan>
      <AnimateSpan>Aa</AnimateSpan>
      <Toggle />
      <AnimateSpan className='block'>Aa</AnimateSpan>
      <AnimateSpan className='block'>a</AnimateSpan>
      <AnimateSpan className='block'>A</AnimateSpan>
      <AnimateSpan>Aa</AnimateSpan>
      <AnimateSpan>a</AnimateSpan>
      <AnimateSpan>a</AnimateSpan>
      <AnimateSpan>Aa</AnimateSpan>
      <AnimateSpan>a</AnimateSpan>
      <AnimateSpan>A</AnimateSpan>
      <AnimateSpan>a</AnimateSpan>
      <AnimateSpan>Aa</AnimateSpan>
      <AnimateSpan>a</AnimateSpan>
      <AnimateSpan>A</AnimateSpan>
    </Block>
  )
}
