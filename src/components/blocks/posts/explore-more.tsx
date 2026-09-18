'use client'

import { useState } from 'react'

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
  return (
    <div
      className='absolute inset-0 overflow-clip'
      onMouseEnter={() => setEnter(true)}
      onMouseLeave={() => setEnter(false)}
    >
      <MotionWave
        width={280}
        height={280}
        className='z-0 size-full rounded-xl bg-surface-1 dark:bg-surface dark:fill-surface-1 lg:rounded-2xl xl:rounded-3xl'
        initialConfig={{
          frequency: 0.4,
          amplitude: 30,
          speed: 3,
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
      <Link
        className='absolute inset-0 z-10 flex items-center justify-center gap-2 text-lg font-semibold text-white mix-blend-difference lg:text-2xl'
        href={href}
      >
        Explore More
        <IconBeach className='size-8' />
      </Link>
    </div>
  )
}
