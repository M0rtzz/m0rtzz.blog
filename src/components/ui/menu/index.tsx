import {
  Menu as unstyledMenu,
  MenuItem as unstyledMenuItem,
} from 'react-aria-components'
import { withTw } from 'tw-styled'

export const Menu = withTw(
  unstyledMenu,
)`bg-surface p-2 border rounded-lg shadow-lg outline-none`
export const MenuItem = withTw(
  unstyledMenuItem,
)`px-2 py-1.5 outline-none rounded cursor-pointer hover:bg-surface-1 text-sm transition-colors`
