import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'

import ts from 'typescript'

const source = await readFile(
  new URL('../src/components/motion-wave/create-wave.ts', import.meta.url),
  'utf8',
)
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText

function fixture({
  contextAvailable = true,
  pixelRatio = 1,
  trackCoverage = false,
} = {}) {
  const frames = new Map()
  const listeners = new Set()
  let frameId = 0
  let firstY
  let path = []
  const paths = []
  const ctx = {
    clearRect() {
      paths.length = 0
    },
    setTransform(...transform) {
      this.transform = transform
    },
    beginPath() {
      path = []
    },
    lineTo(x, y) {
      path.push([x, y])
    },
    closePath() {},
    fill() {
      paths.push({
        points: path,
        opacity: this.globalAlpha,
        color: this.fillStyle,
      })
    },
    moveTo(x, y) {
      firstY = y
      path.push([x, y])
    },
  }
  const ownerDocument = {
    hidden: false,
    defaultView: { devicePixelRatio: pixelRatio },
    addEventListener(name, callback) {
      assert.equal(name, 'visibilitychange')
      listeners.add(callback)
    },
    removeEventListener(name, callback) {
      assert.equal(name, 'visibilitychange')
      listeners.delete(callback)
    },
  }
  const canvas = {
    width: 280,
    height: 280,
    ownerDocument,
    getContext: () => (contextAvailable ? ctx : null),
  }
  const exports = {}
  runInNewContext(compiled, {
    exports,
    requestAnimationFrame(callback) {
      frames.set(++frameId, callback)
      return frameId
    },
    cancelAnimationFrame: id => frames.delete(id),
    getComputedStyle: () => ({ fill: '#1e293b' }),
  })
  const coverage = []
  const dryCoverage = []
  const onCoverageChange = trackCoverage
    ? (path, dryPath) => {
        coverage.push(path)
        dryCoverage.push(dryPath)
      }
    : undefined
  const wave = exports.createWave(
    canvas,
    { frequency: 0.4, amplitude: 30, speed: 4, offset: 50 },
    onCoverageChange,
  )
  return {
    wave,
    frames,
    listeners,
    ctx,
    canvas,
    paths,
    coverage,
    dryCoverage,
    recreate: () =>
      exports.createWave(canvas, wave.currentConfig, onCoverageChange),
    tick(timestamp) {
      assert.equal(frames.size, 1, 'exactly one wave animation loop')
      const pending = [...frames.values()]
      frames.clear()
      pending.forEach(callback => callback(timestamp))
    },
    visibility(hidden) {
      ownerDocument.hidden = hidden
      listeners.forEach(callback => callback())
    },
    assertDistance(distance, seconds, amplitude = 30, offset = 50) {
      const motion = exports.getLayerMotion(seconds, 2)
      const expected =
        140 +
        offset +
        amplitude * motion.heave +
        exports.sampleWave(0, distance / 100, {
          ...wave.currentConfig,
          amplitude: amplitude * motion.amplitudeScale,
        })
      assert.ok(Math.abs(firstY - expected) < 1e-8, `${firstY} != ${expected}`)
    },
  }
}

for (const fps of [30, 60, 90, 120, 144, 165, 240]) {
  test(`${fps} Hz keeps the configured 240 Hz reference speed`, () => {
    const h = fixture()
    h.wave.start()
    h.tick(0)
    for (let frame = 1; frame <= fps; frame++) {
      h.tick((frame * 1000) / fps)
      h.assertDistance((4 * 240 * frame) / fps, frame / fps)
    }
    h.wave.stop()
    assert.equal(h.frames.size, 0)
    assert.equal(h.listeners.size, 0)
  })
}

test('irregular frame intervals and dropped frames do not slow the wave', () => {
  const h = fixture()
  h.wave.start()
  for (const timestamp of [0, 8, 26, 57, 100, 180, 430, 500, 740, 1000]) {
    h.tick(timestamp)
    h.assertDistance((4 * 240 * timestamp) / 1000, timestamp / 1000)
  }
  h.wave.stop()
})

