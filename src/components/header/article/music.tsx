'use client'

import React, { useState, useRef } from 'react'

import { IconMusic, IconMusicOff } from '@tabler/icons-react'

export const MusicToggle = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null) // 指定 useRef 类型为 HTMLAudioElement 或 null
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (audioRef.current) {
      // 添加条件判断确保 audioRef.current 不为 null
      if (audioRef.current.paused) {
        audioRef.current.play()
        setIsPlaying(true)
      } else {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  return (
    <div>
      <audio ref={audioRef} src='/music/music.mp3' />
      <button
        className='rounded p-1.5 outline-none transition-colors hover:bg-surface-1 pressed:bg-surface-1'
        aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        onClick={togglePlay}
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
