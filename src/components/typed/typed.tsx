import {
  Children,
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useIsServer } from '@/hooks/useIsServer'

export type TypedChildProps = {
  children: React.ReactNode
  active?: boolean
  onRendered?: VoidFunction
}

type AutoScrollContextValue = {
  scrollToBottom: () => void
}

const AutoScrollContext = createContext<AutoScrollContextValue | null>(null)

interface AutoScrollProviderProps {
  containerRef: React.RefObject<HTMLElement | null>
  children: React.ReactNode
}

/**
 * Keep terminal output at the bottom until the reader takes control of the
 * scroll position. Programmatic scrolling is deliberately not treated as a
 * manual scroll; only actual wheel, touch, keyboard, or scrollbar movement
 * opts the reader out of follow mode.
 */
export const AutoScrollProvider = ({
  containerRef,
  children,
}: AutoScrollProviderProps) => {
  const followingRef = useRef(true)
  const scrollbarPointerRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const stopFollowing = () => {
      followingRef.current = false
    }
    const onWheel = (event: WheelEvent) => {
      if (event.deltaX !== 0 || event.deltaY !== 0) stopFollowing()
    }
    const onTouchMove = () => stopFollowing()
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        [
          'ArrowDown',
          'ArrowUp',
          'PageDown',
          'PageUp',
          'Home',
          'End',
        ].includes(event.key) || event.code === 'Space'
      ) {
        stopFollowing()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect()
      scrollbarPointerRef.current = event.clientX >= bounds.right - 16
    }
    const onPointerUp = () => {
      scrollbarPointerRef.current = false
    }
    const onScroll = () => {
      if (scrollbarPointerRef.current) stopFollowing()
    }

    container.addEventListener('wheel', onWheel, { passive: true })
    container.addEventListener('touchmove', onTouchMove, { passive: true })
    container.addEventListener('keydown', onKeyDown)
    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('pointerup', onPointerUp)
    container.addEventListener('pointercancel', onPointerUp)
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('keydown', onKeyDown)
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('pointercancel', onPointerUp)
      container.removeEventListener('scroll', onScroll)
    }
  }, [containerRef])

  const scrollToBottom = useCallback(() => {
    if (!followingRef.current) return
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [containerRef])
  const contextValue = useMemo(() => ({ scrollToBottom }), [scrollToBottom])

  return (
    <AutoScrollContext.Provider value={contextValue}>
      {children}
    </AutoScrollContext.Provider>
  )
}

export function useAutoScroll() {
  return useContext(AutoScrollContext)
}

export interface TypedProps {
  children: React.ReactElement<TypedChildProps>[]
}

export const Typed = (props: TypedProps) => {
  const { children } = props
  const isServer = useIsServer()
  const [index, setIndex] = useState(0)

  if (isServer) {
    return children
  }

  const arrayChildren = Children.toArray(children)

  const renderChildren = arrayChildren.slice(
    0,
    index + 1,
  ) as React.ReactElement<TypedChildProps>[]

  return (
    <div>
      {renderChildren.map((child, childIndex) =>
        cloneElement(child, {
          ...child.props,
          active: childIndex === index,
          onRendered() {
            setIndex(pre => pre + 1)
          },
        }),
      )}
    </div>
  )
}
