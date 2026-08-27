import { Octokit } from '@octokit/core'
import dotenv from 'dotenv'

import { repositoryRoot } from './posts.mjs'

dotenv.config({ path: `${repositoryRoot}/.env`, quiet: true })

export function createGitHubContext() {
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

  return {
    name,
    octokit: new Octokit({ auth: token }),
    owner,
  }
}

export async function queryRepositoryMetadata(octokit, owner, name) {
  const repositoryResult = await octokit.graphql(
    `
      query RepositoryMetadata($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          id
          discussionCategories(first: 100) {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    `,
    { name, owner },
  )

  const repository = repositoryResult.repository
  if (!repository) {
    throw new Error(`Cannot read repository ${owner}/${name}`)
  }

  const labels = []
  let cursor = null

  do {
    const labelsResult = await octokit.graphql(
      `
        query RepositoryLabels(
          $owner: String!
          $name: String!
          $cursor: String
        ) {
          repository(owner: $owner, name: $name) {
            labels(first: 100, after: $cursor) {
              nodes {
                id
                name
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

    const connection = labelsResult.repository?.labels
    if (!connection) {
      throw new Error(`Cannot read labels from ${owner}/${name}`)
    }

    labels.push(...connection.nodes)
    cursor = connection.pageInfo.hasNextPage
      ? connection.pageInfo.endCursor
      : null
  } while (cursor)

  return {
    categories: repository.discussionCategories.nodes,
    id: repository.id,
    labels,
  }
}

export async function queryDiscussions(octokit, owner, name) {
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

  return discussions
}

export function resolvePostTargets(post, repositoryMetadata) {
  const category = repositoryMetadata.categories.find(
    item => item.name === post.category || item.slug === post.category,
  )

  if (!category) {
    const supportedCategories = repositoryMetadata.categories
      .map(item => item.name)
      .sort()
      .join(', ')
    throw new Error(
      `${post.relativePath}: category ${JSON.stringify(post.category)} is not supported; choose one of: ${supportedCategories}`,
    )
  }

  const labelsByName = new Map(
    repositoryMetadata.labels.map(label => [label.name, label]),
  )
  const labels = post.labels.map(labelName => {
    const label = labelsByName.get(labelName)

    if (!label) {
      const supportedLabels = repositoryMetadata.labels
        .map(item => item.name)
        .sort()
        .join(', ')
      throw new Error(
        `${post.relativePath}: label ${JSON.stringify(labelName)} is not supported; choose from: ${supportedLabels}`,
      )
    }

    return label
  })

  return { category, labels }
}
