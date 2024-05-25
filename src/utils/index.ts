import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const readingTime = (
  textLength: number,
  averageReadingSpeed = 200,
  wordsPerCharacter = 5,
) => {
  const numberOfWords = textLength / wordsPerCharacter
  return (numberOfWords / averageReadingSpeed).toFixed(1)
}

export const isServer = () => typeof window === 'undefined'

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const cn = (...classes: unknown[]) => twMerge(clsx(classes))
