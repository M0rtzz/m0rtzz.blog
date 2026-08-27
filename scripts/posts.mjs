import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import matter from 'gray-matter'

const scriptsDirectory = dirname(fileURLToPath(import.meta.url))

export const repositoryRoot = resolve(scriptsDirectory, '..')
export const postsDirectory = resolve(repositoryRoot, 'posts')

const markdownExtensions = new Set(['.md', '.mdx'])

async function findMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = resolve(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await findMarkdownFiles(path)))
    } else if (entry.isFile() && markdownExtensions.has(extname(entry.name))) {
      files.push(path)
    }
  }

  return files.sort((left, right) => left.localeCompare(right, 'zh-CN'))
}

function normalizeBody(content) {
  return content.replace(/\r\n?/g, '\n').replace(/^\n+/, '').trimEnd()
}

function validateMetadata(path, data, body) {
  const errors = []
  const displayPath = relative(repositoryRoot, path)
  const hasDiscussionNumber = data.discussionNumber !== undefined
  const discussionNumber = hasDiscussionNumber
    ? Number(data.discussionNumber)
    : undefined

  if (
    hasDiscussionNumber &&
    (!Number.isSafeInteger(discussionNumber) || discussionNumber <= 0)
  ) {
    errors.push('`discussionNumber` must be a positive integer')
  }

  if (typeof data.category !== 'string' || data.category.trim() === '') {
    errors.push('`category` must be a non-empty string')
  }

  if (!Array.isArray(data.labels) || data.labels.length === 0) {
    errors.push('`labels` must be a non-empty array')
  } else {
    const labels = []

    for (const label of data.labels) {
      if (typeof label !== 'string' || label.trim() === '') {
        errors.push('every `labels` item must be a non-empty string')
      } else {
        labels.push(label.trim())
      }
    }

    if (new Set(labels).size !== labels.length) {
      errors.push('`labels` must not contain duplicates')
    }
  }

  if (typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push('`title` must be a non-empty string')
  }

  if (data.summary !== undefined && typeof data.summary !== 'string') {
    errors.push('`summary` must be a string when provided')
  }

  if (body === '') {
    errors.push('article body must not be empty')
  }

  return errors.map(error => `${displayPath}: ${error}`)
}

export async function readPosts() {
  const files = await findMarkdownFiles(postsDirectory)
  const posts = []
  const errors = []
  const discussionFiles = new Map()

  for (const path of files) {
    const source = await readFile(path, 'utf8')
    const { data, content } = matter(source)
    const body = normalizeBody(content)

    errors.push(...validateMetadata(path, data, body))

    const discussionNumber =
      data.discussionNumber === undefined
        ? undefined
        : Number(data.discussionNumber)

    const displayPath = relative(repositoryRoot, path)
    if (
      Number.isSafeInteger(discussionNumber) &&
      discussionNumber !== undefined &&
      discussionNumber > 0
    ) {
      const duplicatePath = discussionFiles.get(discussionNumber)
      if (duplicatePath) {
        errors.push(
          `${displayPath}: discussion #${discussionNumber} is already mapped by ${duplicatePath}`,
        )
        continue
      }

      discussionFiles.set(discussionNumber, displayPath)
    }

    posts.push({
      body,
      category: typeof data.category === 'string' ? data.category.trim() : '',
      discussionNumber:
        Number.isSafeInteger(discussionNumber) &&
        discussionNumber !== undefined &&
        discussionNumber > 0
          ? discussionNumber
          : undefined,
      labels: Array.isArray(data.labels)
        ? data.labels
            .filter(label => typeof label === 'string')
            .map(label => label.trim())
        : [],
      path,
      relativePath: displayPath,
      summary:
        typeof data.summary === 'string' && data.summary.trim() !== ''
          ? data.summary.trim()
          : undefined,
      title: typeof data.title === 'string' ? data.title.trim() : '',
    })
  }

  if (errors.length > 0) {
    throw new Error(`Invalid post metadata:\n- ${errors.join('\n- ')}`)
  }

  return posts.sort((left, right) => {
    if (left.discussionNumber === undefined) {
      return right.discussionNumber === undefined
        ? left.relativePath.localeCompare(right.relativePath, 'zh-CN')
        : 1
    }

    if (right.discussionNumber === undefined) {
      return -1
    }

    return left.discussionNumber - right.discussionNumber
  })
}

export async function writeDiscussionNumber(post, discussionNumber) {
  const source = await readFile(post.path, 'utf8')
  const frontMatter = source.match(/^---(\r?\n)([\s\S]*?)\r?\n---(\r?\n|$)/)

  if (!frontMatter) {
    throw new Error(`${post.relativePath}: post does not contain Front Matter`)
  }

  const lineEnding = frontMatter[1]
  const lines = frontMatter[2].split(/\r?\n/)
  const discussionNumberLine = `discussionNumber: ${discussionNumber}`
  const discussionNumberIndex = lines.findIndex(line =>
    /^discussionNumber\s*:/.test(line),
  )

  if (discussionNumberIndex >= 0) {
    lines[discussionNumberIndex] = discussionNumberLine
  } else {
    lines.unshift(discussionNumberLine)
  }

  const replacement = `---${lineEnding}${lines.join(lineEnding)}${lineEnding}---${frontMatter[3]}`
  await writeFile(post.path, replacement + source.slice(frontMatter[0].length))
}
