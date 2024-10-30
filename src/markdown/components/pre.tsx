import React from 'react'

import { clsx } from 'clsx'

import { CopyButton } from './copy-button'

interface PreProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLPreElement>,
    HTMLPreElement
  > {
  content?: string
}

export const Pre = (props: PreProps) => {
  const { className, content, children, ...rest } = props

  // const language = React.Children.toArray(children).reduce((lang, child) => {
  //   if (React.isValidElement(child) && child.type === 'code') {
  //     const className = child.props.className
  //     const match = className?.match(/language-([\w-]+)/)
  //     return match ? match[1] : lang // 返回匹配到的语言名
  //   }
  //   return lang
  // }, 'unknown')

  return (
    <div className='relative'>
      <pre {...rest} className={clsx('group', className)}>
        {/* <span className='language-style absolute right-0 text-sm'>
          {language}
        </span> */}
        {children}
        {content && <CopyButton content={content} />}
      </pre>
      <div className='code-block-spacing' /> {''}
    </div>
  )
}
