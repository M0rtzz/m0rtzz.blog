'use client'

import { IconArrowBarToUp } from '@tabler/icons-react'

export const ReturnTop = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <button
            className='rounded p-1.5 outline-none transition-colors hover:bg-surface-1 pressed:bg-surface-1'
            aria-label='Menu'
            onClick={scrollToTop}
        >
            <IconArrowBarToUp className='size-5' />
        </button>
    )
}
