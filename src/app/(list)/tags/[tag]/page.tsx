import { Grid } from '@/components/grid'
import { Post } from '@/components/post'
import { queryAllLabels, queryByLabel } from '@/service'

interface PageProps {
  params: { tag: string }
}

export async function generateStaticParams() {
  const { repository } = await queryAllLabels()
  const {
    labels: { nodes },
  } = repository!

  return nodes.map(node => ({ tag: encodeURIComponent(node.name) }))
}

export function generateMetadata({ params }: PageProps) {
  const { tag } = params
  return { title: `${tag} Articles` }
}

export default async function Page({ params }: PageProps) {
  const { tag } = params

  const label = decodeURIComponent(tag)

  const {
    search: { nodes },
  } = await queryByLabel(label)

  const isEmpty = nodes.length === 0

  if (isEmpty) {
    return (
      <p className='text-2xl italic'>
        Looks like our digital garden needs some more{' '}
        <span className='text-3xl'>&quot;{label}&quot;</span> seeds.
      </p>
    )
  }

  return (
    <>
      <h1 className='px-4 text-center text-4xl'>
        All about <span className='text-5xl italic'>&quot;{label}&quot;</span>
      </h1>
      <Grid>
        {nodes.map(node => (
          <Post key={node.number} node={node} />
        ))}
      </Grid>
    </>
  )
}
