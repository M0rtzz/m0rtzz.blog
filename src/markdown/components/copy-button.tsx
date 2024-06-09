'use client'

import { useState } from 'react'

import { IconCheck, IconCopy } from '@tabler/icons-react'
import { clsx } from 'clsx'

interface CopyButtonProps {
  content: string
}

export const CopyButton = (props: CopyButtonProps) => {
  const { content } = props
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    // 移除结尾空行
    const trimmedContent = content.trim()
    await navigator.clipboard.writeText(trimmedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }
  const Icon = copied ? IconCheck : IconCopy

  return (
    <button
      className={clsx(
        'copy-button absolute -right-5 top-2 hidden rounded bg-gradient-to-b to-white p-2 hover:bg-color-1/10 group-hover:block dark:to-white/5',
        copied
          ? '!block bg-gray-800 bg-gradient-to-b from-surface-1 to-white text-green-500 '
          : 'text-gray-500',
      )}
      onClick={handleClick}
    >
      {copied && (
        <span className='absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 rounded bg-gray-800 bg-gradient-to-b from-surface-1 to-white px-2 py-1 text-gray-500 dark:to-white/5 '>
          Copied!
        </span>
      )}
      <Icon className='size-4' />
    </button>
  )
}
