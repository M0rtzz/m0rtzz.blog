'use client'

import { useId, useRef, useState } from 'react'

import Link from 'next/link'

import { IconBeach } from '@tabler/icons-react'

import { MotionWave } from '@/components/motion-wave'

interface ExploreMoreProps {
  href: string
}
export const ExploreMore = (props: ExploreMoreProps) => {
  const { href } = props
  const [enter, setEnter] = useState(false)
  const coverageId = useId()
  const dryCoverageId = `${coverageId}-dry`
  const coverageRef = useRef<SVGPathElement>(null)
  const dryCoverageRef = useRef<SVGPathElement>(null)
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
        onCoverageChange={(path, dryPath) => {
          coverageRef.current?.setAttribute('d', path)
          if (dryPath) dryCoverageRef.current?.setAttribute('d', dryPath)
        }}
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
          <clipPath id={dryCoverageId} clipPathUnits='objectBoundingBox'>
            {/* Keep the label visible until the first wave frame supplies the
                real inverse mask. An empty path would hide the whole label. */}
            <path
              ref={dryCoverageRef}
              clipRule='nonzero'
              d='M0,0 H1 V1 H0 Z'
            />
          </clipPath>
        </defs>
      </svg>
      <Link
        className='absolute inset-0 z-10 text-lg font-semibold lg:text-2xl'
        href={href}
      >
        {/* Use explicit colors instead of a parent invert filter so the wet
            label color remains predictable in both themes. */}
        <span
          className='absolute inset-0 flex items-center justify-center gap-2 text-slate-950 dark:text-slate-50'
          style={{ clipPath: `url(#${dryCoverageId})` }}
        >
          {label}
        </span>
        <span
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-white dark:text-slate-200'
          style={{ clipPath: `url(#${coverageId})` }}
        >
          {label}
        </span>
      </Link>
    </div>
  )
}
