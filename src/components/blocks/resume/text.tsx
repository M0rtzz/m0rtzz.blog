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
      strings: ['ls^100 resume ^500', 'vim ^1000', 'cat resume ^2000'],
      typeSpeed: 150,
      backSpeed: 100,
      backDelay: 200,
      loop: true,
      cursorChar: '_',
    })
    return () => {
      typed.destroy()
    }
  }, [])

  return <span ref={ref}>resume</span>
}
