import { Logo } from './logo'
import { Nav } from './nav'
import { Setting } from './setting'

export const Header = () => {
  return (
    <header className='grid items-center max-sm:my-6 max-sm:gap-4 sm:h-36 sm:grid-cols-[1fr_auto] sm:px-16 md:grid-cols-3'>
      <Logo />
      <Nav />
      <Setting />
    </header>
  )
}
