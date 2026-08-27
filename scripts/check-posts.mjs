import { readPosts } from './posts.mjs'

try {
  const posts = await readPosts()
  const summaries = posts.filter(post => post.summary).length

  console.log(
    `Validated ${posts.length} posts (${summaries} with summaries, ${posts.length - summaries} without)`,
  )
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
