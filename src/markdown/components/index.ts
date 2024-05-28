import { lazy } from 'react'

export { Pre } from './pre'
export { Alert } from './alert'
export { Details } from './details'
export { default as Hello } from './hello'
export const CodeGroup = lazy(() => import('./code-group'))
