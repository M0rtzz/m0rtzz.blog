import { Block } from '@/components/blocks/block'
import { ExternalLink } from '@/components/external-link'

export const Juejin = () => (
  <Block
    data-type='about'
    className='group flex items-center justify-center bg-gradient-to-b from-blue-200 to-white text-black dark:from-blue-300/80 dark:to-white/70'
  >
    <svg
      className='size-24 dark:grayscale-[20%] xl:size-32'
      width='1em'
      height='1em'
      viewBox='0 0 38 38'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M22.293 7.583L19.017 5l-3.422 2.699-.178.143 3.6 2.87 3.612-2.87-.336-.259zm12.415 10.018l-15.7 12.38-15.69-12.373L1 19.47l18.008 14.199 18.018-14.207-2.318-1.861zm-15.7 1.004l-8.544-6.736-2.317 1.861 10.86 8.564 10.871-8.572-2.317-1.861-8.553 6.744z'
        fill='#006CFF'
        fillRule='evenodd'
      />
    </svg>
    <ExternalLink title='掘金' href='https://juejin.cn/user/4089838986339927' />
  </Block>
)
