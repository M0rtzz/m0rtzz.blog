import {
  Popover as unStyledPopover,
  Tooltip as unStyledTooltip,
} from 'react-aria-components'
import { withTw } from 'tw-styled'

const cls =
  'data-[entering]:animate-in data-[entering]:fade-in data-[entering]:zoom-in-95 data-[entering]:slide-in-from-top-2 data-[exiting]:animate-out data-[exiting]:fade-out data-[exiting]:zoom-out-95'

// TODO fix tw-styled type error

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const Popover = withTw(unStyledPopover)(cls)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const Tooltip = withTw(unStyledTooltip)(cls)
