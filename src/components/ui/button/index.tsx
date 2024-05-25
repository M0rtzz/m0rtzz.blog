import { Button as unStyledButton } from 'react-aria-components'
import { withTw } from 'tw-styled'

export const Button = withTw(
  unStyledButton,
)`pressed:bg-surface-1 rounded p-1.5 outline-none transition-colors hover:bg-surface-1`
