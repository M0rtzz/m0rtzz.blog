import { useEffect, useRef } from 'react'

import type { TypedChildProps } from './typed'

export const TypedContent = (props: TypedChildProps) => {
  const { children, onRendered } = props
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })

    const id = window.setTimeout(() => {
      onRendered?.()
    }, 1500)
    return () => {
      window.clearTimeout(id)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div
      ref={ref}
      className='prose-sm p-4 text-inherit prose-a:text-sky-500 prose-a:underline prose-strong:text-white prose-code:mx-0.5 prose-code:rounded prose-code:bg-gray-700 prose-code:p-1 prose-code:text-white'
    >
      {children}
    </div>
  )
}
