import { IconArrowUpRight } from '@tabler/icons-react'
import { clsx } from 'clsx'

type ExternalLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'children'
>
export const ExternalLink = (props: ExternalLinkProps) => {
  const { title, className, ...rest } = props

  return (
    <a
      title={title}
      className={clsx(
        'absolute bottom-3 left-3 flex translate-y-2 items-center rounded-full bg-surface px-2 py-1 text-color-1 opacity-0 shadow outline-offset-4 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 xl:bottom-6 xl:left-6 xl:px-3 xl:py-2',
        className,
      )}
      {...rest}
    >
      {title && <span className='mr-1 text-xs'>{title}</span>}
      <IconArrowUpRight className='size-4' />
    </a>
  )
}
