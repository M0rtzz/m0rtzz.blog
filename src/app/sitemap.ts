import { type MetadataRoute } from 'next'

import { site } from '~/blog-config'

import { staticPage } from '@/app/static-page'
import { queryAllLabels, queryAllPosts } from '@/service'

const url = (url: string) => `${site}/${url}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const [, ...restStaticPage] = staticPage

  const allPosts = await queryAllPosts()
  const allTags = await queryAllLabels()

  return [
    // Home Page
    ...['', ...restStaticPage].map(path => ({
      url: url(path),
      priority: path ? 0.8 : 1,
    })),
    // Post List
    {
      url: url('/posts/all'),
      priority: 0.6,
    },
    // Posts
    ...allPosts.search.nodes.map(post => ({
      url: url(`/posts/${post.number}`),
      priority: 1,
    })),
    // Tags
    ...(allTags.repository?.labels.nodes.map(label => ({
      url: url(`/tags/${label.name}`),
      priority: 0.6,
    })) ?? []),
    // Resume
    {
      url: url('resume'),
      priority: 0.6,
    },
  ].map(item => ({ ...item, changeFrequency: 'weekly', lastModified }))
}
