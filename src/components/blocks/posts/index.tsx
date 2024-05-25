import { Block } from '@/components/blocks/block'
import { Post } from '@/components/post'
import { queryAllPosts } from '@/service'

import { ExploreMore } from './explore-more'

export const Posts = async () => {
  const discussions = await queryAllPosts()
  const {
    search: { nodes },
  } = discussions

  const recentDiscussions = nodes.slice(0, 5)
  return (
    <>
      {recentDiscussions.map(node => (
        <Post key={node.number} node={node} />
      ))}
      <Block
        data-type='posts'
        tabIndex={0}
        className='flex items-stretch justify-stretch overflow-clip bg-surface outline-offset-4 max-md:col-span-2'
      >
        <ExploreMore href='/posts/all' />
      </Block>
    </>
  )
}
