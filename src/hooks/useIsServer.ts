import { useSyncExternalStore } from 'react'

export const useIsServer = () =>
  useSyncExternalStore(
    () => () => {},
    () => false,
    () => true,
  )
