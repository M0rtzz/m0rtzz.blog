import { Octokit } from '@octokit/core'
import dotenv from 'dotenv'

import { readPosts, repositoryRoot } from './posts.mjs'

dotenv.config({ path: `${repositoryRoot}/.env`, quiet: true })

const dryRun = process.argv.includes('--dry-run')
const token =
  process.env.GITHUB_TOKEN?.trim() || process.env.ACCESS_TOKEN?.trim()
const repository =
  process.env.GITHUB_REPOSITORY?.trim() ||
  [process.env.REPO_OWNER?.trim(), process.env.REPO_NAME?.trim()]
    .filter(Boolean)
    .join('/')

if (!token) {
  throw new Error('GITHUB_TOKEN or ACCESS_TOKEN is required')
}

const [owner, name, ...extraParts] = repository.split('/')
if (!owner || !name || extraParts.length > 0) {
  throw new Error(
    'GITHUB_REPOSITORY or REPO_OWNER/REPO_NAME must identify an owner/repository',
  )
}

const octokit = new Octokit({ auth: token })

async function queryDiscussions() {
  const discussions = []
  let cursor = null

  do {
    const result = await octokit.graphql(
      `
        query Discussions(
          $owner: String!
          $name: String!
          $cursor: String
        ) {
          repository(owner: $owner, name: $name) {
            discussions(first: 100, after: $cursor) {
              nodes {
                id
                number
                title
                body
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      `,
      { cursor, name, owner },
    )

    const connection = result.repository?.discussions
    if (!connection) {
      throw new Error(`Cannot read Discussions from ${owner}/${name}`)
    }

    discussions.push(...connection.nodes)
    cursor = connection.pageInfo.hasNextPage
      ? connection.pageInfo.endCursor
      : null
  } while (cursor)

  return new Map(discussions.map(discussion => [discussion.number, discussion]))
}

function normalizeRemoteBody(body) {
  return body.replace(/\r\n?/g, '\n').trimEnd()
}

async function updateDiscussion(post, discussion) {
  await octokit.graphql(
    `
      mutation UpdateDiscussion(
        $discussionId: ID!
        $title: String!
        $body: String!
      ) {
        updateDiscussion(
          input: {
            discussionId: $discussionId
            title: $title
            body: $body
          }
        ) {
          discussion {
            number
            updatedAt
          }
        }
      }
    `,
    {
      body: post.body,
      discussionId: discussion.id,
      title: post.title,
    },
  )
}

const posts = await readPosts()
const discussions = await queryDiscussions()
let changedCount = 0

for (const post of posts) {
  const discussion = discussions.get(post.discussionNumber)

  if (!discussion) {
    throw new Error(
      `${post.relativePath}: Discussion #${post.discussionNumber} does not exist in ${owner}/${name}`,
    )
  }

  const titleChanged = discussion.title !== post.title
  const bodyChanged = normalizeRemoteBody(discussion.body) !== post.body

  if (!titleChanged && !bodyChanged) {
    console.log(`Discussion #${post.discussionNumber}: unchanged`)
    continue
  }

  changedCount += 1
  const changes = [titleChanged && 'title', bodyChanged && 'body']
    .filter(Boolean)
    .join(' and ')

  if (dryRun) {
    console.log(`Discussion #${post.discussionNumber}: would update ${changes}`)
  } else {
    await updateDiscussion(post, discussion)
    console.log(`Discussion #${post.discussionNumber}: updated ${changes}`)
  }
}

console.log(
  dryRun
    ? `Dry run complete: ${changedCount} of ${posts.length} Discussions would change`
    : `Sync complete: ${changedCount} of ${posts.length} Discussions updated`,
)
