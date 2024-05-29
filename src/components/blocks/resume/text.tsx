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
      strings: ['ls^100 resume^100', 'nvim^100 resume^100', 'cat^100 resume^100', 'more^100 resume^100'],
      typeSpeed: 120,
      backSpeed: 120,
      backDelay: 200,
      loop: true,
      cursorChar: '_',
    })
    return () => {
      typed.destroy()
    }
  }, [])

  return <span ref={ref}>Resume</span>
}
