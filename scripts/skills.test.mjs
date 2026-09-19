import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'

import * as p2 from 'p2-es'
import ts from 'typescript'

const source = await readFile(
  new URL('../src/components/blocks/skills/create-galton.ts', import.meta.url),
  'utf8',
)
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText
const flush = async () => {
  for (let i = 0; i < 8; i++) await Promise.resolve()
}

async function fixture({
  count = 54,
  hidden = false,
  failures = [],
  stalled = [],
} = {}) {
  let now = 0
  let nextId = 0
  const frames = new Map()
  const timers = new Map()
  const listeners = new Set()
  const worlds = []
  const loads = []
  const states = []
  class Element {
    style = {}
    children = []
    ownerDocument = document
    appendChild(child) {
      if (child.className?.startsWith('skill ')) {
        assert.ok(child.style.transform, 'position is set before insertion')
        assert.doesNotMatch(child.style.transform, /NaN|Infinity/)
      }
      this.children.push(child)
      child.parent = this
    }
    remove() {
      if (!this.parent) return
      this.parent.children.splice(this.parent.children.indexOf(this), 1)
      this.parent = null
    }
  }
  const document = {
    hidden,
    createElement: () => new Element(),
    addEventListener(name, callback) {
      assert.equal(name, 'visibilitychange')
      listeners.add(callback)
    },
    removeEventListener(name, callback) {
      assert.equal(name, 'visibilitychange')
      listeners.delete(callback)
    },
  }
  const container = new Element()
  class World extends p2.World {
    deltas = []
    constructor(options) {
      super(options)
      worlds.push(this)
    }
    step(...args) {
      this.deltas.push(args[1])
      return super.step(...args)
    }
  }
  class Image extends Element {
    set src(value) {
      this.url = value
      loads.push(this)
      const index = Number(value.match(/skill-(\d+)/)[1])
      if (!stalled.includes(index)) {
        queueMicrotask(() => {
          if (failures.includes(index)) this.onerror?.()
          else this.onload?.()
        })
      }
    }
  }
  const exports = {}
  runInNewContext(compiled, {
    exports,
    require(name) {
      assert.equal(name, 'p2-es')
      return { ...p2, World }
    },
    Image,
    Math: Object.assign(Object.create(Math), { random: () => 0.5 }),
    requestAnimationFrame(callback) {
      frames.set(++nextId, callback)
      assert.equal(frames.size, 1, 'exactly one Skills RAF is scheduled')
      return nextId
    },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout(callback, delay) {
      timers.set(++nextId, { callback, due: now + delay })
      return nextId
    },
    clearTimeout: id => timers.delete(id),
  })
  const create = () =>
    exports.createGalton(
      container,
      Array.from({ length: count }, (_, index) => `/skill-${index}.svg`),
      value => states.push(value),
    )
  const animation = create()
  animation.start()
  await flush()
  function tick(timestamp) {
    now = timestamp
    for (const [id, timer] of [...timers]) {
      if (timer.due <= now) {
        timers.delete(id)
        timer.callback()
      }
    }
    const callbacks = [...frames.values()]
    frames.clear()
    callbacks.forEach(callback => callback(timestamp))
  }
  return {
    animation,
    frames,
    timers,
    listeners,
    worlds,
    loads,
    states,
    container,
    document,
    create,
    tick,
    get now() {
      return now
    },
    get bodies() {
      return worlds.at(-1).bodies.filter(body => body.type === p2.Body.DYNAMIC)
    },
    advance(milliseconds, fps = 60) {
      const end = now + milliseconds
      while (now < end - 1e-6) tick(Math.min(now + 1000 / fps, end))
    },
    visibility(value) {
      document.hidden = value
      for (const callback of listeners) callback()
    },
    assertPositioned(expected) {
      assert.equal(container.children.length, expected)
      for (const element of container.children) {
        assert.ok(element.style.transform)
        assert.doesNotMatch(element.style.transform, /NaN|Infinity/)
      }
    },
  }
}

for (const fps of [30, 60, 120, 165, 240]) {
  test(`${fps} Hz keeps the spawn interval and completes all 54 balls`, async () => {
    const h = await fixture()
    assert.equal(h.timers.size, 0, 'no independent spawn timers')
    h.tick(0)
    h.assertPositioned(1)
    h.advance(1000, fps)
    h.assertPositioned(3)
    assert.ok(Math.abs(h.worlds[0].time - 1) <= 1 / 60 + 1e-9)
    h.advance(40_000, fps)
    h.assertPositioned(54)
    assert.equal(h.frames.size, 0)
    assert.deepEqual(h.states, [true, false])
    assert.ok(h.bodies.every(body => body.sleepState === p2.Body.SLEEPING))
    h.animation.dispose()
    assert.equal(h.listeners.size, 0)
  })
}

for (const fps of [60, 120, 165, 240]) {
  test(`${fps} Hz recovers from a 12-second main-thread stall without stopping early`, async () => {
    const h = await fixture()
    h.tick(0)
    h.advance(150, fps)
    const physicsTime = h.worlds[0].time
    h.tick(h.now + 12_000)
    assert.ok(h.worlds[0].time - physicsTime <= 0.05 + 1 / 60)
    assert.ok(h.worlds[0].accumulator < 1 / 60 + 1e-9, 'no catch-up backlog')
    h.assertPositioned(1)
    h.advance(40_000, fps)
    h.assertPositioned(54)
    assert.deepEqual(h.states, [true, false])
    assert.ok(h.worlds[0].deltas.every(delta => delta >= 0 && delta <= 0.05))
    h.animation.dispose()
  })
}

