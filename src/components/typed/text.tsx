import { useEffect, useRef } from 'react'

import { IconChevronRight } from '@tabler/icons-react'
import { clsx } from 'clsx'

import { useIsServer } from '@/hooks/useIsServer'
import { sleep } from '@/utils'

import type { TypedChildProps } from './typed'

export interface TypedTextProps extends TypedChildProps {
  beforeDelay?: number
  afterDelay?: number
}

export const TypedText = (props: TypedTextProps) => {
  const {
    children,
    active,
    beforeDelay = 500,
    afterDelay = 500,
    onRendered,
  } = props
  const ref = useRef<HTMLElement | null>(null)
  const isServer = useIsServer()

  useEffect(() => {
    if (typeof children !== 'string') {
      return
    }
    ref.current?.scrollIntoView({ behavior: 'smooth' })
    let cancel = false
    let id: number
    const typed = () => {
      if (!ref.current || cancel) {
        return
      }
      const text = children.trim()
      const stringArr = Array.from(
        text.replace(ref.current.innerText.trim(), ''),
      )
      let index = 0
      id = window.setInterval(() => {
        if (!ref.current || index === stringArr.length) {
          window.clearInterval(id)
          sleep(afterDelay).then(onRendered)
          return
        }
        ref.current.innerText += stringArr[index++]
      }, 150)
    }
    if (beforeDelay) {
      sleep(beforeDelay).then(typed)
    } else {
      typed()
    }
    return () => {
      cancel = true
      window.clearInterval(id)
    }
    // eslint-disable-next-line
  }, [])

  if (isServer) {
    return (
      <p className='flex items-center gap-1'>
        <IconChevronRight className='size-3.5 text-green-400' />
        {children}
      </p>
    )
  }

  return (
    <p
      className={clsx('flex items-center gap-1', {
        'after:content-["█"]': active,
        'font-bold italic': !active,
      })}
    >
      <span hidden={!active} className='text-sky-400'>
        ~
      </span>
      <IconChevronRight className='size-3.5 text-green-400' />
      <span ref={ref} />
    </p>
  )
}
