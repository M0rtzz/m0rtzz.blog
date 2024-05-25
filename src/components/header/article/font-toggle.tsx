'use client'

import { useDeferredValue } from 'react'

import { IconTypography, IconCheck } from '@tabler/icons-react'
import { MenuTrigger } from 'react-aria-components'

import { Menu, MenuItem, Button, Popover } from '@/components/ui'
import { type FontType } from '@/context/font'
import { useFont } from '@/hooks/useFont'

export const FontToggle = () => {
  const [font, toggleFont] = useFont()
  const currentFont = useDeferredValue(font)
  return (
    <MenuTrigger>
      <Button
        className='rounded p-1.5 outline-none transition-colors hover:bg-surface-1 pressed:bg-surface-1'
        aria-label='Menu'
      >
        <IconTypography className='size-5' />
      </Button>
      <Popover placement='bottom right'>
        <Menu
          className='w-[130px]'
          onAction={font => {
            toggleFont(font as FontType)
          }}
        >
          {[
            ['Serif', 'serif'],
            ['Sans Serif', 'sans'],
          ].map(([name, font]) => (
            <MenuItem key={font} className='flex justify-between' id={font}>
              {name}
              {font === currentFont && (
                <IconCheck className='size-4 text-brand' />
              )}
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}
