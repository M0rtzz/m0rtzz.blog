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

// An SVG path in objectBoundingBox coordinates, covering the union of all
// filled layers regardless of their decorative opacity.
export type WaveCoverageListener = (path: string) => void

// The dominant crest keeps the original k*x + travel phase (and speed).
// Small, non-locked swells change its silhouette instead of translating a
// repeating sine-wave sticker. All modulation is continuous and deterministic.
export function sampleWave(
  x: number,
  travel: number,
  { frequency, amplitude, phase = 0 }: WaveConfig,
) {
  const spatial = (2 * Math.PI * frequency * x) / 1000
  const crest = spatial + travel + phase
  const breathing = 1 + 0.12 * Math.sin(travel * 0.13 + phase + 1)
  const primary = 0.78 * Math.sin(crest)
  const swell = 0.16 * Math.sin(spatial * 1.45 + travel * 1.14 + phase + 0.8)
  const ripple = 0.06 * Math.sin(crest * 2 + 0.6 * Math.sin(travel * 0.19))
  return amplitude * breathing * (primary + swell + ripple)
}

const LAYERS = [
  {
    scale: 0.84,
    amplitude: 0.82,
    phase: 1.8,
    lift: 0.2,
    opacity: 0.28,
    heave: 0.4,
    heavePeriod: 3.4,
    heavePhase: 0.4,
    swellPeriod: 4.8,
    swellPhase: 1.2,
  },
  {
    scale: 1.13,
    amplitude: 0.9,
    phase: -1.1,
    lift: 0.12,
    opacity: 0.42,
    heave: 0.36,
    heavePeriod: 4.7,
    heavePhase: 2.3,
    swellPeriod: 6.1,
    swellPhase: 0.2,
  },
  {
    scale: 1,
    amplitude: 1,
    phase: 0,
    lift: 0,
    opacity: 1,
    heave: 0.3,
    heavePeriod: 5.6,
    heavePhase: 3.3,
    swellPeriod: 4.1,
    swellPhase: 2,
  },
]

// Vertical motion has its own visible-time clock, unrelated to transport speed.
// Heave raises/lowers each surface; breathing changes the height of its crests
// and troughs, so this is not just another rigid translation of the same shape.
export function getLayerMotion(seconds: number, layerIndex: number) {
  const layer = LAYERS[layerIndex]
  return {
    heave:
      layer.heave *
      Math.sin((2 * Math.PI * seconds) / layer.heavePeriod + layer.heavePhase),
    amplitudeScale:
      0.86 +
      0.2 *
        Math.sin(
          (2 * Math.PI * seconds) / layer.swellPeriod + layer.swellPhase,
        ),
  }
}

// React Strict Mode can create a second renderer on the same canvas. Remember
// which dimensions are logical vs. our backing buffer so DPR is not applied twice.
const canvasSizes = new WeakMap<
  HTMLCanvasElement,
  {
    width: number
    height: number
    backingWidth: number
    backingHeight: number
  }
>()

export function createWave(
  canvas: HTMLCanvasElement,
  config: WaveConfig,
  onCoverageChange?: WaveCoverageListener,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const waveConfig = { ...config }
  // Keep the existing 280x280 logical coordinates: higher pixel density must
  // sharpen the curves, not alter their wavelength or on-screen travel speed.
  const previousSize = canvasSizes.get(canvas)
  const width =
    previousSize?.backingWidth === canvas.width
      ? previousSize.width
      : canvas.width
  const height =
    previousSize?.backingHeight === canvas.height
      ? previousSize.height
      : canvas.height
  const size = {
    width,
    height,
    backingWidth: canvas.width,
    backingHeight: canvas.height,
  }
  canvasSizes.set(canvas, size)
  let distance = 0
  let visibleSeconds = 0
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
        visibleSeconds += elapsed / 1000
        distance += (speed * WAVE_REFERENCE_FPS * elapsed) / 1000
      }
      previousTimestamp = timestamp ?? null
    }

    const pixelRatio = Math.max(
      1,
      Math.min(canvas.ownerDocument.defaultView?.devicePixelRatio ?? 1, 3),
    )
    if (
      canvas.width !== Math.round(width * pixelRatio) ||
      canvas.height !== Math.round(height * pixelRatio)
    ) {
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
    }
    size.backingWidth = canvas.width
    size.backingHeight = canvas.height
    ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0)
    const offsetY = height / 2 + offset
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = color ?? getComputedStyle(canvas).fill
    const coverage: string[] = []
    for (const [index, layer] of LAYERS.entries()) {
      const motion = getLayerMotion(visibleSeconds, index)
      const layerConfig = {
        frequency: frequency * layer.scale,
        amplitude: amplitude * layer.amplitude * motion.amplitudeScale,
        phase: phase + layer.phase,
      }
      // Scaling k and travel together preserves the same transport velocity in
      // all layers; only the small swells change relative phase and shape.
      const calcY = (x: number) =>
        offsetY -
        amplitude * layer.lift +
        amplitude * motion.heave +
        sampleWave(x, (distance / 100) * layer.scale, layerConfig)
      ctx.globalAlpha = layer.opacity
      ctx.beginPath()
      const trace = (x: number, first = false) => {
        const y = calcY(x)
        if (first) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
        if (onCoverageChange) {
          coverage.push(
            `${first ? 'M' : 'L'}${(x / width).toFixed(5)},${(y / height).toFixed(5)}`,
          )
        }
      }
      trace(0, true)
      // Closely sampled monotonic x coordinates avoid the old Bezier control
      // point overshoot, which could introduce tiny hooks along the waterline.
      for (let x = 2; x < width; x += 2) trace(x)
      trace(width)
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fill()
      // All subpaths use the same winding: overlaps remain covered instead of
      // cancelling out. Reuse the exact canvas vertices to avoid edge drift.
      if (onCoverageChange) coverage.push('L1,1 L0,1 Z')
    }
    ctx.globalAlpha = 1
    onCoverageChange?.(coverage.join(' '))
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
