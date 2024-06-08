interface DetailsProps {
  summary?: string
  children: React.ReactNode
}
export const Details = (props: DetailsProps) => {
  const { summary } = props
  return (
    <details className='mdx-components rounded-lg bg-surface-1 p-4'>
      <summary>{summary}</summary>
    </details>
  )
}
