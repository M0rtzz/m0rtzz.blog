import { Grid } from '@/components/grid'
import { Post } from '@/components/post'
import { queryAllPosts } from '@/service'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Posts',
}

export default async function Page() {
  const {
    search: { nodes },
  } = await queryAllPosts()

  return (
    <Grid>
      {nodes.map(node => (
        <Post key={node.number} node={node} />
      ))}
    </Grid>
  )
}
