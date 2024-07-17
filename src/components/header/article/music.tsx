'use client'

import React, { useState, useEffect } from 'react'
import { IconMusic, IconMusicOff } from '@tabler/icons-react'

// 单例音频播放器
let audioPlayer
if (typeof window !== 'undefined') {
  audioPlayer = new Audio('/music/music.mp3')
}

export const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  useEffect(() => {
    const savedState = localStorage.getItem('musicState')
    if (savedState === 'playing') {
      setIsPlaying(true)
      setIsRotating(true)
      const savedTime = localStorage.getItem('musicCurrentTime')
      if (savedTime) {
        audioPlayer.currentTime = parseFloat(savedTime)
      }
      audioPlayer.play()
    }
  }, []) // 空数组意味着此effect只在组件挂载时运行一次

  useEffect(() => {
    // 保存状态和时间，仅在状态变化时运行
    localStorage.setItem('musicState', isPlaying ? 'playing' : 'paused')
    localStorage.setItem('musicCurrentTime', audioPlayer.currentTime.toString())
  }, [isPlaying]) // 添加isPlaying为依赖项
  const togglePlay = () => {
    if (audioPlayer.paused) {
      audioPlayer.play()
      setIsPlaying(true)
      setIsRotating(true)
    } else {
      audioPlayer.pause()
      setIsPlaying(false)
      setIsRotating(false)
    }
  }

  useEffect(() => {
    const updateTime = () => {
      localStorage.setItem(
        'musicCurrentTime',
        audioPlayer.currentTime.toString(),
      )
    }
    audioPlayer.addEventListener('timeupdate', updateTime)
    return () => {
      audioPlayer.removeEventListener('timeupdate', updateTime)
    }
  }, [])

  return (
    <div>
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
