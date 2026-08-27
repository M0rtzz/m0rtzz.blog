import {
  createGitHubContext,
  queryDiscussions,
  queryRepositoryMetadata,
  resolvePostTargets,
} from './github-discussions.mjs'
import { readPosts, writeDiscussionNumber } from './posts.mjs'

const dryRun = process.argv.includes('--dry-run')
const sourceMarkerPrefix = 'm0rtzz.blog-source:'
const sourceMarkerPattern = /^<!-- m0rtzz\.blog-source:[^>]* -->(?:\r?\n){1,2}/
const { name, octokit, owner } = createGitHubContext()

function getSourceMarker(post) {
  return `<!-- ${sourceMarkerPrefix}${encodeURIComponent(post.relativePath)} -->`
}

function getMarkedBody(post) {
  return `${getSourceMarker(post)}\n\n${post.body}`
}

function normalizeBody(body) {
  return body.replace(/\r\n?/g, '\n').trimEnd()
}

function normalizeMappedRemoteBody(body) {
  return normalizeBody(body.replace(sourceMarkerPattern, ''))
}

function haveSameLabels(currentLabels, targetLabels) {
  if (currentLabels.length !== targetLabels.length) {
    return false
  }

  const targetLabelIds = new Set(targetLabels.map(label => label.id))
  return currentLabels.every(label => targetLabelIds.has(label.id))
}

async function createDiscussion(post, repositoryMetadata, target) {
  const result = await octokit.graphql(
    `
      mutation CreateDiscussion(
        $repositoryId: ID!
        $categoryId: ID!
        $title: String!
        $body: String!
      ) {
        createDiscussion(
          input: {
            repositoryId: $repositoryId
            categoryId: $categoryId
            title: $title
            body: $body
          }
        ) {
          discussion {
            id
            number
            title
            body
            category {
              id
              name
              slug
            }
            labels(first: 100) {
              nodes {
                id
                name
              }
            }
          }
        }
      }
    `,
    {
      body: getMarkedBody(post),
      categoryId: target.category.id,
      repositoryId: repositoryMetadata.id,
      title: post.title,
    },
  )

  const discussion = result.createDiscussion?.discussion
  if (!discussion) {
    throw new Error(`${post.relativePath}: GitHub did not create a Discussion`)
  }

  return discussion
}

async function updateDiscussion(post, discussion, target, body) {
  await octokit.graphql(
    `
      mutation UpdateDiscussion(
        $discussionId: ID!
        $categoryId: ID!
        $title: String!
        $body: String!
      ) {
        updateDiscussion(
          input: {
            discussionId: $discussionId
            categoryId: $categoryId
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
      body,
      categoryId: target.category.id,
      discussionId: discussion.id,
      title: post.title,
    },
  )
}

async function syncDiscussionLabels(discussion, targetLabels) {
  const currentLabelIds = new Set(
    discussion.labels.nodes.map(label => label.id),
  )
  const targetLabelIds = new Set(targetLabels.map(label => label.id))
  const labelIdsToAdd = targetLabels
    .filter(label => !currentLabelIds.has(label.id))
    .map(label => label.id)
  const labelIdsToRemove = discussion.labels.nodes
    .filter(label => !targetLabelIds.has(label.id))
    .map(label => label.id)

  if (labelIdsToAdd.length > 0) {
    await octokit.graphql(
      `
        mutation AddDiscussionLabels(
          $labelableId: ID!
          $labelIds: [ID!]!
        ) {
          addLabelsToLabelable(
            input: { labelableId: $labelableId, labelIds: $labelIds }
          ) {
            clientMutationId
          }
        }
      `,
      {
        labelableId: discussion.id,
        labelIds: labelIdsToAdd,
      },
    )
  }

  if (labelIdsToRemove.length > 0) {
    await octokit.graphql(
      `
        mutation RemoveDiscussionLabels(
          $labelableId: ID!
          $labelIds: [ID!]!
        ) {
          removeLabelsFromLabelable(
            input: { labelableId: $labelableId, labelIds: $labelIds }
          ) {
            clientMutationId
          }
        }
      `,
      {
        labelableId: discussion.id,
        labelIds: labelIdsToRemove,
      },
    )
  }
}

function getDiscussionChanges(post, discussion, target, preserveMarker) {
  const desiredBody = preserveMarker ? getMarkedBody(post) : post.body
  const bodyChanged = preserveMarker
    ? normalizeBody(discussion.body) !== normalizeBody(desiredBody)
    : normalizeMappedRemoteBody(discussion.body) !== post.body

  return {
    bodyChanged,
    categoryChanged: discussion.category?.id !== target.category.id,
    desiredBody,
    labelsChanged: !haveSameLabels(discussion.labels.nodes, target.labels),
    titleChanged: discussion.title !== post.title,
  }
}

function describeChanges(changes) {
  return [
    changes.titleChanged && 'title',
    changes.bodyChanged && 'body',
    changes.categoryChanged && 'category',
    changes.labelsChanged && 'labels',
  ]
    .filter(Boolean)
    .join(', ')
}

async function syncExistingDiscussion(
  post,
  discussion,
  target,
  preserveMarker = false,
) {
  const changes = getDiscussionChanges(post, discussion, target, preserveMarker)
  const description = describeChanges(changes)

  if (!description) {
    return false
  }

  if (!dryRun) {
    if (
      changes.titleChanged ||
      changes.bodyChanged ||
      changes.categoryChanged
    ) {
      await updateDiscussion(post, discussion, target, changes.desiredBody)
    }

    if (changes.labelsChanged) {
      await syncDiscussionLabels(discussion, target.labels)
    }
  }

  console.log(
    dryRun
      ? `Discussion #${discussion.number}: would update ${description}`
      : `Discussion #${discussion.number}: updated ${description}`,
  )
  return true
}

