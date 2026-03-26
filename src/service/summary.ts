import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import OpenAI from 'openai'

import { sleep } from '@/utils'

const defaultSummaryModel = 'gpt-3.5-turbo'
const summaryTasks = new Map<string, Promise<string | null>>()
let summaryFileOperation: Promise<void> = Promise.resolve()

type SummaryMap = Record<string, string>

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

function getSummaryClientConfig() {
  const apiKey = process.env.LLM_API_KEY?.trim()
  const baseURL = normalizeBaseURL(process.env.LLM_BASE_URL)
  const model = process.env.LLM_MODEL?.trim() || defaultSummaryModel

  return {
    apiKey,
    baseURL,
    model,
  }
}

export function canCreateSummary() {
  return Boolean(getSummaryClientConfig().apiKey)
}

export async function createSummary(content: string) {
  const { apiKey, baseURL, model } = getSummaryClientConfig()

  if (!apiKey) {
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

const cwd = process.cwd()
const summaryFilePath = join(cwd, 'summary.json')

function withSummaryFileLock<T>(action: () => Promise<T>) {
  const operation = summaryFileOperation.then(action, action)
  summaryFileOperation = operation.then(
    () => undefined,
    () => undefined,
  )
  return operation
}

export async function getSummary() {
  try {
    const fileContent = await readFile(summaryFilePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch {
    return {}
  }
}

export async function writeSummery(newSummery: SummaryMap) {
  await writeFile(summaryFilePath, JSON.stringify(newSummery, null, 2))
}

async function saveSummary(id: string, summary: string) {
  await withSummaryFileLock(async () => {
    const currentSummary = (await getSummary()) as SummaryMap

    if (currentSummary[id]) {
      return
    }

    currentSummary[id] = summary
    await writeSummery(currentSummary)
  })
}

async function retrySummaryUntilSuccess(id: string, content: string) {
  let attempt = 0

  while (true) {
    const currentSummary = (await getSummary()) as SummaryMap

    if (currentSummary[id]) {
      return currentSummary[id]
    }

    attempt += 1
    console.log(`summary ${id}, attempt ${attempt}...`)

    const result = await createSummary(content)

    if (result) {
      await saveSummary(id, result)
      console.log(`summary ${id} done`)
      return result
    }

    const retryDelay = Math.min(300000, 5000 * attempt)
    console.log(`summary ${id} failed, retrying in ${retryDelay / 1000}s...`)
    await sleep(retryDelay)
  }
}

export async function ensureSummary(id: string | number, content: string) {
  if (!canCreateSummary()) {
    return null
  }

  const summaryId = String(id)
  const currentSummary = (await getSummary()) as SummaryMap

  if (currentSummary[summaryId]) {
    return currentSummary[summaryId]
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
