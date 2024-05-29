'use client'

import React, { useState, useRef } from 'react'

type PreProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>

export const pre = (props: PreProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleCopy = async () => {
    if (preRef.current) {
      const code = preRef.current.innerText

      // 尝试使用 navigator.clipboard API
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(code)
          setIsCopied(true)
          setTimeout(() => setIsCopied(false), 2000)
        } catch (error) {
          console.error('Error copying code with navigator.clipboard:', error)
          // 如果 navigator.clipboard 失败，尝试使用 document.execCommand
          fallbackCopyTextToClipboard(code)
        }
      } else {
        // 如果 navigator.clipboard 不存在，直接使用 document.execCommand
        fallbackCopyTextToClipboard(code)
      }
    }
  }

  // 此API目前已弃用，将来可能会无法使用
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'  // 防止出现滚动条
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      // Deprecated
      const successful = document.execCommand('copy')
      if (successful) {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } else {
        console.error('Fallback: Copying text command was unsuccessful')
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err)
    }
    document.body.removeChild(textArea)
  };

  return (
    <div className="relative">
      <pre ref={preRef} {...props} />
      <button
        onClick={handleCopy}
        className="hide-btn absolute top-1.5 right-1 bg-gray-800 from-surface-1 justify-center bg-gradient-to-b to-white dark:to-white/5 py-1 px-2 rounded"
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
