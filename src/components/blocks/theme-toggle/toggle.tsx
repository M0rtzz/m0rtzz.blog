'use client'
import { useDarkToggle } from 'dark-toggle/react'

export const Toggle = (props: { children: React.ReactNode }) => {
  const { children } = props
  const { toggle } = useDarkToggle()
  return (
    <button
      className='h-full w-full'
      aria-label='Theme Toggle'
      onClick={toggle}
    >
      {children}
    </button>
  )
}
