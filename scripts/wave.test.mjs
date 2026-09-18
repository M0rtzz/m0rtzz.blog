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

function fixture({ contextAvailable = true } = {}) {
  const frames = new Map()
  const listeners = new Set()
  let frameId = 0
  let firstY
  const ctx = {
    clearRect() {},
    beginPath() {},
    bezierCurveTo() {},
    lineTo() {},
    closePath() {},
    fill() {},
    moveTo(_x, y) {
      firstY = y
    },
  }
  const ownerDocument = {
    hidden: false,
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
  const wave = exports.createWave(canvas, {
    frequency: 0.4,
    amplitude: 30,
    speed: 4,
    offset: 50,
  })
  return {
    wave,
    frames,
    listeners,
    ctx,
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
    assertDistance(distance, amplitude = 30, offset = 50) {
      const expected = 140 + offset + amplitude * Math.sin(distance / 100)
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
      h.assertDistance((4 * 240 * frame) / fps)
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
    h.assertDistance((4 * 240 * timestamp) / 1000)
  }
  h.wave.stop()
})

test('animated speed, amplitude, offset and theme fill remain configurable', () => {
  const h = fixture()
  h.wave.start()
  h.tick(0)
  h.tick(250)
  h.assertDistance(240)
  h.wave.setConfig({ speed: 6, amplitude: 60, offset: -200 })
  h.tick(500)
  h.assertDistance(600, 60, -200)
  assert.equal(h.ctx.fillStyle, '#1e293b')
  h.wave.setConfig({ color: '#fff' })
  h.tick(750)
  h.assertDistance(960, 60, -200)
  assert.equal(h.ctx.fillStyle, '#fff')
  h.wave.stop()
})

test('returning from a hidden tab does not advance through hidden time', () => {
  const h = fixture()
  h.wave.start()
  h.tick(0)
  h.tick(250)
  h.assertDistance(240)
  h.visibility(true)
  h.tick(20000)
  h.assertDistance(240)
  h.visibility(false)
  h.tick(45000)
  h.assertDistance(240)
  h.tick(45250)
  h.assertDistance(480)
  h.wave.stop()
})

test('restart and unmount do not leak RAFs or visibility listeners', () => {
  const h = fixture()
  h.wave.start()
  h.tick(0)
  h.tick(100)
  h.assertDistance(96)
  h.wave.start()
  h.wave.start()
  assert.equal(h.frames.size, 1)
  assert.equal(h.listeners.size, 1)
  h.tick(20000)
  h.assertDistance(96)
  h.tick(20100)
  h.assertDistance(192)
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
  const waveType = Symbol('MotionWave')
  const element = (type, props) => ({ type, props })
  const modules = {
    react: {
      useState: () => [
        hovered,
        value => {
          hovered = value
        },
      ],
    },
    'react/jsx-runtime': { jsx: element, jsxs: element },
    'next/dynamic': { default: () => waveType },
    'next/link': { default: 'a' },
    '@tabler/icons-react': { IconBeach: 'svg' },
  }
  const exports = {}
  runInNewContext(component, { exports, require: name => modules[name] })
  const render = offset => {
    const wrapper = exports.ExploreMore({ href: '/posts/all' })
    const wave = wrapper.props.children.find(child => child.type === waveType)
    const { initialConfig, motionConfig } = wave.props
    assert.equal(initialConfig.speed, 3)
    assert.equal(initialConfig.frequency, 0.4)
    assert.equal(initialConfig.amplitude, 30)
    assert.deepEqual(Object.keys(motionConfig), ['offset'])
    assert.equal(motionConfig.offset.value, offset)
    assert.equal(motionConfig.offset.duration, 0.5)
    assert.equal(motionConfig.offset.loop, false)
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
    './create-wave': { createWave: () => wave },
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
  const render = hovered => {
    refIndex = effectIndex = 0
    exports.MotionWave({
      initialConfig,
      motionConfig: {
        frequency: { value: 1, duration: 8, loop: true },
        amplitude: { value: 60, loop: true },
        speed: { value: 6, loopDelay: 1, loop: true },
        offset: { value: hovered ? -200 : 50, duration: 0.5, loop: false },
      },
    })
    for (const effect of effects) {
      if (effect.changed) {
        effect.cleanup?.()
        effect.cleanup = effect.setup()
      }
    }
  }
  render(false)
  assert.equal(starts, 1)
  assert.equal(animations.length, 4)
  animations[3].options.onUpdate(25)
  render(true)
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
