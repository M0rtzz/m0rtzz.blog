import { useEffect, useRef } from 'react'

export const usePrevious = <T>(value: T) => {
  const previousValue = useRef<T>(value)
  useEffect(() => {
    previousValue.current = value
  }, [value])
  return previousValue.current
}
