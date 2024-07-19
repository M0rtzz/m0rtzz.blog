'use client'

import React, { useState, useRef } from 'react'

import { IconMusic, IconMusicOff } from '@tabler/icons-react'

export const MusicToggle = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRotating, setIsRotating] = useState(false)

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
        audioRef.current.currentTime = 0 // 重置播放时间到开头
        audioRef.current.play() // 重新播放音乐
        setIsPlaying(true)
        setIsRotating(true)
      }
    }, 1000) // 停顿1秒
  }

  return (
    <div>
      <audio ref={audioRef} src='/music/music.mp3' onEnded={handleMusicEnd} />
      <button
        className={`rounded p-1.5 outline-none transition-colors hover:bg-surface-1 pressed:bg-surface-1 ${isRotating ? 'rotate-animation' : ''}`}
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
