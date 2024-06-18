'use client'

import { useRouter } from 'next/navigation';

import { type Result } from 'mdast-util-toc'
import { TOC } from 'react-markdown-toc/client'

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'

interface CustomTOCProps {
  tocData: [Result, Map<string, string>]
}

function CustomTOC({ tocData }: CustomTOCProps) {
  const router = useRouter();

  return (
    <TOC
      toc={tocData}
      scrollAlign="center"
      renderList={(children) => (
        <CollapsibleContent className='pl-4 overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up'>
          {children}
        </CollapsibleContent>
      )}
      renderListItem={(children, open) => (
        <Collapsible open={open}>
          {children}
        </Collapsible>
      )}
      renderLink={(children, href, active) => (
        <CollapsibleTrigger>
          <span
            data-active={active}
            role="button"
            onClick={() => {
              router.push(href, { scroll: false });
              const target = document.querySelector(href)
              target?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            {children}
          </span>
        </CollapsibleTrigger>
      )}
    />
  );
}

export default CustomTOC