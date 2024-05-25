'use client'
import { useState, useRef, useEffect } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { clsx } from 'clsx'

import { staticPage, type StaticPageParams } from '@/app/static-page'
import { usePrevious } from '@/hooks/usePrevious'

const staticNav = staticPage.slice(0, -1)

export const Nav = () => {
  const { tab: currentTab } = useParams<Partial<StaticPageParams>>()
  const [pos, setPos] = useState<Record<string, [number, number]>>({})
  const ulRef = useRef<HTMLUListElement | null>(null)

  const currentSelected = currentTab ?? 'all'
  const currentPos = pos[currentSelected]

  const prevPos = usePrevious(currentPos)

  useEffect(() => {
    if (!ulRef.current) return
    const tabs = ulRef.current.querySelectorAll<HTMLLIElement>('[data-name]')

    const calcTabSize = () => {
      const pos = Array.from(tabs).reduce(
        (pre, cur) => {
          const name = cur.dataset.name!
          pre[name] = [cur.offsetLeft, cur.offsetWidth]
          return pre
        },
        {} as typeof pos,
      )
      setPos(pos)
    }
    calcTabSize()

    const resizeObserver = new ResizeObserver(calcTabSize)
    resizeObserver.observe(ulRef.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const hidden = !currentPos
  const [left, width] = currentPos ?? prevPos ?? []

  return (
    <nav className='relative justify-self-center rounded-full bg-surface-2 p-1.5 shadow-inner dark:bg-surface-1'>
      <div
        className={clsx(
          'absolute inset-y-1.5 left-1.5 rounded-full bg-surface shadow-sm transition-[opacity,transform] duration-1000 ease-out dark:bg-surface-2',
          hidden ? 'opacity-0' : 'opacity-100',
        )}
        style={{
          width,
          transform: `translateX(${left}px)`,
        }}
      />
      <ul ref={ulRef} className='relative z-10 flex text-sm font-semibold'>
        {staticNav.map((name, index) => {
          const tab = name.toLowerCase()
          const linkUrl = tab === 'all' ? '' : tab
          return (
            <li
              key={`${name}-${index}`}
              className={clsx(
                'px-2.5 py-1 transition-colors duration-1000 ease-out sm:px-4',
                tab === currentSelected ? 'text-brand' : 'text-color-3',
              )}
              aria-label={tab}
              data-name={tab}
            >
              <Link prefetch href={`/${linkUrl}`}>
                {name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
