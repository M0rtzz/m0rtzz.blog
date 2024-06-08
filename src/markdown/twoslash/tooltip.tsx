'use client'

import { OverlayArrow } from 'react-aria-components'

import { Tooltip } from '@/components/ui'

interface TwoslashTooltipProps {
  noArrow?: boolean
  children: React.ReactNode
  portalContainer?: HTMLElement
}

export const TwoslashTooltip = (props: TwoslashTooltipProps) => {
  const { noArrow, children, portalContainer } = props

  return (
    <Tooltip
      placement='bottom left'
      offset={4}
      arrowBoundaryOffset={8}
      shouldFlip={false}
      className='shiki-twoslash max-w-[80vw] origin-top-left md:max-w-[90ch]'
      UNSTABLE_portalContainer={portalContainer}
    >
      <div className='not-prose rounded border bg-surface shadow-lg'>
        {!noArrow && (
          <OverlayArrow>
            <span className='relative block border-[6px] border-transparent before:absolute before:left-0 before:top-0 before:-translate-x-1/2 before:-translate-y-1/2 before:border-[7px] before:border-transparent before:border-b-border before:content-[""] after:absolute after:left-0 after:top-px after:z-10  after:-translate-x-1/2 after:-translate-y-1/2 after:border-[6px] after:border-transparent after:border-b-surface after:content-[""]' />
          </OverlayArrow>
        )}
        {children}
      </div>
    </Tooltip>
  )
}
