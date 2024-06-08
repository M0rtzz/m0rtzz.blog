'use client'

import { useState, Children, isValidElement } from 'react'

import clsx from 'clsx'

interface CodeGroupProps {
  'data-children-meta': string
  children: React.ReactNode
}
const CodeGroup = (props: CodeGroupProps) => {
  const { children } = props
  const [index, setIndex] = useState(0)

  const childrenArray = Children.toArray(children)
  const fileNames = childrenArray.map(child => {
    if (isValidElement(child)) {
      const childrenArr = Children.toArray(
        child.props.children,
      ) as React.ReactElement[]

      return childrenArr[0].props['data-file']
    }
  })

  if (fileNames.length !== childrenArray.length) {
    return children
  }

  const current = childrenArray[index]

  return (
    <div className='mdx-components -mx-4 border bg-surface-1 md:-mx-8 md:rounded'>
      <header className='flex border-b px-4'>
        {fileNames.map((fileName, i) => (
          <button
            className={clsx(
              'flex items-center justify-center border-b-2 px-4 py-2',
              i === index
                ? 'border-brand text-brand'
                : 'border-transparent text-color-3',
            )}
            key={i}
            onClick={() => setIndex(i)}
          >
            {fileName}
          </button>
        ))}
      </header>
      {current}
    </div>
  )
}

export default CodeGroup
