import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'

import ts from 'typescript'

const source = await readFile(
  new URL(
    '../src/app/(article)/posts/[id]/article-navigation.tsx',
    import.meta.url,
  ),
  'utf8',
)
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
  },
}).outputText

function fixture({
  ready = true,
  hash = '',
  reducedMotion = false,
  viewportHeight = 800,
  scrollHeight = 5000,
  headingPositions = [
    ['article-title', 300],
    ['目录说明', 1200],
    ['nasmodels', 1256],
    ['nasdatasets', 2500],
    ['nasprojects', 3500],
  ],
} = {}) {
  let activeId = ''
  let nextId = 0
  let effect
  let onResize
  let disconnected = false
  const frames = new Map()
  const timers = new Map()
  const listeners = new Map()
  const styles = new Map()
  const scrolls = []
  const history = []
  const emit = (name, event = {}) => {
    for (const callback of listeners.get(name) ?? []) callback(event)
  }
  const window = {
    scrollY: 0,
    innerHeight: viewportHeight,
    location: new URL(`http://localhost:3000/posts/20${hash}`),
    history: {
      pushState(_state, _title, href) {
        window.location = new URL(href, window.location)
        history.push(window.location.hash)
      },
    },
    matchMedia: () => ({ matches: reducedMotion }),
    scrollTo(options) {
      scrolls.push(options)
      if (options.behavior !== 'smooth') {
        window.scrollY = options.top
        emit('scroll')
      }
    },
    requestAnimationFrame(callback) {
      frames.set(++nextId, callback)
      return nextId
    },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout(callback) {
      timers.set(++nextId, callback)
      return nextId
    },
    clearTimeout: id => timers.delete(id),
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set())
      listeners.get(name).add(callback)
    },
    removeEventListener: (name, callback) =>
      listeners.get(name).delete(callback),
  }
  const headings = headingPositions.map(([id, top]) => ({
    id,
    top,
    getBoundingClientRect() {
      return { top: this.top - window.scrollY, height: 32 }
    },
    getClientRects: () => [{}],
    matches: () => true,
  }))
  const header = {
    height: 51,
    getBoundingClientRect() {
      return { height: this.height }
    },
  }
  const article = {
    querySelectorAll: () => headings,
    contains: element => headings.includes(element),
  }
  const content = {
    querySelector: () => article,
    style: {
      setProperty: (key, value) => styles.set(key, value),
      removeProperty: key => styles.delete(key),
    },
  }
  const exports = {}
  runInNewContext(compiled, {
    exports,
    URL,
    window,
    document: {
      querySelector: () => header,
      getElementById: id => headings.find(heading => heading.id === id),
      documentElement: { scrollHeight },
    },
    ResizeObserver: class {
      constructor(callback) {
        onResize = callback
      }
      observe() {}
      disconnect() {
        disconnected = true
      }
    },
    require(name) {
      if (name === 'react/jsx-runtime') return { jsx: (_type, props) => props }
      assert.equal(name, 'react')
      return {
        createContext: () => ({ Provider: 'provider' }),
        useCallback: callback => callback,
        useRef: current => ({ current }),
        useState: () => [
          activeId,
          value => {
            activeId = value
          },
        ],
        useEffect: callback => {
          effect = callback
        },
      }
    },
  })
  const provider = exports.ArticleNavigation({
    ready,
    contentRef: { current: content },
  })
  const cleanup = effect()
  const flush = () => {
    for (let i = 0; frames.size; i++) {
      assert.ok(i < 20, 'animation frames settle')
      const callbacks = [...frames.values()]
      frames.clear()
      for (const callback of callbacks) callback()
    }
  }
  flush()
  return {
    get activeId() {
      return activeId
    },
    get disconnected() {
      return disconnected
    },
    window,
    header,
    headings,
    styles,
    scrolls,
    history,
    frames,
    timers,
    listeners,
    emit,
    flush,
    cleanup,
    navigate: provider.value.navigate,
    decodeHash: exports.decodeHash,
    resize() {
      onResize()
      flush()
    },
    scrollTo(top) {
      emit('wheel')
      window.scrollY = top
      emit('scroll')
      flush()
    },
    finishScroll() {
      window.scrollY = scrolls.at(-1).top
      emit('scroll')
      emit('scrollend')
      flush()
    },
  }
}

