import { Popover as unStyledPopover } from 'react-aria-components'
import { withTw } from 'tw-styled'

export const Popover = withTw(
  unStyledPopover,
)`data-[entering]:animate-in data-[entering]:fade-in data-[entering]:zoom-in-95 data-[entering]:slide-in-from-top-2 data-[exiting]:animate-out data-[exiting]:fade-out data-[exiting]:zoom-out-95`
