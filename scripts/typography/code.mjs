import { bundledLanguages, createHighlighter } from 'shiki'

import { formatComment } from './text.mjs'

let highlighterPromise
const cache = new Map()

function highlighter() {
  return (highlighterPromise ??= createHighlighter({
    themes: ['github-light'],
    langs: [],
  }))
}

export async function commentRanges(code, language) {
  const baseLanguage = language?.split(':')[0]
  const lang = { json: 'jsonc' }[baseLanguage] || baseLanguage
  if (!lang || !bundledLanguages[lang]) return null
  const key = `${lang}\0${code}`
  if (cache.has(key)) return cache.get(key)
  const h = await highlighter()
  await h.loadLanguage(lang)
  const tokens = h.codeToTokensBase(code, {
    lang,
    theme: 'github-light',
    includeExplanation: true,
  })
  const ranges = []
  for (const line of tokens) {
    for (const token of line) {
      let offset = token.offset
      if (
        token.explanation?.map(item => item.content).join('') !== token.content
      ) {
        throw new Error(`Shiki explanation mismatch (${lang})`)
      }
      for (const part of token.explanation) {
        const scopes = part.scopes.map(scope => scope.scopeName)
        const commentIndex = scopes.findIndex(scope => /^comment\./.test(scope))
        // A grammar can embed a language (and comments) inside a heredoc or
        // template string. An enclosing string takes precedence over comments.
        const insideString = scopes
          .slice(0, commentIndex)
          .some(scope => /^string\./.test(scope))
        if (
          commentIndex >= 0 &&
          !insideString &&
          !scopes.some(scope => /shebang/.test(scope))
        ) {
          const previous = ranges.at(-1)
          if (previous?.end === offset) previous.end += part.content.length
          else ranges.push({ start: offset, end: offset + part.content.length })
        }
        offset += part.content.length
      }
    }
  }
  // The Make grammar marks recipe lines as strings rather than embedding
  // Shell. Retokenize complete tab-prefixed recipe runs as Bash so strings and
  // heredocs in recipes are still protected. Never trim or rewrite the Tab.
  if (lang === 'makefile' || lang === 'make') {
    for (const match of code.matchAll(/(?:^|(?<=\n))(?:\t[^\n]*(?:\n|$))+/g)) {
      for (const range of (await commentRanges(match[0], 'bash')) || []) {
        const start = match.index + range.start,
          end = match.index + range.end
        if (!ranges.some(item => start < item.end && end > item.start))
          ranges.push({ start, end })
      }
    }
    ranges.sort((a, b) => a.start - b.start)
  }
  cache.set(key, ranges)
  return ranges
}

export async function codeEdits(code, language) {
  const ranges = await commentRanges(code, language)
  if (ranges === null) return null
  return ranges.flatMap(({ start, end }) => {
    const old = code.slice(start, end)
    const replacement = formatComment(old)
    return old === replacement
      ? []
      : [{ start, end, replacement, rule: 'comment-typography' }]
  })
}

export async function codeSignature(code, language) {
  const ranges = await commentRanges(code, language)
  if (ranges === null) return code
  let result = '',
    cursor = 0
  for (const { start, end } of ranges) {
    // Compare canonical comments as well as all non-comment bytes. Directives
    // and commented-out code are returned verbatim by formatComment.
    const comment = code.slice(start, end)
    result += code.slice(cursor, start) + formatComment(comment)
    cursor = end
  }
  return result + code.slice(cursor)
}
