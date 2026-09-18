// Adapted from motion-wave 0.0.5 by ZHANGYU. See LICENSE in this directory.

// Use 240 Hz as the speed reference, not a limit of 240 draws per second.
export const WAVE_REFERENCE_FPS = 240

export interface WaveConfig {
  frequency: number
  amplitude: number
  phase?: number
  speed?: number
  offset?: number
  color?: string
}

export function createWave(canvas: HTMLCanvasElement, config: WaveConfig) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const waveConfig = { ...config }
  let distance = 0
  let previousTimestamp: number | null = null
  let frame: number | null = null

  function resetClock() {
    previousTimestamp = null
  }

  const draw = (timestamp?: number) => {
    const {
      frequency,
      amplitude,
      phase = 0,
      speed = 1,
      offset = 0,
      color,
    } = waveConfig

    if (canvas.ownerDocument.hidden) {
      resetClock()
    } else {
      if (previousTimestamp !== null && timestamp !== undefined) {
        const elapsed = Math.max(0, timestamp - previousTimestamp)
        distance += (speed * WAVE_REFERENCE_FPS * elapsed) / 1000
      }
      previousTimestamp = timestamp ?? null
    }

    const { width, height } = canvas
    const offsetY = height / 2 + offset
    const calcY = (x: number) =>
      offsetY +
      amplitude *
        Math.sin((2 * Math.PI * frequency * x) / 1000 + distance / 100 + phase)
    const step = Math.max(1, Math.min(width / 80 / frequency, width))

    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()
    ctx.moveTo(0, calcY(0))
    let lastX = 0
    for (let x = step; x < width; x += step) {
      const cp1X = lastX + (x - lastX) / 3
      const cp2X = x + (x - lastX) / 3
      ctx.bezierCurveTo(cp1X, calcY(cp1X), cp2X, calcY(cp2X), x, calcY(x))
      lastX = x
    }
    const cp1X = lastX + (width - lastX) / 3
    const cp2X = width - (width - lastX) / 3
    ctx.bezierCurveTo(cp1X, calcY(cp1X), cp2X, calcY(cp2X), width, calcY(width))
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fillStyle = color ?? getComputedStyle(canvas).fill
    ctx.fill()
    frame = requestAnimationFrame(draw)
  }

  function stop() {
    if (frame !== null) cancelAnimationFrame(frame)
    frame = null
    resetClock()
    canvas.ownerDocument.removeEventListener('visibilitychange', resetClock)
  }

  return {
    start() {
      stop()
      canvas.ownerDocument.addEventListener('visibilitychange', resetClock)
      draw()
    },
    stop,
    setConfig(next: Partial<WaveConfig>) {
      Object.assign(waveConfig, next)
    },
    currentConfig: waveConfig,
  }
}
