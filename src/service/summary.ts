import 'server-only'

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'

import matter from 'gray-matter'
import OpenAI from 'openai'

import { sleep } from '@/utils'

const defaultSummaryModel = 'gpt-3.5-turbo'
const maxSummaryAttempts = 3
const markdownExtensions = new Set(['.md', '.mdx'])
const postsDirectory = resolve(process.cwd(), 'posts')
const summaryTasks = new Map<string, Promise<string | null>>()
let metadataCache: Promise<PostMetadata> | null = null
let summaryWriteOperation: Promise<void> = Promise.resolve()

type SummaryMap = Partial<Record<string, string>>

interface PostMetadata {
  files: Map<string, string>
  summaries: SummaryMap
}

function normalizeBaseURL(baseURL?: string) {
  if (!baseURL) {
    return undefined
  }

  const normalizedBaseURL = baseURL.trim().replace(/\/+$/, '')

  for (const suffix of ['/chat/completions', '/responses']) {
    if (normalizedBaseURL.endsWith(suffix)) {
      return normalizedBaseURL.slice(0, -suffix.length)
    }
  }

  return normalizedBaseURL
}

function isEnabled(value?: string) {
  return ['1', 'true', 'yes', 'on'].includes(value?.trim().toLowerCase() ?? '')
}

function getSummaryClientConfig() {
  const enabled = isEnabled(process.env.ENABLE_LLM_SUMMARY)
  const apiKey = process.env.LLM_API_KEY?.trim()
  const baseURL = normalizeBaseURL(process.env.LLM_BASE_URL)
  const model = process.env.LLM_MODEL?.trim() || defaultSummaryModel

  return {
    apiKey,
    baseURL,
    enabled,
    model,
  }
}

export function canCreateSummary() {
  const { apiKey, enabled } = getSummaryClientConfig()
  return enabled && Boolean(apiKey)
}

export async function createSummary(content: string) {
  const { apiKey, baseURL, enabled, model } = getSummaryClientConfig()

  if (!enabled || !apiKey) {
    return null
  }

  try {
    const openai = new OpenAI({
      apiKey,
      baseURL,
    })

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            "Please generate a very short summary (in English) of the user content, do not include the author's subjective opinions, and must be no longer than 20 words (this is important).",
        },
        { role: 'user', content },
      ],
      model,
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error('Failed to create summary', {
      baseURL,
      model,
      error,
    })
    return null
  }
}

async function findMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const path = resolve(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await findMarkdownFiles(path)))
    } else if (entry.isFile() && markdownExtensions.has(extname(entry.name))) {
      files.push(path)
    }
  }

  return files
}

async function readPostMetadata(): Promise<PostMetadata> {
  const files = new Map<string, string>()
  const summaries: SummaryMap = {}

  for (const path of await findMarkdownFiles(postsDirectory)) {
    const source = await readFile(path, 'utf8')
    const { data } = matter(source)
    const discussionNumber = Number(data.discussionNumber)

    if (!Number.isSafeInteger(discussionNumber) || discussionNumber <= 0) {
      continue
    }

    const id = String(discussionNumber)
    files.set(id, path)

    if (typeof data.summary === 'string' && data.summary.trim() !== '') {
      summaries[id] = data.summary.trim()
    }
  }

  return { files, summaries }
}

function getPostMetadata() {
  metadataCache ??= readPostMetadata()
  return metadataCache
}

export async function getSummary() {
  return (await getPostMetadata()).summaries
}

function withSummaryWriteLock<T>(action: () => Promise<T>) {
  const operation = summaryWriteOperation.then(action, action)
  summaryWriteOperation = operation.then(
    () => undefined,
    () => undefined,
  )
  return operation
}

function setFrontMatterSummary(source: string, summary: string) {
  const frontMatter = source.match(/^---(\r?\n)([\s\S]*?)\r?\n---(\r?\n|$)/)

  if (!frontMatter) {
    throw new Error('Post does not contain Front Matter')
  }

  const lineEnding = frontMatter[1]
  const lines = frontMatter[2].split(/\r?\n/)
  const summaryLine = `summary: ${JSON.stringify(summary)}`
  const summaryIndex = lines.findIndex(line => /^summary\s*:/.test(line))

  if (summaryIndex >= 0) {
    lines[summaryIndex] = summaryLine
  } else {
    lines.push(summaryLine)
  }

  const replacement = `---${lineEnding}${lines.join(lineEnding)}${lineEnding}---${frontMatter[3]}`
  return replacement + source.slice(frontMatter[0].length)
}

async function saveSummary(id: string, summary: string) {
  await withSummaryWriteLock(async () => {
    const metadata = await getPostMetadata()

    if (metadata.summaries[id]) {
      return
    }

    const path = metadata.files.get(id)
    if (!path) {
      throw new Error(`Cannot find a post mapped to Discussion #${id}`)
    }

    const source = await readFile(path, 'utf8')
    await writeFile(path, setFrontMatterSummary(source, summary))
    metadataCache = null
  })
}

async function retrySummaryUntilSuccess(id: string, content: string) {
  let attempt = 0

  while (canCreateSummary() && attempt < maxSummaryAttempts) {
    const currentSummary = (await getSummary())[id]

    if (currentSummary) {
      return currentSummary
    }

    attempt += 1
    console.log(`summary ${id}, attempt ${attempt}...`)

    const result = (await createSummary(content))?.trim()

    if (result) {
      await saveSummary(id, result)
      console.log(`summary ${id} done`)
      return result
    }

    const retryDelay = Math.min(300000, 5000 * attempt)
    console.log(`summary ${id} failed, retrying in ${retryDelay / 1000}s...`)
    await sleep(retryDelay)
  }

  return null
}

export async function ensureSummary(id: string | number, content: string) {
  if (!canCreateSummary()) {
    return null
  }

  const summaryId = String(id)
  const currentSummary = (await getSummary())[summaryId]

  if (currentSummary) {
    return currentSummary
  }

  const existingTask = summaryTasks.get(summaryId)
  if (existingTask) {
    return existingTask
  }

  const task = retrySummaryUntilSuccess(summaryId, content).finally(() => {
    summaryTasks.delete(summaryId)
  })

  summaryTasks.set(summaryId, task)
  return task
}
