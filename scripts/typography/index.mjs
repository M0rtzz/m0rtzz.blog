import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, extname, relative, resolve } from 'node:path'

import matter from 'gray-matter'

import { repositoryRoot, postsDirectory } from '../posts.mjs'

import { updateLinks } from './links.mjs'
import { formatMarkdown } from './markdown.mjs'
import { formatText } from './text.mjs'

async function findFiles(paths) {
  const result = new Set()
  async function add(path) {
    path = resolve(path)
    const info = await stat(path)
    if (info.isDirectory()) {
      for (const item of await readdir(path, { withFileTypes: true })) {
        if (
          !item.isSymbolicLink() &&
          (item.isDirectory() || /\.mdx?$/i.test(item.name))
        )
          await add(resolve(path, item.name))
      }
    } else if (/\.mdx?$/i.test(path)) result.add(path)
    else throw new Error(`不是 Markdown 文件：${path}`)
  }
  for (const path of paths) await add(path)
  return [...result].sort()
}

export async function prepareTypography(paths = [postsDirectory]) {
  const documents = [],
    errors = []
  for (const path of await findFiles(paths)) {
    const original = await readFile(path, 'utf8')
    try {
      const result = await formatMarkdown(original)
      documents.push({
        path,
        original,
        result,
        discussionNumber: matter(original).data.discussionNumber,
      })
    } catch (error) {
      errors.push(`${relative(repositoryRoot, path)}: ${error.message}`)
    }
  }
  if (errors.length)
    throw new Error(`排版检查失败，未写入任何文章：\n${errors.join('\n')}`)
  updateLinks(documents)
  // Validate every final result, including compatibility anchors and rewritten
  // chapter links, before the first write. A second pass MUST be a no-op.
  for (const document of documents) {
    const again = await formatMarkdown(document.result.source)
    if (again.source !== document.result.source)
      throw new Error(
        `${relative(repositoryRoot, document.path)}: 修复未达到幂等，未写入任何文章`,
      )
  }
  return documents
}

function location(source, offset) {
  const before = source.slice(0, offset)
  return `${before.split('\n').length}:${offset - before.lastIndexOf('\n')}`
}

export async function runTypography({
  paths = [postsDirectory],
  fix = false,
  report = console.log,
} = {}) {
  const documents = await prepareTypography(paths)
  const changed = documents.filter(
    document => document.original !== document.result.source,
  )
  for (const document of documents) {
    const name = relative(repositoryRoot, document.path)
    if (!fix)
      for (const edit of document.result.edits) {
        const old = JSON.stringify(
          document.original.slice(edit.start, edit.end),
        )
        report(
          `${name}:${location(document.original, edit.start)} [${edit.rule}] ${old} → ${JSON.stringify(edit.replacement)}`,
        )
      }
    if (!fix && document.result.aliases.size)
      report(
        `${name}: [legacy-heading-anchor] 将保留 ${document.result.aliases.size} 个旧章节锚点`,
      )
    if (!fix && document.result.linkEdits.length)
      report(
        `${name}: [chapter-link] 将更新 ${document.result.linkEdits.length} 个章节链接`,
      )
    const filename = basename(name, extname(name))
    if (formatText(filename) !== filename)
      report(
        `${name}: [filename-review] 文件名可能需要排版：${formatText(filename)}（仅提示，不自动重命名）`,
      )
    if (document.result.warnings.length)
      report(
        `${name}: [code-coverage] ${document.result.warnings.length} 个无语言/纯文本/未知语言代码块原样保留（行:列 ${document.result.warnings.map(warning => location(document.original, warning.offset)).join(', ')}）；请人工检查其自然语言部分。`,
      )
  }
  if (fix) {
    // Detect edits made while the (potentially expensive) preflight was running.
    for (const document of documents) {
      if ((await readFile(document.path, 'utf8')) !== document.original)
        throw new Error(`${document.path}: 检查期间文件已变化，未写入任何文章`)
    }
    const written = []
    try {
      for (const document of changed) {
        written.push(document)
        await writeFile(document.path, document.result.source, 'utf8')
        report(`已修复 ${relative(repositoryRoot, document.path)}`)
      }
    } catch (error) {
      // Best-effort rollback on an I/O failure; validation failures never reach
      // this block. Do not overwrite independent edits made after our write.
      for (const document of written.reverse()) {
        if ((await readFile(document.path, 'utf8')) === document.result.source)
          await writeFile(document.path, document.original, 'utf8')
      }
      throw error
    }
  }
  report(
    `排版${fix ? '修复' : '检查'}：${documents.length} 篇，${changed.length} 篇${fix ? '已修改' : '需要修复'}。`,
  )
  return { ok: fix || changed.length === 0, documents, changed }
}

export async function assertPostTypography() {
  const result = await runTypography()
  if (!result.ok)
    throw new Error(
      '文章排版检查失败；请运行 pnpm posts:format 并检查差异。尚未访问或修改 GitHub Discussion。',
    )
}