test('initially hidden pages neither spawn balls nor schedule RAFs', async () => {
  const h = await fixture({ hidden: true })
  h.tick(65_000)
  h.assertPositioned(0)
  assert.equal(h.frames.size, 0)
  h.visibility(false)
  h.visibility(false)
  h.tick(90_000)
  h.assertPositioned(1)
  assert.equal(h.worlds[0].time, 0)
  h.advance(500)
  h.assertPositioned(2)
  h.animation.dispose()
})

test('backgrounding pauses both clocks and repeated restores keep only one RAF', async () => {
  const h = await fixture()
  h.tick(0)
  h.advance(250)
  const position = h.container.children[0].style.transform
  const physicsTime = h.worlds[0].time
  for (let i = 0; i < 12; i++) {
    h.visibility(true)
    assert.equal(h.frames.size, 0)
    h.tick(h.now + 65_000)
    h.assertPositioned(1)
    assert.equal(h.worlds[0].time, physicsTime)
    assert.equal(h.container.children[0].style.transform, position)
    h.visibility(false)
    h.visibility(false)
    assert.equal(h.frames.size, 1)
    h.tick(h.now + 1000)
  }
  h.advance(250)
  h.assertPositioned(2)
  assert.deepEqual(h.states, [true], 'paused sessions remain running')
  h.animation.dispose()
})

test('sleeping balls do not stop the loop while more icons remain', async () => {
  const h = await fixture({ count: 2 })
  h.tick(0)
  h.bodies[0].position[1] = -5
  h.bodies[0].sleep()
  h.tick(0)
  assert.equal(h.frames.size, 1)
  assert.match(h.container.children[0].style.transform, /475px/)
  assert.deepEqual(h.states, [true])
  h.advance(500)
  h.assertPositioned(2)
  h.animation.dispose()
})

test('a completed session stays stopped on visibility changes and replays cleanly', async () => {
  const h = await fixture({ count: 3 })
  h.tick(0)
  h.advance(30_000)
  assert.equal(h.frames.size, 0)
  h.visibility(true)
  h.visibility(false)
  assert.equal(h.frames.size, 0)
  h.animation.start()
  h.animation.start()
  await flush()
  assert.equal(h.worlds.length, 2)
  assert.equal(h.worlds[0].bodies.length, 0)
  assert.equal(h.listeners.size, 1)
  assert.equal(h.frames.size, 1)
  h.tick(h.now)
  h.assertPositioned(1)
  h.advance(30_000)
  h.assertPositioned(3)
  assert.deepEqual(h.states, [true, false, true, false])
  h.animation.dispose()
  h.animation.dispose()
  assert.equal(h.listeners.size, 0)
  assert.equal(h.timers.size, 0)
  assert.equal(h.frames.size, 0)
  h.assertPositioned(0)
})

test('dispose prevents an already queued callback from reviving the animation', async () => {
  const h = await fixture()
  const staleFrame = [...h.frames.values()][0]
  h.animation.dispose()
  staleFrame(5000)
  h.animation.start()
  assert.equal(h.frames.size, 0)
  assert.equal(h.listeners.size, 0)
  assert.equal(h.worlds.length, 1)
  h.assertPositioned(0)
  assert.deepEqual(h.states, [true], 'no state callbacks after unmount')
})

test('failed images are skipped without preventing completion', async () => {
  const h = await fixture({ count: 3, failures: [1] })
  h.tick(0)
  h.advance(30_000)
  h.assertPositioned(2)
  assert.deepEqual(
    h.container.children.map(ball => ball.children[0].url),
    ['/skill-0.svg', '/skill-2.svg'],
  )
  assert.deepEqual(h.states, [true, false])
  h.animation.dispose()
})

test('a stalled image times out instead of blocking every skill forever', async () => {
  const h = await fixture({ count: 3, stalled: [1] })
  assert.equal(h.frames.size, 0)
  h.tick(15_000)
  await flush()
  assert.equal(h.timers.size, 0)
  h.tick(15_000)
  h.advance(30_000)
  h.assertPositioned(2)
  assert.deepEqual(h.states, [true, false])
  h.animation.dispose()
})

for (const options of [{ count: 0 }, { count: 2, failures: [0, 1] }]) {
  test(`an empty usable image list finishes without RAFs (${JSON.stringify(options)})`, async () => {
    const h = await fixture(options)
    assert.equal(h.frames.size, 0)
    assert.equal(h.timers.size, 0)
    assert.deepEqual(h.states, [true, false])
    h.visibility(false)
    assert.equal(h.frames.size, 0)
    h.animation.dispose()
  })
}

test('dispose during image loading invalidates late callbacks and allows a fresh mount', async () => {
  const h = await fixture({ count: 2, stalled: [0, 1] })
  const staleLoads = h.loads.map(image => image.onload)
  h.animation.dispose()
  assert.equal(h.timers.size, 0)
  const replacement = h.create()
  replacement.start()
  staleLoads.forEach(callback => callback())
  await flush()
  assert.equal(h.frames.size, 0)
  assert.equal(h.listeners.size, 1)
  h.loads.slice(2).forEach(image => image.onload())
  await flush()
  assert.equal(h.frames.size, 1)
  h.tick(10_000)
  h.assertPositioned(1)
  assert.deepEqual(h.states, [true, true])
  replacement.dispose()
  assert.equal(h.frames.size, 0)
  assert.equal(h.timers.size, 0)
  assert.equal(h.listeners.size, 0)
})
