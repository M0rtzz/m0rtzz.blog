'use client'

import React, { useState } from 'react'

import { useAutoAnimate } from '@formkit/auto-animate/react'

interface CodeGroupProps {
  'data-children-meta': string
  children: React.ReactNode
}
const CodeGroup = (props: CodeGroupProps) => {
  const { children } = props
  const childrenArray = React.Children.toArray(children)
  const metas = JSON.parse(props['data-children-meta']) as string[]
  const tabs = metas.map(meta => {
    const matches = meta.match(/\[(.+)]/)
    if (!matches) {
      throw new Error('[markdown:CodeGroup] Meta format error')
    }
    return matches[1]
  })
  if (tabs.length !== childrenArray.length) {
    throw new Error('[markdown:CodeGroup] Meta and children length mismatch')
  }

  const [index, setIndex] = useState(0)
  const [ref] = useAutoAnimate(/* optional config */)

  const current = childrenArray[index]

  return (
    <div>
      <div>
        {tabs.map((tab, index) => (
          <span key={tab} role='button' onClick={() => setIndex(index)}>
            {tab}
          </span>
        ))}
      </div>
      <div ref={ref}>{current}</div>
    </div>
  )
}

export default CodeGroup
