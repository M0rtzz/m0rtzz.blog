'use client'

import React, { useState, useEffect, useRef } from 'react'

import { IconMusic, IconMusicOff } from '@tabler/icons-react'
import { setANICursorWithGroupElement } from "ani-cursor.js"

export const MusicToggle = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
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
      "/cursor/ani/link.ani"
    )
  }, [])

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
    <div className="music-container">
      <audio ref={audioRef} src='/audio/music.mp3' onEnded={handleMusicEnd} />
      <button
        className={`music-button rounded p-1.5 outline-none transition-colors hover:bg-surface-1 pressed:bg-surface-1`}
        style={{
          ...(isRotating ? {
            animation: 'rotate 9.99s linear infinite'
          } : {})
        }}
        aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        onClick={togglePlay}
        ref={buttonRef}
      >
        {isPlaying ? (
          <IconMusic className='size-5' />
        ) : (
          <IconMusicOff className='size-5' />
        )}
      </button>
    </div>
  )
}