test('waits for the article to leave its skeleton before measuring or scrolling', () => {
  const page = fixture({ ready: false, hash: '#nasmodels' })
  assert.equal(page.scrolls.length, 0)
  assert.equal(page.listeners.size, 0)
  assert.equal(page.navigate('#nasmodels'), false)
})

test('deep link aligns and highlights the exact heading below the measured header', () => {
  const page = fixture({ hash: '#nasmodels' })
  assert.equal(page.window.scrollY, 1256 - 63)
  assert.equal(page.styles.get('--article-anchor-offset'), '63px')
  assert.equal(page.activeId, 'nasmodels')
  assert.equal(page.history.length, 0)
})

test('tracks the last heading to cross the reference line, including long sections', () => {
  const page = fixture()
  assert.equal(page.activeId, 'article-title')
  page.scrollTo(1256 - 63 - 2)
  assert.equal(page.activeId, '目录说明')
  page.scrollTo(1256 - 63)
  assert.equal(page.activeId, 'nasmodels')
  page.scrollTo(2300)
  assert.equal(page.activeId, 'nasmodels')
  page.scrollTo(2500 - 63)
  assert.equal(page.activeId, 'nasdatasets')
})

test('upward scrolling on posts/14 retains the current subsection until its predecessor is readable', () => {
  const page = fixture({
    viewportHeight: 900,
    scrollHeight: 19000,
    // Measured positions of the H4/H5/H6 headings on /posts/14.
    headingPositions: [
      ['与设备无关的操作系统-io-软件', 15867.046875],
      ['功能-1', 16023.046875],
      ['1设备命名与保护', 16263.046875],
      ['2提供与设备无关的块尺寸', 16671.046875],
      ['3缓冲技术', 17051.046875],
      ['4设备分配和状态跟踪', 17363.046875],
      ['5错误处理和报告', 17651.046875],
    ],
  })
  page.scrollTo(16791)
  assert.equal(page.activeId, '2提供与设备无关的块尺寸')
  for (const top of [16621, 16591, 16511, 16200]) {
    page.scrollTo(top)
    assert.equal(page.activeId, '2提供与设备无关的块尺寸')
  }
  page.scrollTo(16198)
  assert.equal(page.activeId, '1设备命名与保护')
  page.scrollTo(15958)
  assert.equal(page.activeId, '功能-1')
  page.scrollTo(15802)
  assert.equal(page.activeId, '与设备无关的操作系统-io-软件')
})

test('upward scrolling into a long previous section releases a heading once it leaves the viewport', () => {
  const page = fixture({ hash: '#nasdatasets' })
  page.scrollTo(2600)
  for (const top of [2400, 1800, 1701]) {
    page.scrollTo(top)
    assert.equal(page.activeId, 'nasdatasets')
  }
  page.scrollTo(1700)
  assert.equal(page.activeId, 'nasmodels')
})

test('small reversals and scrollend do not undo the retained highlight', () => {
  const page = fixture({ hash: '#nasmodels' })
  for (const top of [1176, 1180, 1178, 1190]) {
    page.scrollTo(top)
    assert.equal(page.activeId, 'nasmodels')
    page.emit('scrollend')
    page.flush()
    assert.equal(page.activeId, 'nasmodels')
  }
  page.scrollTo(1120)
  assert.equal(page.activeId, '目录说明')
  page.scrollTo(1140)
  assert.equal(page.activeId, '目录说明')
  page.scrollTo(1193)
  assert.equal(page.activeId, 'nasmodels')
})

test('large scroll jumps skip multiple sections without leaving a stale highlight', () => {
  const page = fixture({ hash: '#nasprojects' })
  page.scrollTo(2300)
  assert.equal(page.activeId, 'nasdatasets')
  page.scrollTo(1100)
  assert.equal(page.activeId, '目录说明')
  page.scrollTo(0)
  assert.equal(page.activeId, 'article-title')
  page.scrollTo(3600)
  assert.equal(page.activeId, 'nasprojects')
})

