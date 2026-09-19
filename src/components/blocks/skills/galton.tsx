'use client'
import { memo, useEffect, useRef, useState } from 'react'

import { type StaticImageData } from 'next/image'

import { IconRefresh } from '@tabler/icons-react'
import { setANICursor } from 'ani-cursor.js'
import { tw } from 'tw-styled/merge'

import { createGalton } from './create-galton'

interface GaltonProps {
  images: StaticImageData[]
}

const Pin = tw.div`absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-surface-2 shadow-sm`

export const Galton = memo<GaltonProps>(({ images }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const controller = useRef<ReturnType<typeof createGalton> | null>(null)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    if (!ref.current) return

    const animation = createGalton(
      ref.current,
      images.map(image => image.src),
      running => {
        setIsRunning(running)
        setANICursor(
          '.skills button.animation-fade-in',
          running ? '/cursor/ani/no.ani' : '/cursor/ani/arrow.ani',
        )
      },
    )
    controller.current = animation
    animation.start()
    return () => {
      controller.current = null
      animation.dispose()
    }
  }, [images])

  return (
    <>
      <button
        className='animation-fade-in absolute left-4 top-4 z-10 rounded-xl border bg-surface p-1 text-color-4 shadow'
        onClick={() => controller.current?.start()}
        disabled={isRunning}
      >
        <IconRefresh />
      </button>
      <div
        ref={ref}
        className='animation-fade-in relative origin-bottom-left opacity-0 max-sm:scale-x-[1.057] max-sm:scale-y-[1.027] sm:max-lg:scale-50 md:max-lg:scale-x-[0.643] md:max-lg:scale-y-[0.635] lg:max-xl:scale-x-[0.786] lg:max-xl:scale-y-[0.784]'
      >
        <Pin className='left-[70px] top-10' />
        <Pin className='left-[140px] top-10' />
        <Pin className='left-[210px] top-10' />
        <Pin className='left-[105px] top-28' />
        <Pin className='left-[175px] top-28' />
        <Pin className='left-[70px] top-48' />
        <Pin className='left-[140px] top-48' />
        <Pin className='left-[210px] top-48' />
        <Pin className='left-[105px] top-72' />
        <Pin className='left-[175px] top-72' />
        <Pin className='left-[70px] top-96' />
        <Pin className='left-[140px] top-96' />
        <Pin className='left-[210px] top-96' />
      </div>
    </>
  )
})

Galton.displayName = 'Galton'
