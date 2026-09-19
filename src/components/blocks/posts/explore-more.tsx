'use client'

import { useId, useRef, useState } from 'react'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { IconBeach } from '@tabler/icons-react'

const MotionWave = dynamic(
  () => import('@/components/motion-wave').then(module => module.MotionWave),
  { ssr: false },
)

interface ExploreMoreProps {
  href: string
}
export const ExploreMore = (props: ExploreMoreProps) => {
  const { href } = props
  const [enter, setEnter] = useState(false)
  const coverageId = useId()
  const coverageRef = useRef<SVGPathElement>(null)
  const label = (
    <>
      Explore More
      <IconBeach aria-hidden='true' className='size-8' />
    </>
  )
  return (
    <div
      className='absolute inset-0 overflow-clip'
      onMouseEnter={() => setEnter(true)}
      onMouseLeave={() => setEnter(false)}
    >
      <MotionWave
        width={280}
        height={280}
        onCoverageChange={path => coverageRef.current?.setAttribute('d', path)}
        className='z-0 size-full rounded-xl bg-surface-1 dark:bg-surface dark:fill-surface-1 lg:rounded-2xl xl:rounded-3xl'
        initialConfig={{
          frequency: 3,
          amplitude: 40,
          speed: 1,
          offset: 50,
        }}
        motionConfig={{
          offset: {
            value: enter ? -200 : 50,
            loop: false,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          },
        }}
      />
      <svg aria-hidden='true' className='pointer-events-none absolute size-0'>
        <defs>
          <clipPath id={coverageId} clipPathUnits='objectBoundingBox'>
            <path ref={coverageRef} clipRule='nonzero' />
          </clipPath>
        </defs>
      </svg>
      <Link
        className='absolute inset-0 z-10 text-lg font-semibold invert lg:text-2xl'
        href={href}
      >
        {/* Keep the original inverted dry/wet colors, but use geometry rather
            than alpha blending so even a translucent rear wave changes text. */}
        <span className='absolute inset-0 flex items-center justify-center gap-2 text-surface-1 dark:text-surface'>
          {label}
        </span>
        <span
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-black dark:text-surface-1'
          style={{ clipPath: `url(#${coverageId})` }}
        >
          {label}
        </span>
      </Link>
    </div>
  )
}
