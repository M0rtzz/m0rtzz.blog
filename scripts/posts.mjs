import { readdir, readFile } from 'node:fs/promises'
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
  const discussionNumber = Number(data.discussionNumber)

  if (!Number.isSafeInteger(discussionNumber) || discussionNumber <= 0) {
    errors.push('`discussionNumber` must be a positive integer')
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

    const discussionNumber = Number(data.discussionNumber)
    if (!Number.isSafeInteger(discussionNumber) || discussionNumber <= 0) {
      continue
    }

    const displayPath = relative(repositoryRoot, path)
    const duplicatePath = discussionFiles.get(discussionNumber)
    if (duplicatePath) {
      errors.push(
        `${displayPath}: discussion #${discussionNumber} is already mapped by ${duplicatePath}`,
      )
      continue
    }

    discussionFiles.set(discussionNumber, displayPath)
    posts.push({
      body,
      discussionNumber,
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

  return posts.sort(
    (left, right) => left.discussionNumber - right.discussionNumber,
  )
}
