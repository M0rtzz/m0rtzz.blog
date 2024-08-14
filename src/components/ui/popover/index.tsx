import {
  Popover as unStyledPopover,
  Tooltip as unStyledTooltip,
} from 'react-aria-components'
import { tw } from 'tw-styled/merge'

const cls =
  'data-[entering]:animate-in data-[entering]:fade-in data-[entering]:zoom-in-95 data-[entering]:slide-in-from-top-2 data-[exiting]:animate-out data-[exiting]:fade-out data-[exiting]:zoom-out-95'

export const Popover = tw(unStyledPopover)(cls)

export const Tooltip = tw(unStyledTooltip)(cls)
