'use client'

import { cloneElement, useRef } from 'react'

import { TooltipTrigger, Button } from 'react-aria-components'

import { useMounted } from '@/hooks/useMounted'

interface TooltipTriggerProps {
  children: React.ReactElement[]
  className?: string
  open: boolean
}

export const TwoslashTrigger = (props: TooltipTriggerProps) => {
  const { children, className, open } = props
  const [span, tooltip] = children

  const mounted = useMounted()
  const ref = useRef<HTMLElement>(null)

  return (
    <TooltipTrigger delay={0} isOpen={open}>
      <Button ref={ref} className={className} {...span.props} />
      {mounted &&
        cloneElement(tooltip, {
          portalContainer:
            ref.current!.closest('.shiki.twoslash')!.parentElement,
        })}
    </TooltipTrigger>
  )
}