const posts = await readPosts()
const [repositoryMetadata, discussions] = await Promise.all([
  queryRepositoryMetadata(octokit, owner, name),
  queryDiscussions(octokit, owner, name),
])
const discussionsByNumber = new Map(
  discussions.map(discussion => [discussion.number, discussion]),
)
const mappedDiscussionNumbers = new Set(
  posts
    .map(post => post.discussionNumber)
    .filter(discussionNumber => discussionNumber !== undefined),
)
const targets = new Map()
const recoveredDiscussions = new Map()
const preflightErrors = []

for (const post of posts) {
  try {
    targets.set(post, resolvePostTargets(post, repositoryMetadata))
  } catch (error) {
    preflightErrors.push(error instanceof Error ? error.message : error)
  }

  if (post.discussionNumber !== undefined) {
    if (!discussionsByNumber.has(post.discussionNumber)) {
      preflightErrors.push(
        `${post.relativePath}: Discussion #${post.discussionNumber} does not exist in ${owner}/${name}`,
      )
    }
    continue
  }

  const sourceMarker = getSourceMarker(post)
  const matches = discussions.filter(discussion =>
    discussion.body.startsWith(sourceMarker),
  )

  if (matches.length > 1) {
    preflightErrors.push(
      `${post.relativePath}: multiple Discussions contain its source marker`,
    )
  } else if (matches.length === 1) {
    const [discussion] = matches

    if (mappedDiscussionNumbers.has(discussion.number)) {
      preflightErrors.push(
        `${post.relativePath}: recovered Discussion #${discussion.number} is already mapped by another post`,
      )
    } else {
      recoveredDiscussions.set(post, discussion)
    }
  }
}

if (preflightErrors.length > 0) {
  throw new Error(
    `Cannot synchronize posts:\n- ${preflightErrors.join('\n- ')}`,
  )
}

let createdCount = 0
let updatedCount = 0
let mappedCount = 0

for (const post of posts) {
  const target = targets.get(post)

  if (post.discussionNumber !== undefined) {
    const discussion = discussionsByNumber.get(post.discussionNumber)
    const updated = await syncExistingDiscussion(post, discussion, target)

    if (updated) {
      updatedCount += 1
    } else {
      console.log(`Discussion #${post.discussionNumber}: unchanged`)
    }
    continue
  }

  let discussion = recoveredDiscussions.get(post)

  if (!discussion) {
    if (dryRun) {
      console.log(
        `${post.relativePath}: would create a Discussion in ${target.category.name} with labels ${post.labels.join(', ')}`,
      )
      createdCount += 1
      continue
    }

    discussion = await createDiscussion(post, repositoryMetadata, target)
    await syncDiscussionLabels(discussion, target.labels)
    createdCount += 1
    console.log(
      `${post.relativePath}: created Discussion #${discussion.number}`,
    )
  } else {
    const updated = await syncExistingDiscussion(post, discussion, target, true)

    if (updated) {
      updatedCount += 1
    }

    console.log(
      dryRun
        ? `${post.relativePath}: would recover Discussion #${discussion.number}`
        : `${post.relativePath}: recovered Discussion #${discussion.number}`,
    )
  }

  if (!dryRun) {
    await writeDiscussionNumber(post, discussion.number)
  }
  mappedCount += 1
}

console.log(
  dryRun
    ? `Dry run complete: ${createdCount} create, ${updatedCount} update, ${mappedCount} recover`
    : `Sync complete: ${createdCount} created, ${updatedCount} updated, ${mappedCount} mapped`,
)
