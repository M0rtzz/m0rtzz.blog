'use client'

import React, { useCallback, useEffect, useId, useRef, useState } from 'react'

import { clsx } from 'clsx'

import { CopyButton } from './copy-button'

interface PreProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLPreElement>,
    HTMLPreElement
  > {
  content?: string
}

export const Pre = (props: PreProps) => {
  const { className, content, children, ...rest } = props
  const preId = useId()
  const preRef = useRef<HTMLPreElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startScrollLeft: number
  } | null>(null)
  const [scrollbar, setScrollbar] = useState({
    scrollable: false,
    thumbWidth: 100,
    thumbLeft: 0,
    scrollLeft: 0,
    maxScrollLeft: 0,
  })

  const updateScrollbar = useCallback(() => {
    const pre = preRef.current
    if (!pre) return

    const maxScrollLeft = Math.max(0, pre.scrollWidth - pre.clientWidth)
    const thumbWidth = maxScrollLeft
      ? Math.max(12, (pre.clientWidth / pre.scrollWidth) * 100)
      : 100
    const thumbLeft = maxScrollLeft
      ? (pre.scrollLeft / maxScrollLeft) * (100 - thumbWidth)
      : 0

    setScrollbar({
      scrollable: maxScrollLeft > 0,
      thumbWidth,
      thumbLeft,
      scrollLeft: pre.scrollLeft,
      maxScrollLeft,
    })
  }, [])

  useEffect(() => {
    const pre = preRef.current
    if (!pre) return

    updateScrollbar()
    pre.addEventListener('scroll', updateScrollbar, { passive: true })

    const resizeObserver = new ResizeObserver(updateScrollbar)
    resizeObserver.observe(pre)
    if (pre.firstElementChild) resizeObserver.observe(pre.firstElementChild)

    return () => {
      pre.removeEventListener('scroll', updateScrollbar)
      resizeObserver.disconnect()
    }
  }, [updateScrollbar])

  const scrollToTrackPosition = (clientX: number) => {
    const pre = preRef.current
    const track = trackRef.current
    if (!pre || !track || !scrollbar.maxScrollLeft) return

    const trackRect = track.getBoundingClientRect()
    const thumbWidth = (scrollbar.thumbWidth / 100) * trackRect.width
    const position = Math.max(
      0,
      Math.min(
        trackRect.width - thumbWidth,
        clientX - trackRect.left - thumbWidth / 2,
      ),
    )
    pre.scrollLeft =
      (position / Math.max(1, trackRect.width - thumbWidth)) *
      scrollbar.maxScrollLeft
  }

  const handleTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      scrollToTrackPosition(event.clientX)
    }
  }

  const handleThumbPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: preRef.current?.scrollLeft ?? 0,
    }
  }

  const handleThumbPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const drag = dragRef.current
    const pre = preRef.current
    const track = trackRef.current
    if (!drag || drag.pointerId !== event.pointerId || !pre || !track) return

    const trackWidth = track.getBoundingClientRect().width
    const thumbWidth = (scrollbar.thumbWidth / 100) * trackWidth
    const availableWidth = Math.max(1, trackWidth - thumbWidth)
    pre.scrollLeft =
      drag.startScrollLeft +
      ((event.clientX - drag.startX) / availableWidth) * scrollbar.maxScrollLeft
  }

  const handleThumbPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleThumbKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const pre = preRef.current
    if (!pre) return

    const page = pre.clientWidth
    if (event.key === 'ArrowLeft') pre.scrollLeft -= 48
    if (event.key === 'ArrowRight') pre.scrollLeft += 48
    if (event.key === 'PageUp') pre.scrollLeft -= page
    if (event.key === 'PageDown') pre.scrollLeft += page
    if (event.key === 'Home') pre.scrollLeft = 0
    if (event.key === 'End') pre.scrollLeft = pre.scrollWidth
    if (
      ['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(
        event.key,
      )
    ) {
      event.preventDefault()
    }
  }

  // const language = React.Children.toArray(children).reduce((lang, child) => {
  //   if (React.isValidElement(child) && child.type === 'code') {
  //     const className = child.props.className
  //     const match = className?.match(/language-([\w-]+)/)
  //     return match ? match[1] : lang // 返回匹配到的语言名
  //   }
  //   return lang
  // }, 'unknown')

  return (
    <div className='relative'>
      <pre
        {...rest}
        className={clsx('group', className)}
        id={preId}
        ref={preRef}
      >
        {/* <span className='language-style absolute right-0 text-sm'>
          {language}
        </span> */}
        {children}
        {content && <CopyButton content={content} />}
      </pre>
      {scrollbar.scrollable && (
        <div
          className='code-scrollbar'
          onPointerDown={handleTrackPointerDown}
          ref={trackRef}
          role='presentation'
        >
          <div
            aria-controls={preId}
            aria-orientation='horizontal'
            aria-valuemax={scrollbar.maxScrollLeft}
            aria-valuemin={0}
            aria-valuenow={scrollbar.scrollLeft}
            className='code-scrollbar-thumb'
            onKeyDown={handleThumbKeyDown}
            onPointerDown={handleThumbPointerDown}
            onPointerMove={handleThumbPointerMove}
            onPointerUp={handleThumbPointerUp}
            role='scrollbar'
            style={{
              left: `${scrollbar.thumbLeft}%`,
              width: `${scrollbar.thumbWidth}%`,
            }}
            tabIndex={0}
          />
        </div>
      )}
      <div className='code-block-spacing' /> {''}
    </div>
  )
}
