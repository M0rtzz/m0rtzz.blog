import { Button as unStyledButton } from 'react-aria-components'
import tw from 'tw-styled/merge'

export const Button = tw(
  unStyledButton,
)`rounded p-1.5 outline-none transition-colors hover:bg-surface-1 pressed:bg-surface-1`
