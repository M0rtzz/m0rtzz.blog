'use client'

import { useEffect, useRef, useState } from 'react'

import Loading from './loading'

export default function PostReveal({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    let started = false
    let timeout: number | undefined
    const content = contentRef.current
    if (!content) return

    const revealWhenComplete = () => {
      if (started || !content.querySelector('[data-markdown-ready]')) return
      started = true
      observer.disconnect()

      // Do not wait forever if a font request stalls.
      timeout = window.setTimeout(() => {
        if (active) setReady(true)
      }, 10000)
      void document.fonts.ready.then(() => {
        if (active) setReady(true)
      })
    }

    const observer = new MutationObserver(revealWhenComplete)
    observer.observe(content, { childList: true, subtree: true })
    revealWhenComplete()

    return () => {
      active = false
      observer.disconnect()
      window.clearTimeout(timeout)
    }
  }, [])

  return (
    <div className={ready ? 'post-reveal-ready' : 'post-reveal-pending'}>
      <div className='post-reveal-loading'>
        <Loading />
      </div>
      <div className='post-reveal-content' ref={contentRef}>{children}</div>
      <noscript>
        <style>{`
          .post-reveal-loading { display: none !important; }
          .post-reveal-content { position: static !important; visibility: visible !important; height: auto !important; overflow: visible !important; }
        `}</style>
      </noscript>
      <script
        dangerouslySetInnerHTML={{
          __html: `setTimeout(function(){var root=document.querySelector('.post-reveal-pending');if(root?.querySelector('[data-markdown-ready]'))root.classList.add('post-reveal-ready')},15000)`,
        }}
      />
    </div>
  )
}