test('animated speed, amplitude, offset and theme fill remain configurable', () => {
  const h = fixture()
  h.wave.start()
  h.tick(0)
  h.tick(250)
  h.assertDistance(240, 0.25)
  h.wave.setConfig({ speed: 6, amplitude: 60, offset: -200 })
  h.tick(500)
  h.assertDistance(600, 0.5, 60, -200)
  assert.equal(h.ctx.fillStyle, '#1e293b')
  h.wave.setConfig({ color: '#fff' })
  h.tick(750)
  h.assertDistance(960, 0.75, 60, -200)
  assert.equal(h.ctx.fillStyle, '#fff')
  h.wave.stop()
})

test('returning from a hidden tab does not advance through hidden time', () => {
  const h = fixture()
  h.wave.start()
  h.tick(0)
  h.tick(250)
  h.assertDistance(240, 0.25)
  h.visibility(true)
  h.tick(20000)
  h.assertDistance(240, 0.25)
  h.visibility(false)
  h.tick(45000)
  h.assertDistance(240, 0.25)
  h.tick(45250)
  h.assertDistance(480, 0.5)
  h.wave.stop()
})

test('restart and unmount do not leak RAFs or visibility listeners', () => {
  const h = fixture()
  h.wave.start()
  h.tick(0)
  h.tick(100)
  h.assertDistance(96, 0.1)
  h.wave.start()
  h.wave.start()
  assert.equal(h.frames.size, 1)
  assert.equal(h.listeners.size, 1)
  h.tick(20000)
  h.assertDistance(96, 0.1)
  h.tick(20100)
  h.assertDistance(192, 0.2)
  h.wave.stop()
  h.wave.stop()
  assert.equal(h.frames.size, 0)
  assert.equal(h.listeners.size, 0)
})

test('a missing canvas context does not start an animation', () => {
  const h = fixture({ contextAvailable: false })
  assert.equal(h.wave, null)
  assert.equal(h.frames.size, 0)
  assert.equal(h.listeners.size, 0)
})

const geometry = {}
runInNewContext(compiled, { exports: geometry })
const surface = { frequency: 3, amplitude: 40, speed: 1, offset: 50 }

test('the dominant swell keeps the configured 2.4 rad/s phase speed', () => {
  const k = (2 * Math.PI * surface.frequency) / 1000
  // Over 20 wavelengths the secondary 1.45x swell and 2x ripple are
  // orthogonal to the carrier. Recover its phase independently of sampleWave.
  const length = (20 * 1000) / surface.frequency
  for (const time of [0, 0.25, 0.5, 1, 3, 13]) {
    let sine = 0
    let cosine = 0
    const phase = time * 2.4
    for (let i = 0; i < 1024; i++) {
      const x = (length * i) / 1024
      const y = geometry.sampleWave(x, phase, surface)
      sine += y * Math.sin(k * x)
      cosine += y * Math.cos(k * x)
    }
    const recovered = Math.atan2(cosine, sine)
    const phaseError = Math.atan2(
      Math.sin(recovered - phase),
      Math.cos(recovered - phase),
    )
    assert.ok(Math.abs(phaseError) < 1e-10, `carrier speed changed at ${time}s`)
  }
})

test('the waterline evolves in its moving frame instead of repeating a translated sticker', () => {
  const k = (2 * Math.PI * surface.frequency) / 1000
  const phasePerSecond = (surface.speed * geometry.WAVE_REFERENCE_FPS) / 100
  const speed = phasePerSecond / k
  // A rigidly translating profile would have exactly zero difference here.
  const sample = (x, travel, time) => {
    const motion = geometry.getLayerMotion(time, 2)
    return (
      surface.amplitude * motion.heave +
      geometry.sampleWave(x, travel, {
        ...surface,
        amplitude: surface.amplitude * motion.amplitudeScale,
      })
    )
  }
  for (const time of [0.5, 1, 2, 4]) {
    const squaredChanges = Array.from({ length: 141 }, (_, i) => {
      const start = sample(i * 2, 0, 0)
      const later = sample(i * 2 - speed * time, phasePerSecond * time, time)
      return (later - start) ** 2
    })
    const rms = Math.sqrt(
      squaredChanges.reduce((a, b) => a + b, 0) / squaredChanges.length,
    )
    assert.ok(rms > 2, `visible shape evolution at ${time}s: ${rms}px`)
  }
})

