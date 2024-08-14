import {
  Menu as unstyledMenu,
  MenuItem as unstyledMenuItem,
} from 'react-aria-components'
import { tw } from 'tw-styled/merge'

export const Menu = tw(
  unstyledMenu,
)`rounded-lg border bg-surface p-2 shadow-lg outline-none`
export const MenuItem = tw(
  unstyledMenuItem,
)`cursor-pointer rounded px-2 py-1.5 text-sm outline-none transition-colors hover:bg-surface-1`
