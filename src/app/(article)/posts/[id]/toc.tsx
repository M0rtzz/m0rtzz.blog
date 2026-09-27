'use client'

import { useMemo } from 'react'

import { type TOCProps } from 'react-markdown-toc/client'

import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'

import { decodeHash, useArticleNavigation } from './article-navigation'

interface TOCClientProps {
  toc: TOCProps['toc']
}

interface TOCEntry {
  id: string
  href: string
  label: string
  children: TOCEntry[]
}

interface LabelNode {
  type: string
  value?: string
  alt?: string | null
  children?: LabelNode[]
}

function labelText(node: LabelNode): string {
  return node.value ?? node.alt ?? node.children?.map(labelText).join('') ?? ''
}

function toEntries(list: TOCProps['toc'][0]['map']): TOCEntry[] {
  return (
    list?.children.flatMap(item => {
      const paragraph = item.children.find(child => child.type === 'paragraph')
      const link = paragraph?.children.find(child => child.type === 'link')
      if (!link) return []
      const nested = item.children.find(child => child.type === 'list')
      return [
        {
          id: decodeHash(link.url),
          href: link.url,
          label: labelText(link),
          children: toEntries(nested),
        },
      ]
    }) ?? []
  )
}

function containsActive(entry: TOCEntry, activeId: string): boolean {
  return (
    entry.id === activeId ||
    entry.children.some(child => containsActive(child, activeId))
  )
}

export function TOCClient({ toc }: TOCClientProps) {
  const entries = useMemo(() => toEntries(toc[0].map), [toc])
  const { activeId, navigate } = useArticleNavigation()

  const renderEntries = (items: TOCEntry[], depth = 1) =>
    items.map(entry => (
      <Collapsible
        key={entry.id}
        open={containsActive(entry, activeId)}
        asChild
      >
        <li>
          <a
            className='toc-left break-words'
            href={entry.href}
            data-toc-depth={depth}
            data-active={entry.id === activeId}
            aria-current={entry.id === activeId ? 'location' : undefined}
            onClick={event => {
              // Leave middle-click, modifier keys, and new tabs to the browser.
              if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              )
                return
              if (navigate(entry.href)) event.preventDefault()
            }}
          >
            {entry.label}
          </a>
          {entry.children.length > 0 && (
            <CollapsibleContent asChild>
              <ul
                role='list'
                className='m-0 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'
              >
                {renderEntries(entry.children, depth + 1)}
              </ul>
            </CollapsibleContent>
          )}
        </li>
      </Collapsible>
    ))

  return (
    <ul role='list' className='article-toc m-0'>
      {renderEntries(entries)}
    </ul>
  )
}
