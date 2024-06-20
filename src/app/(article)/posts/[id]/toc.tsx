'use client'

import { useRouter } from 'next/navigation'

import { TOC, type TOCProps } from 'react-markdown-toc/client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface TOCClientProps {
  toc: TOCProps['toc']
}

export function TOCClient (props: TOCClientProps) {
  const { toc } = props
  const router = useRouter()
  return (
    <TOC
      scrollAlign='center'
      throttleTime={100}
      toc={toc}
      renderList={children => (
        <CollapsibleContent className='pl-4 overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up'>
          {children}
        </CollapsibleContent>
      )}
      renderListItem={(children, open) => <Collapsible open={open}>{children}</Collapsible>}
      renderLink={(children, href, active) => (
        <CollapsibleTrigger>
          <span
            data-active={active}
            role='button'
            onClick={() => {
              router.push(href, { scroll: false })
              const id = href!.slice(1)
              const target = document.getElementById(id)
              target?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            {children}
          </span>
        </CollapsibleTrigger>
      )}
    />
  )
}
