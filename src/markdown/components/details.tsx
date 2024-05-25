interface DetailsProps {
  title?: string
  children: React.ReactNode
}
export const Details = (props: DetailsProps) => {
  const { title, children } = props
  return (
    <details>
      <summary>{title}</summary>
      {children}
    </details>
  )
}
