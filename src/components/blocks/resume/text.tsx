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
      strings: ['^200ls resume', '^200nvim resume', '^200cat resume', '^200more resume'],
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
