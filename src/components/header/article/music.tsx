'use client'

import { useEffect, useRef, useState } from 'react'

import { IconMusic, IconMusicOff } from '@tabler/icons-react'
import { setANICursorWithGroupElement } from 'ani-cursor.js'

export const MusicToggle = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const iconRef = useRef<HTMLSpanElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRotating, setIsRotating] = useState(false)

  useEffect(() => {
    setANICursorWithGroupElement(
      [
        `div.music-container`,
        `button.music-button`,
        `div.music-container *`,
        `button.music-button *`,
      ],
      '/cursor/ani/link.ani',
    )
  }, [])

  useEffect(() => {
    if (!iconRef.current) return
    const animation = isRotating
      ? iconRef.current.animate(
          [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
          { duration: 9990, iterations: Infinity, easing: 'linear' },
        )
      : null

    return () => animation?.cancel()
  }, [isRotating])

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
        setIsPlaying(true)
        setIsRotating(true)
      } else {
        audioRef.current.pause()
        setIsPlaying(false)
        setIsRotating(false)
      }
    }
  }

  const handleMusicEnd = () => {
    setIsPlaying(false)
    setIsRotating(false)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
        setIsPlaying(true)
        setIsRotating(true)
      }
    }, 1000)
  }

  return (
    <div className='music-container flex items-center'>
      <audio ref={audioRef} src='/audio/music.mp3' onEnded={handleMusicEnd} />
      <button
        className='music-button flex size-8 shrink-0 items-center justify-center rounded p-0 outline-none transition-colors hover:bg-surface-1 pressed:bg-surface-1'
        aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        onClick={togglePlay}
        ref={buttonRef}
      >
        <span ref={iconRef} className='inline-flex'>
          {isPlaying ? (
            <IconMusic className='size-5' />
          ) : (
            <IconMusicOff className='size-5' />
          )}
        </span>
      </button>
    </div>
  )
}
