import * as p2 from 'p2-es'

const SCALE = 100
const BALL_RADIUS = 25 / SCALE
const PIN_RADIUS = 8 / SCALE
const WORLD_WIDTH = 2.78
const WORLD_HEIGHT = 5.9
const FIXED_STEP = 1 / 60
const MAX_FRAME_DELTA = 0.05
const SPAWN_INTERVAL = 0.5
const IMAGE_LOAD_TIMEOUT = 15_000

function createWorld() {
  const world = new p2.World({ gravity: [0, -9.82] })
  world.sleepMode = p2.World.ISLAND_SLEEPING

  const pins = [
    [70, 40],
    [140, 40],
    [210, 40],
    [105, 112],
    [175, 112],
    [70, 192],
    [140, 192],
    [210, 192],
    [105, 288],
    [175, 288],
    [70, 384],
    [140, 384],
    [210, 384],
  ]
  for (const [x, y] of pins) {
    const pin = new p2.Body({
      mass: 0,
      position: [x / SCALE - PIN_RADIUS / 2, -y / SCALE + PIN_RADIUS / 2],
    })
    pin.addShape(new p2.Circle({ radius: PIN_RADIUS }))
    world.addBody(pin)
  }

  const bottom = new p2.Body({ mass: 0, position: [0, -WORLD_HEIGHT] })
  bottom.addShape(new p2.Plane())
  world.addBody(bottom)

  const left = new p2.Body()
  left.addShape(new p2.Plane(), [0, 0], -Math.PI / 2)
  world.addBody(left)

  const right = new p2.Body({ position: [WORLD_WIDTH, 0] })
  right.addShape(new p2.Plane(), [0, 0], Math.PI / 2)
  world.addBody(right)
  return world
}

interface Ball {
  body: p2.Body
  element: HTMLDivElement
}

function renderBall({ body, element }: Ball, exact = false) {
  const position = exact ? body.position : body.interpolatedPosition
  const angle = exact ? body.angle : body.interpolatedAngle
  const x = (position[0] - BALL_RADIUS) * SCALE
  const y = -(position[1] + BALL_RADIUS) * SCALE
  element.style.transform = `translate(${x}px, ${y}px) rotate(${(angle * 180) / Math.PI}deg)`
}

// One controller owns the image loads, physics world and animation lifecycle.
export function createGalton(
  container: HTMLElement,
  sources: readonly string[],
  onRunningChange: (running: boolean) => void,
) {
  const document = container.ownerDocument
  const pendingLoads = new Set<() => void>()
  let world: p2.World | null = null
  let balls: Ball[] = []
  let images: HTMLImageElement[] = []
  let nextImage = 0
  let spawnElapsed = 0
  let previousTimestamp: number | null = null
  let frame: number | null = null
  let ready = false
  let running = false
  let disposed = false

  function loadImage(src: string) {
    return new Promise<HTMLImageElement | null>(resolve => {
      const image = new Image()
      let settled = false
      const timeout = setTimeout(() => finish(null), IMAGE_LOAD_TIMEOUT)
      const cancel = () => finish(null)

      function finish(result: HTMLImageElement | null) {
        if (settled) return
        settled = true
        clearTimeout(timeout)
        image.onload = null
        image.onerror = null
        pendingLoads.delete(cancel)
        resolve(result)
      }

      pendingLoads.add(cancel)
      image.onload = () => finish(image)
      image.onerror = () => finish(null)
      image.src = src
    })
  }

  function cancelFrame() {
    if (frame !== null) cancelAnimationFrame(frame)
    frame = null
    previousTimestamp = null
  }

  function scheduleFrame() {
    if (!disposed && running && ready && !document.hidden && frame === null) {
      frame = requestAnimationFrame(update)
    }
  }

  function finish() {
    running = false
    cancelFrame()
    onRunningChange(false)
  }

  function spawnBall(image: HTMLImageElement) {
    const element = document.createElement('div')
    element.className =
      'skill absolute top-0 left-0 dark:bg-white dark:grayscale-[20%] flex justify-center items-center border rounded-full bg-surface animation-fade-in opacity-0 shadow-sm'
    element.style.width = `${BALL_RADIUS * SCALE * 2}px`
    element.style.height = `${BALL_RADIUS * SCALE * 2}px`
    image.style.width = `${BALL_RADIUS * SCALE * Math.sqrt(2)}px`
    image.style.height = `${BALL_RADIUS * SCALE * Math.sqrt(2)}px`
    image.style.objectFit = 'contain'
    image.draggable = false
    image.alt = 'skill-img'
    element.appendChild(image)

    const body = new p2.Body({
      mass: 1,
      position: [
        ((Math.floor(Math.random() * 3) + 1) * WORLD_WIDTH) / 4,
        BALL_RADIUS,
      ],
    })
    body.allowSleep = true
    body.sleepSpeedLimit = 1
    body.sleepTimeLimit = 1
    body.addShape(new p2.Circle({ radius: BALL_RADIUS }))
    world!.addBody(body)
    const ball = { body, element }
    // Never expose an unpositioned element at the CSS default top-left corner.
    renderBall(ball, true)
    container.appendChild(element)
    balls.push(ball)
  }

  function update(timestamp: number) {
    frame = null
    if (disposed || !running || document.hidden) {
      previousTimestamp = null
      return
    }

    // Both producers consume the same bounded, visible animation time. A long
    // stall must not leave seconds of catch-up work in p2's accumulator.
    const delta =
      previousTimestamp === null
        ? 0
        : Math.min(
            Math.max((timestamp - previousTimestamp) / 1000, 0),
            MAX_FRAME_DELTA,
          )
    previousTimestamp = timestamp
    world!.step(FIXED_STEP, delta, 5)
    spawnElapsed += delta
    if (
      nextImage === 0 ||
      (nextImage < images.length && spawnElapsed + 1e-9 >= SPAWN_INTERVAL)
    ) {
      if (nextImage > 0)
        spawnElapsed = Math.max(0, spawnElapsed - SPAWN_INTERVAL)
      spawnBall(images[nextImage++])
    }

    let allSleeping = true
    for (const ball of balls) {
      const sleeping = ball.body.sleepState === p2.Body.SLEEPING
      // Commit the final physical position even on the frame a ball falls asleep.
      renderBall(ball, sleeping)
      if (!sleeping) allSleeping = false
    }
    if (nextImage === images.length && allSleeping) finish()
    else scheduleFrame()
  }

  function handleVisibilityChange() {
    cancelFrame()
    scheduleFrame()
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  return {
    start() {
      // This synchronous guard also covers loading and hidden/paused sessions.
      if (disposed || running) return
      running = true
      ready = false
      cancelFrame()
      for (const ball of balls) ball.element.remove()
      balls = []
      images = []
      nextImage = 0
      spawnElapsed = 0
      world?.clear()
      world = createWorld()
      onRunningChange(true)

      void Promise.all(sources.map(loadImage)).then(loaded => {
        if (disposed) return
        images = loaded.filter(
          (image): image is HTMLImageElement => image !== null,
        )
        ready = true
        if (images.length === 0) finish()
        else scheduleFrame()
      })
    },
    dispose() {
      if (disposed) return
      disposed = true
      running = false
      cancelFrame()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      for (const cancel of pendingLoads) cancel()
      for (const ball of balls) ball.element.remove()
      balls = []
      images = []
      world?.clear()
      world = null
    },
  }
}
