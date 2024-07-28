interface DetailsProps {
  children: React.ReactNode
  summary?: string
}
export const Details = (props: DetailsProps) => {
  const { children, summary } = props
  return (
    <details className='mdx-components rounded-lg bg-surface-1 p-4'>
      <summary>{summary}</summary>
      {children}
    </details>
  )
}
