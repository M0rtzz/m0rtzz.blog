'use client'
import { useEffect, useRef } from 'react'

import Typed from 'typed.js'

export const ResumeText = () => {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }
    const typed = new Typed(ref.current, {
      strings: ['ls resume', 'nvim resume', 'cat resume', 'more resume'],
      typeSpeed: 120,
      backSpeed: 120,
      backDelay: 1000,
      loop: true,
      cursorChar: '_',
    })
    return () => {
      typed.destroy()
    }
  }, [])

  return <span ref={ref}></span>
}