test('clicks keep the destination active through smooth scrolling without duplicate history', () => {
  const page = fixture()
  assert.equal(page.navigate('#nasmodels'), true)
  assert.equal(page.activeId, 'nasmodels')
  assert.equal(page.scrolls.at(-1).behavior, 'smooth')
  assert.equal(page.window.scrollY, 0)
  page.finishScroll()
  assert.equal(page.activeId, 'nasmodels')
  page.navigate('#nasmodels')
  assert.deepEqual(page.history, ['#nasmodels'])
  page.scrollTo(2300)
  assert.equal(page.activeId, 'nasmodels')
})

test('an upward TOC click overrides a retained subsection and remains exact on arrival', () => {
  const page = fixture({ hash: '#nasmodels' })
  page.scrollTo(1176)
  assert.equal(page.activeId, 'nasmodels')
  page.navigate(`#${encodeURIComponent('目录说明')}`)
  assert.equal(page.activeId, '目录说明')
  page.finishScroll()
  assert.equal(page.activeId, '目录说明')
  assert.equal(page.window.scrollY, 1200 - 63)
})

test('a deep link near the document end stays selected even if scrolling is clamped', () => {
  const page = fixture({ hash: '#nasprojects', scrollHeight: 4000 })
  assert.equal(page.window.scrollY, 3200)
  assert.equal(page.activeId, 'nasprojects')
  page.emit('scrollend')
  page.flush()
  assert.equal(page.activeId, 'nasprojects')
  page.scrollTo(3199)
  assert.equal(page.activeId, 'nasprojects')
  page.scrollTo(2435)
  assert.equal(page.activeId, 'nasdatasets')
})

test('respects reduced motion and decodes Chinese hashes safely', () => {
  const page = fixture({ reducedMotion: true })
  const hash = `#${encodeURIComponent('目录说明')}`
  assert.equal(page.navigate(hash), true)
  assert.equal(page.activeId, '目录说明')
  assert.equal(page.scrolls.at(-1).behavior, 'instant')
  assert.equal(page.decodeHash('#100%'), '100%')
  assert.equal(page.navigate('#missing'), false)
})

test('hash changes and history navigation re-align after layout is available', () => {
  const page = fixture({ hash: '#nasmodels' })
  page.window.location.hash = '#nasdatasets'
  page.emit('hashchange')
  page.flush()
  assert.equal(page.activeId, 'nasdatasets')
  assert.equal(page.window.scrollY, 2500 - 63)
  page.window.location.hash = '#nasmodels'
  page.emit('popstate')
  page.flush()
  assert.equal(page.activeId, 'nasmodels')
  assert.equal(page.window.scrollY, 1256 - 63)
})

test('an unrelated hash cancels the highlight lock of an unfinished smooth jump', () => {
  const page = fixture()
  page.navigate('#nasmodels')
  assert.equal(page.activeId, 'nasmodels')
  page.window.location.hash = '#missing'
  page.emit('hashchange')
  page.flush()
  assert.equal(page.activeId, 'article-title')
  assert.equal(page.timers.size, 0)
})

test('corrects late layout changes but stops pulling the page back after manual scrolling', () => {
  const page = fixture({ hash: '#nasmodels' })
  page.header.height = 73
  page.headings[2].top += 100
  page.resize()
  assert.equal(page.styles.get('--article-anchor-offset'), '85px')
  assert.equal(page.window.scrollY, 1356 - 85)
  page.scrollTo(2200)
  const scrollCount = page.scrolls.length
  page.headings[2].top += 100
  page.resize()
  assert.equal(page.window.scrollY, 2200)
  assert.equal(page.scrolls.length, scrollCount)
  assert.equal(page.activeId, 'nasmodels')
})

test('unmount removes observers, pending callbacks, and event handlers', () => {
  const page = fixture({ hash: '#nasmodels' })
  page.navigate('#nasdatasets')
  page.emit('resize')
  page.cleanup()
  assert.ok(page.disconnected)
  assert.equal(page.frames.size, 0)
  assert.equal(page.timers.size, 0)
  assert.equal(page.styles.size, 0)
  assert.ok(
    [...page.listeners.values()].every(callbacks => callbacks.size === 0),
  )
  assert.equal(page.navigate('#nasmodels'), false)
})