test('swells stay smooth and bounded across time, without random jumps', () => {
  for (let time = 0; time <= 30; time += 0.05) {
    for (let x = 0; x <= 280; x += 10) {
      const travel = time * 2.4
      const y = geometry.sampleWave(x, travel, surface)
      assert.ok(Math.abs(y) <= 40 * 1.12 + 1e-9)
      const next = geometry.sampleWave(x, travel + 2.4 / 240, surface)
      assert.ok(Math.abs(next - y) < 2, 'no discontinuous crests at 240 Hz')
      assert.ok(
        geometry.sampleWave(x, travel, { ...surface, amplitude: 0 }) === 0,
      )
    }
  }
})

test('three themed layers have smooth, monotonic waterlines and reset canvas opacity', () => {
  const h = fixture()
  h.wave.setConfig(surface)
  h.wave.start()
  assert.deepEqual(
    h.paths.map(path => path.opacity),
    [0.28, 0.42, 1],
  )
  assert.ok(h.paths.every(path => path.color === '#1e293b'))
  for (const path of h.paths) {
    const edge = path.points.slice(0, -2)
    assert.equal(edge[0][0], 0)
    assert.equal(edge.at(-1)[0], 280)
    edge.forEach(([x, y], i) => {
      assert.ok(Number.isFinite(x) && Number.isFinite(y))
      if (i) assert.ok(x > edge[i - 1][0], 'no Bezier backtracking/hooks')
    })
  }
  assert.equal(h.ctx.globalAlpha, 1)
  h.wave.stop()
})

test('high-DPI rendering sharpens the same geometry without changing speed or scale', () => {
  const normal = fixture({ trackCoverage: true })
  const retina = fixture({ pixelRatio: 2, trackCoverage: true })
  normal.wave.start()
  retina.wave.start()
  for (const timestamp of [0, 100, 500, 1000]) {
    normal.tick(timestamp)
    retina.tick(timestamp)
    assert.deepEqual(retina.paths, normal.paths)
    assert.equal(retina.coverage.at(-1), normal.coverage.at(-1))
  }
  assert.equal(retina.canvas.width, 560)
  assert.equal(retina.canvas.height, 560)
  assert.deepEqual(retina.ctx.transform, [2, 0, 0, 2, 0, 0])
  retina.wave.start()
  assert.equal(
    retina.canvas.width,
    560,
    'restart must not multiply canvas resolution again',
  )
  normal.wave.stop()
  retina.wave.stop()
})

