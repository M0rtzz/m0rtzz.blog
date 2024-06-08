import {
  IconAlertTriangle,
  IconBulb,
  IconInfoSquare,
  IconMessageReport,
  IconUrgent,
} from '@tabler/icons-react'
import clsx from 'clsx'

interface AlertProps {
  type: 'note' | 'tip' | 'important' | 'warning ' | 'caution'
  children: React.ReactNode
}

const icons = {
  note: IconInfoSquare,
  tip: IconBulb,
  important: IconMessageReport,
  warning: IconAlertTriangle,
  caution: IconUrgent,
}

export const Alert = (props: AlertProps) => {
  const { type, children } = props

  const Icon = icons[type]

  const textClses = {
    note: 'text-blue-500',
    tip: 'text-green-600',
    important: 'text-purple-600',
    warning: 'text-yellow-600',
    caution: 'text-red-500',
  }

  const borderClses = {
    note: 'border-blue-500',
    tip: 'border-green-600',
    important: 'border-purple-600',
    warning: 'border-yellow-600',
    caution: 'border-red-500',
  }

  const textCls = textClses[type]
  const borderCls = borderClses[type]

  return (
    <div className={clsx('not-prose mb-4 border-l-4 pl-4', borderCls)}>
      <p className={clsx('flex items-center gap-2 py-2 font-bold', textCls)}>
        <Icon className='size-5' />
        <span className='block first-letter:uppercase'>{type}</span>
      </p>
      {children}
    </div>
  )
}
