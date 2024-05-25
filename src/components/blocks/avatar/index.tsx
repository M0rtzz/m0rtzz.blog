import { AvatarImage } from '@/components/blocks/avatar/image'
import { Block } from '@/components/blocks/block'
import { Wave } from '@/components/wave'

export const Avatar = () => {
  return (
    <Block
      data-type='about'
      className='bg-gradient-to-b from-blue-300 to-blue-50 p-0 dark:from-blue-400/60'
    >
      <Wave />
      <AvatarImage />
    </Block>
  )
}