function coveragePolygons(path) {
  return path
    .split('Z')
    .filter(part => part.trim())
    .map(part =>
      [...part.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map(match => [
        Number(match[1]),
        Number(match[2]),
      ]),
    )
}

function containsPoint(polygon, x, y) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

test('coverage follows the exact vertices of every layer, including offset changes', () => {
  const h = fixture({ trackCoverage: true })
  h.wave.setConfig(surface)
  h.wave.start()
  for (const [time, offset] of [
    [0, 50],
    [250, -10],
    [500, -200],
    [750, 50],
  ]) {
    h.wave.setConfig({ offset })
    h.tick(time)
    const polygons = coveragePolygons(h.coverage.at(-1))
    assert.equal(polygons.length, 3, 'rear, middle and front all contribute')
    h.paths.forEach((path, layer) => {
      assert.equal(polygons[layer].length, path.points.length)
      path.points.forEach(([x, y], i) => {
        assert.ok(Math.abs(polygons[layer][i][0] - x / 280) <= 0.00000501)
        const expectedY =
          i >= path.points.length - 2
            ? 1
            : (y + geometry.WAVE_COVERAGE_EDGE_PAD) / 280
        assert.ok(Math.abs(polygons[layer][i][1] - expectedY) <= 0.00000501)
      })
    })
    if (offset === -200) {
      assert.ok(polygons.every(polygon => containsPoint(polygon, 0.5, 0.5)))
    }
  }
  assert.equal(h.coverage.length, 5, 'one mask update per draw, not per layer')
  h.wave.stop()
})

test('rear-only, middle-only and front-only coverage all reach the text mask', () => {
  const h = fixture({ trackCoverage: true })
  h.wave.setConfig(surface)
  h.wave.start()
  const seen = new Set()
  for (let time = 0; time <= 12_000; time += 50) {
    h.tick(time)
    const polygons = coveragePolygons(h.coverage.at(-1))
    for (let i = 25; i < 120; i++) {
      const x = i * 2
      const heights = h.paths
        .map((path, layer) => ({ y: path.points[i][1], layer }))
        .sort((a, b) => a.y - b.y)
      const y = Math.max(
        heights[0].y + geometry.WAVE_COVERAGE_EDGE_PAD + 1,
        130,
      )
      if (y > 152 || y >= heights[1].y - 2) continue
      const coveringLayers = polygons.flatMap((polygon, layer) =>
        containsPoint(polygon, x / 280, y / 280) ? [layer] : [],
      )
      assert.deepEqual(coveringLayers, [heights[0].layer])
      seen.add(heights[0].layer)
    }
  }
  assert.deepEqual([...seen].sort(), [0, 1, 2])
  h.wave.stop()
})

test('zero horizontal speed still lets every layer heave and change its crest height', () => {
  const h = fixture()
  h.wave.setConfig({ ...surface, speed: 0 })
  h.wave.start()
  const start = structuredClone(h.paths)
  h.tick(0)
  h.tick(1000)
  for (let layer = 0; layer < 3; layer++) {
    const changes = h.paths[layer].points.slice(0, -2).map(([x, y], i) => {
      assert.equal(x, start[layer].points[i][0])
      return y - start[layer].points[i][1]
    })
    assert.ok(
      changes.some(delta => Math.abs(delta) > 4),
      `layer ${layer} visibly moves vertically`,
    )
    assert.ok(
      Math.max(...changes) - Math.min(...changes) > 2,
      `layer ${layer} changes shape, not just its offset`,
    )
  }
  h.assertDistance(0, 1, 40)
  h.wave.stop()
})

test('each layer has its own vertical rhythm and visible excursion', () => {
  const samples = Array.from({ length: 121 }, (_, i) =>
    [0, 1, 2].map(layer => geometry.getLayerMotion(i / 10, layer)),
  )
  for (let layer = 0; layer < 3; layer++) {
    const heights = samples.map(sample => sample[layer].heave * 40)
    const scales = samples.map(sample => sample[layer].amplitudeScale)
    assert.ok(
      Math.max(...heights) - Math.min(...heights) > 23,
      `layer ${layer} needs visible up/down motion`,
    )
    assert.ok(
      Math.max(...scales) - Math.min(...scales) > 0.39,
      `layer ${layer} needs crest-height variation`,
    )
    assert.ok(scales.every(scale => scale >= 0.66 && scale <= 1.06))
    for (let other = layer + 1; other < 3; other++) {
      assert.ok(
        samples.some(
          (sample, i) =>
            i > 0 &&
            (sample[layer].heave - samples[i - 1][layer].heave) *
              (sample[other].heave - samples[i - 1][other].heave) <
              0,
        ),
        `layers ${layer}/${other} must sometimes move in opposite directions`,
      )
    }
  }
})

test('backgrounding freezes and resumes the independent vertical clocks for every layer', () => {
  const h = fixture({ trackCoverage: true })
  h.wave.setConfig(surface)
  h.wave.start()
  h.tick(0)
  h.tick(750)
  const before = structuredClone(h.paths)
  const beforeCoverage = h.coverage.at(-1)
  h.visibility(true)
  h.tick(30_000)
  assert.deepEqual(h.paths, before)
  h.visibility(false)
  h.tick(60_000)
  assert.deepEqual(h.paths, before, 'no vertical phase jump on return')
  assert.equal(h.coverage.at(-1), beforeCoverage)
  h.tick(60_500)
  for (let i = 0; i < 3; i++) assert.notDeepEqual(h.paths[i], before[i])
  assert.notEqual(h.coverage.at(-1), beforeCoverage)
  h.wave.stop()
})

test('independent heave stays smooth and keeps the raised hover surface above the card', () => {
  const h = fixture()
  h.wave.setConfig({ ...surface, offset: -200 })
  h.wave.start()
  for (let time = 0; time <= 20_000; time += 50) {
    h.tick(time)
    for (const path of h.paths) {
      assert.ok(
        path.points.slice(0, -2).every(([, y]) => y < 0),
        'hover must still fully cover the card',
      )
    }
  }
  for (let time = 0; time < 10; time += 0.05) {
    for (let layer = 0; layer < 3; layer++) {
      const a = geometry.getLayerMotion(time, layer)
      const b = geometry.getLayerMotion(time + 1 / 240, layer)
      assert.ok(Math.abs(a.heave - b.heave) * 40 < 0.15)
      assert.ok(Math.abs(a.amplitudeScale - b.amplitudeScale) * 40 < 0.06)
    }
  }
  h.wave.stop()
})

test('Strict Mode recreation does not apply the pixel ratio twice', () => {
  const h = fixture({ pixelRatio: 2 })
  h.wave.start()
  const original = structuredClone(h.paths)
  h.wave.stop()
  const recreated = h.recreate()
  recreated.start()
  assert.equal(h.canvas.width, 560)
  assert.equal(h.canvas.height, 560)
  assert.deepEqual(h.paths, original)
  recreated.stop()
  assert.equal(h.frames.size, 0)
  assert.equal(h.listeners.size, 0)
})

test('Explore More keeps a fixed speed and wave shape before, during and after hover', async () => {
  const source = await readFile(
    new URL('../src/components/blocks/posts/explore-more.tsx', import.meta.url),
    'utf8',
  )
  const component = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText
  let hovered = false
  const coverageRef = {
    current: {
      setAttribute: (name, value) => {
        assert.equal(name, 'd')
        coverageRef.path = value
      },
    },
  }
  const dryCoverageRef = { current: { setAttribute() {} } }
  let refCount = 0
  const waveType = Symbol('MotionWave')
  const element = (type, props) => ({ type, props })
  const modules = {
    react: {
      useId: () => 'wave-coverage',
      useRef: () => (refCount++ === 0 ? coverageRef : dryCoverageRef),
      useState: () => [
        hovered,
        value => {
          hovered = value
        },
      ],
    },
    'react/jsx-runtime': { jsx: element, jsxs: element },
    '@/components/motion-wave': { MotionWave: waveType },
    'next/link': { default: 'a' },
    '@tabler/icons-react': { IconBeach: 'svg' },
  }
  const exports = {}
  runInNewContext(component, { exports, require: name => modules[name] })
  const render = offset => {
    refCount = 0
    const wrapper = exports.ExploreMore({ href: '/posts/all' })
    const wave = wrapper.props.children.find(child => child.type === waveType)
    const { initialConfig, motionConfig } = wave.props
    assert.equal(initialConfig.speed, 1)
    assert.equal(initialConfig.frequency, 3)
    assert.equal(initialConfig.amplitude, 40)
    assert.deepEqual(Object.keys(motionConfig), ['offset'])
    assert.equal(motionConfig.offset.value, offset)
    assert.equal(motionConfig.offset.duration, 0.5)
    assert.equal(motionConfig.offset.loop, false)
    const svg = wrapper.props.children.find(child => child.type === 'svg')
    const clips = svg.props.children.props.children
    const clip = clips[0]
    const dryClip = clips[1]
    assert.equal(clip.props.clipPathUnits, 'objectBoundingBox')
    assert.equal(clip.props.children.props.clipRule, 'nonzero')
    assert.equal(clip.props.children.props.ref, coverageRef)
    assert.equal(dryClip.props.id, 'wave-coverage-dry')
    assert.equal(dryClip.props.children.props.ref, dryCoverageRef)
    const link = wrapper.props.children.find(child => child.type === 'a')
    assert.ok(!link.props.className.includes('mix-blend'))
    assert.ok(!link.props.className.includes('invert'))
    const [normal, covered] = link.props.children
    assert.equal(normal.props['aria-hidden'], undefined)
    assert.equal(covered.props['aria-hidden'], 'true')
    assert.equal(covered.props.style.clipPath, `url(#${clip.props.id})`)
    assert.match(normal.props.className, /text-slate-950 dark:text-slate-50/)
    assert.match(covered.props.className, /text-white dark:text-slate-200/)
    assert.equal(
      normal.props.children,
      covered.props.children,
      'same text and icon',
    )
    wave.props.onCoverageChange('M0,0 L1,0 L1,1 L0,1 Z')
    assert.equal(coverageRef.path, 'M0,0 L1,0 L1,1 L0,1 Z')
    return wrapper
  }
  render(50).props.onMouseEnter()
  render(-200).props.onMouseLeave()
  render(50)
})

test('hover changes only offset, and effect cleanup stops all motions', async () => {
  const componentSource = await readFile(
    new URL('../src/components/motion-wave/index.tsx', import.meta.url),
    'utf8',
  )
  const component = ts.transpileModule(componentSource, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText
  // Exercise the real component's effect bodies with controlled hooks/tweens.
  const refs = [],
    effects = [],
    animations = []
  let refIndex = 0,
    effectIndex = 0,
    starts = 0,
    stops = 0
  const initialConfig = { frequency: 0.4, amplitude: 30, speed: 4, offset: 50 }
  const wave = {
    currentConfig: { ...initialConfig },
    start() {
      starts++
    },
    stop() {
      stops++
    },
    setConfig(config) {
      Object.assign(this.currentConfig, config)
    },
  }
  let reportCoverage
  const modules = {
    react: {
      useRef(value) {
        return (refs[refIndex++] ??= { current: value })
      },
      useEffect(setup, dependencies) {
        const index = effectIndex++
        const previous = effects[index]
        const changed =
          !previous ||
          dependencies.some(
            (value, i) => !Object.is(value, previous.dependencies[i]),
          )
        effects[index] = { ...previous, setup, dependencies, changed }
      },
    },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) },
    './create-wave': {
      createWave: (_canvas, _config, callback) => {
        reportCoverage = callback
        return wave
      },
    },
    'from-to.js': {
      animate(from, to, options) {
        const animation = { from, to, options, stopped: false }
        animations.push(animation)
        return {
          stop() {
            animation.stopped = true
          },
        }
      },
    },
  }
  const exports = {}
  runInNewContext(component, { exports, require: name => modules[name] })
  const notifications = []
  const render = hovered => {
    refIndex = effectIndex = 0
    const canvas = exports.MotionWave({
      initialConfig,
      onCoverageChange: path => notifications.push({ hovered, path }),
      motionConfig: {
        frequency: { value: 1, duration: 8, loop: true },
        amplitude: { value: 60, loop: true },
        speed: { value: 6, loopDelay: 1, loop: true },
        offset: { value: hovered ? -200 : 50, duration: 0.5, loop: false },
      },
    })
    assert.equal(
      canvas.props.onCoverageChange,
      undefined,
      'no custom DOM attribute',
    )
    for (const effect of effects) {
      if (effect.changed) {
        effect.cleanup?.()
        effect.cleanup = effect.setup()
      }
    }
  }
  render(false)
  reportCoverage('before hover')
  assert.equal(starts, 1)
  assert.equal(animations.length, 4)
  animations[3].options.onUpdate(25)
  render(true)
  reportCoverage('after hover')
  assert.deepEqual(
    notifications,
    [
      { hovered: false, path: 'before hover' },
      { hovered: true, path: 'after hover' },
    ],
    'the running renderer uses the latest listener without restarting',
  )
  assert.equal(starts, 1)
  assert.equal(animations.length, 5)
  assert.ok(animations.slice(0, 3).every(animation => !animation.stopped))
  assert.equal(animations[3].stopped, true)
  assert.equal(animations[4].from, 25)
  assert.equal(animations[4].to, -200)
  render(false)
  assert.equal(animations.length, 6)
  assert.equal(animations[4].stopped, true)
  assert.equal(animations[5].to, 50)
  effects.forEach(effect => effect.cleanup?.())
  assert.equal(stops, 1)
  assert.ok(animations.every(animation => animation.stopped))
  // React Strict Mode replays mount effects after cleanup.
  effects.forEach(effect => {
    effect.cleanup = effect.setup()
  })
  assert.equal(starts, 2)
  assert.equal(animations.length, 10)
  effects.forEach(effect => effect.cleanup?.())
  assert.equal(stops, 2)
  assert.ok(animations.every(animation => animation.stopped))
})
