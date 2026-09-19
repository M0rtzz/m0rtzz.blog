'use client'

import { useEffect, useRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import { animate } from 'from-to.js'

import { createWave } from './create-wave'

import type { WaveConfig, WaveCoverageListener } from './create-wave'
import type { Controls, TransitionOptions } from 'from-to.js'

type MotionConfig = {
  [Key in keyof WaveConfig]?: { value: WaveConfig[Key] } & TransitionOptions
}

interface MotionWaveProps extends ComponentPropsWithoutRef<'canvas'> {
  initialConfig: WaveConfig
  motionConfig: MotionConfig
  onCoverageChange?: WaveCoverageListener
}

export function MotionWave({
  initialConfig,
  motionConfig,
  onCoverageChange,
  ...props
}: MotionWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const initialConfigRef = useRef(initialConfig)
  const coverageListenerRef = useRef(onCoverageChange)
  const waveRef = useRef<ReturnType<typeof createWave>>(null)
  const motions = useRef(
    new Map<keyof WaveConfig, { signature: string; controls: Controls }>(),
  )

  useEffect(() => {
    coverageListenerRef.current = onCoverageChange
  }, [onCoverageChange])

  const tracksCoverage = !!onCoverageChange
  useEffect(() => {
    const wave = createWave(
      canvasRef.current!,
      initialConfigRef.current,
      tracksCoverage ? path => coverageListenerRef.current?.(path) : undefined,
    )
    const activeMotions = motions.current
    waveRef.current = wave
    wave?.start()
    return () => {
      activeMotions.forEach(({ controls }) => controls.stop())
      activeMotions.clear()
      wave?.stop()
      waveRef.current = null
    }
  }, [tracksCoverage])

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
  }, [motionConfig, tracksCoverage])

  return <canvas {...props} ref={canvasRef} />
}
