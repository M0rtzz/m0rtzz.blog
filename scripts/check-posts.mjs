import {
  createGitHubContext,
  queryDiscussions,
  queryRepositoryMetadata,
  resolvePostTargets,
} from './github-discussions.mjs'
import { readPosts } from './posts.mjs'

try {
  const posts = await readPosts()
  const { name, octokit, owner } = createGitHubContext()
  const [repositoryMetadata, discussions] = await Promise.all([
    queryRepositoryMetadata(octokit, owner, name),
    queryDiscussions(octokit, owner, name),
  ])
  const discussionNumbers = new Set(
    discussions.map(discussion => discussion.number),
  )
  const errors = []

  for (const post of posts) {
    try {
      resolvePostTargets(post, repositoryMetadata)
    } catch (error) {
      errors.push(error instanceof Error ? error.message : error)
    }

    if (
      post.discussionNumber !== undefined &&
      !discussionNumbers.has(post.discussionNumber)
    ) {
      errors.push(
        `${post.relativePath}: Discussion #${post.discussionNumber} does not exist in ${owner}/${name}`,
      )
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid remote post metadata:\n- ${errors.join('\n- ')}`)
  }

  const summaries = posts.filter(post => post.summary).length
  const mappedPosts = posts.filter(
    post => post.discussionNumber !== undefined,
  ).length

  console.log(
    `Validated ${posts.length} posts (${mappedPosts} mapped, ${posts.length - mappedPosts} new; ${summaries} with summaries, ${posts.length - summaries} without)`,
  )
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
