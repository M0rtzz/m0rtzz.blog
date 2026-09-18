'use client'

import { useEffect, useRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import { animate } from 'from-to.js'

import { createWave } from './create-wave'

import type { WaveConfig } from './create-wave'
import type { Controls, TransitionOptions } from 'from-to.js'

type MotionConfig = {
  [Key in keyof WaveConfig]?: { value: WaveConfig[Key] } & TransitionOptions
}

interface MotionWaveProps extends ComponentPropsWithoutRef<'canvas'> {
  initialConfig: WaveConfig
  motionConfig: MotionConfig
}

export function MotionWave({
  initialConfig,
  motionConfig,
  ...props
}: MotionWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const initialConfigRef = useRef(initialConfig)
  const waveRef = useRef<ReturnType<typeof createWave>>(null)
  const motions = useRef(
    new Map<keyof WaveConfig, { signature: string; controls: Controls }>(),
  )

  useEffect(() => {
    const wave = createWave(canvasRef.current!, initialConfigRef.current)
    const activeMotions = motions.current
    waveRef.current = wave
    wave?.start()
    return () => {
      activeMotions.forEach(({ controls }) => controls.stop())
      activeMotions.clear()
      wave?.stop()
      waveRef.current = null
    }
  }, [])

  useEffect(() => {
    const wave = waveRef.current
    if (!wave) return
    for (const key of Object.keys(motionConfig) as (keyof WaveConfig)[]) {
      const config = motionConfig[key]
      if (!config) continue
      const signature = JSON.stringify(config)
      const previous = motions.current.get(key)
      // Hover updates only the offset; do not restart the other looping motions.
      if (previous?.signature === signature) continue
      previous?.controls.stop()
      const { value, ...options } = config
      const controls = animate(wave.currentConfig[key] ?? value, value, {
        ...options,
        onUpdate: latest => wave.setConfig({ [key]: latest }),
      })
      motions.current.set(key, { signature, controls })
    }
  }, [motionConfig])

  return <canvas {...props} ref={canvasRef} />
}
