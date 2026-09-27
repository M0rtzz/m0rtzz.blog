'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'

const headingSelector = 'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'
const anchorGap = 12
// Highlight before a heading reaches the tighter anchor-jump position.
const readingLead = 36

export function decodeHash(hash: string) {
  const id = hash.replace(/^#/, '')
  try {
    return decodeURIComponent(id)
  } catch {
    return id
  }
}

const ArticleNavigationContext = createContext<{
  activeId: string
  navigate: (href: string) => boolean
}>({
  activeId: '',
  navigate: () => false,
})

export const useArticleNavigation = () => useContext(ArticleNavigationContext)

export function ArticleNavigation({
  ready,
  contentRef,
  children,
}: {
  ready: boolean
  contentRef: RefObject<HTMLDivElement>
  children: ReactNode
}) {
  const [activeId, setActiveId] = useState('')
  const navigateRef = useRef<(href: string) => boolean>(() => false)
  const navigate = useCallback((href: string) => navigateRef.current(href), [])

  useEffect(() => {
    const content = contentRef.current
    const article = content?.querySelector<HTMLElement>('.article-content')
    if (!ready || !content || !article) return

    const header = document.querySelector<HTMLElement>('[data-article-header]')
    let offset = anchorGap
    let headings: { element: HTMLElement; top: number }[] = []
    let frame = 0
    let hashFrame = 0
    let scrollTimeout = 0
    let layoutChanged = true
    let anchoredHeading: HTMLElement | null = null
    let pendingScroll: { id: string; top: number } | null = null
    let currentId = ''
    let previousScrollY = window.scrollY

    const measure = () => {
      offset = (header?.getBoundingClientRect().height ?? 0) + anchorGap
      content.style.setProperty('--article-anchor-offset', `${offset}px`)
      headings = Array.from(
        article.querySelectorAll<HTMLElement>(headingSelector),
      )
        .filter(element => element.getClientRects().length > 0)
        .map(element => ({
          element,
          top: element.getBoundingClientRect().top + window.scrollY,
        }))
    }

    const selectHeading = (id: string) => {
      currentId = id
      setActiveId(id)
    }

    const updateActive = () => {
      const scrollingDown = window.scrollY > previousScrollY
      const scrollingUp = window.scrollY < previousScrollY
      previousScrollY = window.scrollY
      // Keep the destination branch open during a smooth jump.
      if (pendingScroll) {
        if (Math.abs(window.scrollY - pendingScroll.top) > 1) {
          selectHeading(pendingScroll.id)
          return
        }
        pendingScroll = null
      }
      // A destination near the document end may not reach the reference line.
      if (anchoredHeading) {
        selectHeading(anchoredHeading.id)
        return
      }

      const currentIndex = headings.findIndex(
        heading => heading.element.id === currentId,
      )
      let index = currentIndex
      if (currentIndex < 0 || scrollingDown) {
        const reference = window.scrollY + offset + readingLead + 1
        index = Math.max(0, currentIndex)
        for (let candidate = 0; candidate < headings.length; candidate++) {
          if (headings[candidate].top > reference) break
          index = Math.max(index, candidate)
        }
      } else if (scrollingUp) {
        // Going back must be triggered by the preceding heading itself reaching
        // the header gap, not by the current child moving away from that gap.
        const reference = window.scrollY + offset - 1
        while (index > 0 && headings[index - 1].top >= reference) index--
      }
      selectHeading(headings[index]?.element.id ?? '')
    }

    const alignAnchor = (behavior: ScrollBehavior) => {
      if (!anchoredHeading) return
      const top = Math.max(
        0,
        Math.min(
          anchoredHeading.getBoundingClientRect().top + window.scrollY - offset,
          document.documentElement.scrollHeight - window.innerHeight,
        ),
      )
      window.clearTimeout(scrollTimeout)
      pendingScroll = { id: anchoredHeading.id, top }
      window.scrollTo({ top, behavior })
      updateActive()
      // Fallback for browsers without scrollend, or interrupted smooth scrolls.
      scrollTimeout = window.setTimeout(finishScroll, 1500)
    }

    const update = () => {
      frame = 0
      if (layoutChanged) {
        layoutChanged = false
        measure()
        // Late image/font/header resizing must not invalidate a deep link.
        // Stop this correction as soon as the reader takes control.
        alignAnchor('instant')
      }
      updateActive()
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    function finishScroll() {
      pendingScroll = null
      window.clearTimeout(scrollTimeout)
      scheduleUpdate()
    }

    const releaseAnchor = () => {
      // An interrupted jump's destination need not have been reached yet.
      if (pendingScroll) currentId = ''
      anchoredHeading = null
      finishScroll()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'PageUp',
          'PageDown',
          'Home',
          'End',
          ' ',
        ].includes(event.key)
      ) {
        releaseAnchor()
      }
    }

    const onLayout = () => {
      layoutChanged = true
      scheduleUpdate()
    }

    const findHeading = (hash: string) => {
      const target = document.getElementById(decodeHash(hash))
      return target &&
        article.contains(target) &&
        target.matches(headingSelector)
        ? target
        : null
    }

    const alignHash = () => {
      window.cancelAnimationFrame(hashFrame)
      hashFrame = window.requestAnimationFrame(() => {
        measure()
        layoutChanged = false
        pendingScroll = null
        window.clearTimeout(scrollTimeout)
        currentId = ''
        anchoredHeading = findHeading(window.location.hash)
        alignAnchor('instant')
        updateActive()
      })
    }

    navigateRef.current = href => {
      const target = findHeading(href)
      if (!target) return false
      measure()
      anchoredHeading = target
      const hash = new URL(href, window.location.href).hash
      if (window.location.hash !== hash) {
        window.history.pushState(null, '', hash)
      }
      alignAnchor(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      )
      return true
    }

    const resizeObserver = new ResizeObserver(onLayout)
    resizeObserver.observe(article)
    if (header) resizeObserver.observe(header)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('scrollend', finishScroll)
    window.addEventListener('resize', onLayout)
    window.addEventListener('hashchange', alignHash)
    window.addEventListener('popstate', alignHash)
    window.addEventListener('wheel', releaseAnchor, { passive: true })
    window.addEventListener('touchstart', releaseAnchor, { passive: true })
    window.addEventListener('pointerdown', releaseAnchor, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    // PostReveal has restored normal layout; native hash scrolling may have
    // happened while the article still had height: 0 beneath its skeleton.
    alignHash()

    return () => {
      navigateRef.current = () => false
      resizeObserver.disconnect()
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(hashFrame)
      window.clearTimeout(scrollTimeout)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('scrollend', finishScroll)
      window.removeEventListener('resize', onLayout)
      window.removeEventListener('hashchange', alignHash)
      window.removeEventListener('popstate', alignHash)
      window.removeEventListener('wheel', releaseAnchor)
      window.removeEventListener('touchstart', releaseAnchor)
      window.removeEventListener('pointerdown', releaseAnchor)
      window.removeEventListener('keydown', onKeyDown)
      content.style.removeProperty('--article-anchor-offset')
    }
  }, [ready, contentRef])

  return (
    <ArticleNavigationContext.Provider value={{ activeId, navigate }}>
      {children}
    </ArticleNavigationContext.Provider>
  )
}
