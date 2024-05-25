interface AlertProps {
  type: 'note' | 'tip' | 'important' | 'warning ' | 'caution'
  children: React.ReactNode
}
export const Alert = (props: AlertProps) => {
  const { type, children } = props
  return (
    <blockquote>
      <p className='first-letter:uppercase'>{type}</p>
      {children}
    </blockquote>
  )
}
