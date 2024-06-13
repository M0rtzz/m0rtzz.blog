'use client'

import React, { useState } from 'react'

import { IconCheck, IconCopy } from '@tabler/icons-react'
import { clsx } from 'clsx'

interface CopyButtonProps {
  content: string
}

export const CopyButton = (props: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    let code = props.content // 使用 props.content 而不是从 DOM 获取
    if (code) {
      code = code.trimEnd()
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
    textArea.style.position = 'fixed' // 防止出现滚动条
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
  }

  const Icon = isCopied ? IconCheck : IconCopy

  return (
    <button
      className={clsx(
        'copy-button absolute -right-0 top-2 hidden rounded bg-gradient-to-b to-white p-2 hover:bg-color-1/10 group-hover:block dark:to-white/5',
        isCopied
          ? '!block bg-gray-800 bg-gradient-to-b from-surface-1 to-white text-green-500 '
          : 'text-gray-500',
      )}
      onClick={() => void handleCopy()}
    >
      {isCopied && (
        <span className='absolute-small absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 rounded bg-gray-800 bg-gradient-to-b from-surface-1 to-white px-2 py-1 text-gray-500 dark:to-white/5 '>
          Copied!
        </span>
      )}
      <Icon className='size-4' />
    </button>
  )
}
