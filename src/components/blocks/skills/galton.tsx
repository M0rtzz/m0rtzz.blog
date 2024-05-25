'use client'
import { memo, useEffect, useRef, useState } from 'react'

import { type StaticImageData } from 'next/image'

import { IconRefresh } from '@tabler/icons-react'
import * as p2 from 'p2-es'
import { tw } from 'tw-styled'

interface GaltonProps {
  images: StaticImageData[]
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const Pin = tw.div`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-surface-2 shadow-sm`

export const Galton = memo<GaltonProps>(props => {
  const { images } = props

  const ref = useRef<HTMLDivElement | null>(null)
  const [showRestart, setShowRestart] = useState(false)

  const resetAndStart = () => {
    const clearEle = () =>
      ref.current?.querySelectorAll('.skill').forEach(ele => ele.remove())

    clearEle()
    setShowRestart(false)

    const scale = 100
    const pinRadius = 8 / scale
    const imgRadius = 25 / scale

    const worldWidth = 2.78
    const worldHeight = 5.9

    function randomPoint() {
      return (Math.floor(Math.random() * 3) + 1) * (worldWidth / 4)
    }

    const pinGrid = [
      [
        [70, 40],
        [140, 40],
        [210, 40],
      ],
      [
        [105, 112],
        [175, 112],
      ],
      [
        [70, 192],
        [140, 192],
        [210, 192],
      ],
      [
        [105, 288],
        [175, 288],
      ],
      [
        [70, 384],
        [140, 384],
        [210, 384],
      ],
    ]

    const world = new p2.World({
      gravity: [0, -9.82],
    })

    world.sleepMode = p2.World.ISLAND_SLEEPING

    const bodies: [p2.Body, HTMLElement][] = []

    const imgContainerRadius = 25
    const imgWidth = 25 * 2 * (Math.sqrt(2) / 2)

    let canceled = false

    Promise.allSettled(
      images.map(image => {
        const img = new Image()
        img.src = image.src
        return new Promise<string>(resolve => {
          img.onload = () => resolve(image.src)
        })
      }),
    ).then(async images => {
      if (canceled) return
      for (const image of images) {
        if (image.status !== 'fulfilled') return
        const container = document.createElement('div')
        const img = document.createElement('img')
        container.appendChild(img)
        container.className =
          'skill absolute top-0 left-0 dark:bg-white dark:grayscale-[20%] flex justify-center items-center border rounded-full bg-surface animation-fade-in opacity-0 shadow-sm'
        const containerWidth = imgContainerRadius * 2
        container.style.width = `${containerWidth}px`
        container.style.height = `${containerWidth}px`

        img.style.width = `${imgWidth}px`
        img.style.height = `${imgWidth}px`
        img.style.objectFit = 'contain'
        img.draggable = false
        img.alt = 'skill-img'

        img.src = image.value
        ref.current?.appendChild(container)

        const body = new p2.Body({
          mass: 1,
          position: [randomPoint(), imgRadius],
        })
        body.allowSleep = true
        body.sleepSpeedLimit = 1
        body.sleepTimeLimit = 1
        body.addShape(
          new p2.Circle({
            radius: imgRadius,
          }),
        )
        world.addBody(body)
        bodies.push([body, container])

        await sleep(500)
      }
    })

    pinGrid.forEach(row => {
      row.forEach(([x, y]) => {
        const left = x / scale
        const top = -y / scale
        const body = new p2.Body({
          mass: 0,
          position: [left - pinRadius / 2, top + pinRadius / 2],
        })
        const p = new p2.Circle({
          radius: pinRadius,
        })
        body.addShape(p)
        world.addBody(body)
      })
    })

    const bottomPlaneShape = new p2.Plane()
    const bottomPlaneBody = new p2.Body({
      mass: 0,
      position: [0, -worldHeight],
    })
    bottomPlaneBody.addShape(bottomPlaneShape)
    world.addBody(bottomPlaneBody)

    const leftPlaneShape = new p2.Plane()
    const leftPlaneBody = new p2.Body()
    leftPlaneBody.addShape(leftPlaneShape, [0, 0], -Math.PI / 2)
    world.addBody(leftPlaneBody)

    const rightPlaneBody = new p2.Body({
      position: [worldWidth, 0],
    })
    rightPlaneBody.addShape(new p2.Plane(), [0, 0], Math.PI / 2)
    world.addBody(rightPlaneBody)

    const fixedTimeStep = 1 / 60
    world.step(fixedTimeStep)

    const updateTransforms = () => {
      if (bodies.length === 0) return [false]
      return bodies.map(([body, element]) => {
        if (body.sleepState === p2.Body.SLEEPING) return true
        const x =
          (body.interpolatedPosition[0] - body.shapes[0].boundingRadius) * scale
        const y =
          -(body.interpolatedPosition[1] + body.shapes[0].boundingRadius) *
          scale
        const angle = body.interpolatedAngle * (180 / Math.PI)
        element.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`

        return false
      })
    }

    let lastTimeMilliSeconds: number
    let id: number

    function update(timeMilliSeconds: number) {
      id = requestAnimationFrame(update)
      if (lastTimeMilliSeconds) {
        const deltaTime = (timeMilliSeconds - lastTimeMilliSeconds) / 1000
        world.step(fixedTimeStep, deltaTime, 5)
        const status = updateTransforms()
        const allSleep = status.every(Boolean)
        if (allSleep) {
          cancelAnimationFrame(id)
          setShowRestart(true)
        }
      }
      lastTimeMilliSeconds = timeMilliSeconds
    }

    id = requestAnimationFrame(update)

    return () => {
      canceled = true
      clearEle()
      world.clear()
      cancelAnimationFrame(id)
    }
  }

  useEffect(() => {
    if (!ref.current) return

    return resetAndStart()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {showRestart && (
        <button
          className='animation-fade-in absolute left-4 top-4 z-10 rounded-xl border bg-surface p-1 text-color-4 opacity-0 shadow'
          onClick={resetAndStart}
        >
          <IconRefresh />
        </button>
      )}
      <div
        ref={ref}
        className='animation-fade-in relative origin-bottom-left opacity-0 max-sm:scale-x-[1.057] max-sm:scale-y-[1.027] sm:max-lg:scale-50 md:max-lg:scale-x-[0.643] md:max-lg:scale-y-[0.635] lg:max-xl:scale-x-[0.786] lg:max-xl:scale-y-[0.784]'
      >
        <Pin className='left-[70px] top-10' />
        <Pin className='left-[140px] top-10' />
        <Pin className='left-[210px] top-10' />
        <Pin className='left-[105px] top-28' />
        <Pin className='left-[175px] top-28' />
        <Pin className='left-[70px] top-48' />
        <Pin className='left-[140px] top-48' />
        <Pin className='left-[210px] top-48' />
        <Pin className='left-[105px] top-72' />
        <Pin className='left-[175px] top-72' />
        <Pin className='left-[70px] top-96' />
        <Pin className='left-[140px] top-96' />
        <Pin className='left-[210px] top-96' />
      </div>
    </>
  )
})

Galton.displayName = 'Galton'
