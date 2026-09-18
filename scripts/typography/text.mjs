import autocorrect from 'autocorrect-node'

// Only spacing/width, never spelling or product-name capitalization. Do not use
// formatFor(markdown): it also formats strings inside fenced code blocks.
autocorrect.loadConfig(
  JSON.stringify({
    rules: {
      'space-word': 1,
      'halfwidth-word': 1,
      spellcheck: 0,
      'space-backticks': 0,
      'space-punctuation': 0,
      'space-bracket': 0,
      'space-dash': 0,
      'space-dollar': 0,
      fullwidth: 0,
      'no-space-fullwidth': 0,
      'halfwidth-punctuation': 0,
    },
  }),
)

export const hasChinese = text => /\p{Script=Han}/u.test(text)
const han = /\p{Script=Han}/u
const word = /[A-Za-z0-9\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A]/u

export function needsSpace(left, right, leftCode = false, rightCode = false) {
  if (!left || !right || /\s/u.test(left) || /\s/u.test(right)) return false
  return (
    (han.test(left) && (word.test(right) || rightCode)) ||
    (han.test(right) && (word.test(left) || leftCode))
  )
}

// These are technical literals, not prose. Keep their exact spelling/bytes.
const technical = new RegExp(
  [
    /`+[^`\r\n]*`+/.source,
    /\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\\<[^\r\n]*?\\>/.source,
    /(?<!\\)\$(?!\{)[^$\r\n]+\$/.source,
    /[:;=8]-?[)(DPp]/.source,
    /(?:https?:\/\/|mailto:|www\.)[^\s<>"'，。；：！？（）“”‘’\[\]]+/.source,
    /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.source,
    /(?:\$\{[^}\r\n]+\}|\$[A-Za-z_][\w]*)(?:\/[\w.${}~+@%-]+)*|\$\([^\r\n]*?\)/
      .source,
    /(?:[A-Za-z]:\\|(?:~|\.{1,2})\/)[\p{L}\p{N}_.${}~+@%/\\-]*/.source,
    /\b[A-Za-z_][\w.-]*(?:\/[\w.-]+)+/.source,
    // A slash between Chinese words (输入/输出) is not a filesystem path.
    /(?<![A-Za-z0-9_.])(?:\/(?=[A-Za-z0-9_.${}~])|(?<!\p{Script=Han})\/(?=\p{Script=Han}))[\p{L}\p{N}_.${}~+@%/\\-]+/
      .source,
    /\b[\w-]+(?:\.[\w-]+)+(?:\/[\w./-]+)*|(?<![\w.])\.[A-Za-z][\w+-]*/.source,
    /\b\w+_\w+\b|--[\w-]+/.source,
    /\\(?:[A-Za-z]+|[^\r\n])|&(?:#\d+|#x[\da-f]+|[A-Za-z]+);/.source,
    /\[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/.source,
  ].join('|'),
  'giu',
)
const quoted = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/.source
const literalPattern = comment =>
  comment
    ? new RegExp(`${quoted}|${technical.source}`, technical.flags)
    : technical

// Match balanced calls without guessing where a nested argument list ends.
// Chinese prose in parentheses is not a call; quoted arguments may contain it.
function parenthesisEnd(text, start) {
  const stack = []
  let quote
  for (let i = start; i < text.length; i++) {
    const char = text[i]
    if (char === '\\') {
      i++
      continue
    }
    if (quote) {
      if (char === quote) quote = undefined
      continue
    }
    if (
      char === "'" &&
      /[A-Za-z]/.test(text[i - 1] || '') &&
      /[A-Za-z]/.test(text[i + 1] || '')
    )
      continue
    if (char === '"' || char === "'" || char === '`') quote = char
    else if (char === '(' || char === '（')
      stack.push(char === '(' ? ')' : '）')
    else if (char === ')' || char === '）') {
      if (stack.pop() !== char) return -1
      if (!stack.length) return i + 1
    }
  }
  return -1
}

function callRanges(text) {
  const ranges = []
  const names = /\b[A-Za-z_][\w]*(?:[.:][A-Za-z_][\w]*)*\(/g
  for (const match of text.matchAll(names)) {
    const start = match.index
    const end = parenthesisEnd(text, start + match[0].length - 1)
    if (end < 0) continue
    const unquoted = text
      .slice(start, end)
      .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, '')
    if (/^[\x20-\x7e]+$/.test(unquoted)) ranges.push({ start, end })
  }
  return ranges
}

// An English comment may end with a Chinese parenthetical explanation. Its
// English commas must not inherit the punctuation rules of the explanation.
function englishCommentParts(text) {
  const parts = []
  const literals = [
    ...[...text.matchAll(literalPattern(true))].map(match => ({
      start: match.index,
      end: match.index + match[0].length,
    })),
    ...callRanges(text),
  ]
  let cursor = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== '(' && text[i] !== '（') continue
    if (literals.some(range => i >= range.start && i < range.end)) continue
    const end = parenthesisEnd(text, i)
    if (end < 0) continue
    parts.push({ value: text.slice(cursor, i), aside: false })
    parts.push({
      value: text.slice(i + 1, end - 1),
      aside: true,
      open: text[i],
      close: text[end - 1],
    })
    cursor = end
    i = end - 1
  }
  parts.push({ value: text.slice(cursor), aside: false })
  const outside = parts
    .filter(part => !part.aside)
    .map(part => part.value)
    .join('')
  return /[A-Za-z]/.test(outside) &&
    !hasChinese(outside.replace(literalPattern(true), '')) &&
    parts.some(part => part.aside && hasChinese(part.value))
    ? parts
    : null
}

export function formatText(
  input,
  chineseContext = hasChinese(input),
  { comment = false } = {},
) {
  // Protect leading/trailing whitespace, including Markdown hard breaks.
  return input.replace(/[^\r\n]+/g, line => {
    const [, leading, body, trailing] = /^(\s*)(.*?)(\s*)$/.exec(line)
    const parts = comment && englishCommentParts(body)
    if (parts) {
      return (
        leading +
        parts
          .map(part => {
            const chinese = hasChinese(
              part.value.replace(literalPattern(true), ''),
            )
            const formatted = formatText(part.value, chinese, { comment: true })
            if (!part.aside) return formatted
            return chinese
              ? `（${formatted.trim()}）`
              : part.open + formatted + part.close
          })
          .join('') +
        trailing
      )
    }
    const saved = []
    let nonce = 'TYPOGRAPHYPROTECTED'
    while (body.includes(nonce)) nonce += 'X'
    const protectedPattern = literalPattern(comment)
    const ranges = [
      ...body.matchAll(protectedPattern),
      // Bare ASCII tuples are technical notation, not Chinese punctuation.
      ...body.matchAll(
        /\([ \t]*[+-]?[A-Za-z_\d][\w.+-]*(?:[ \t]*,[ \t]*[+-]?[A-Za-z_\d][\w.+-]*)+[ \t]*\)/g,
      ),
    ].map(match => ({ start: match.index, end: match.index + match[0].length }))
    ranges.push(...callRanges(body))
    ranges.sort((a, b) => a.start - b.start || b.end - a.end)
    let text = '',
      cursor = 0,
      symbol = 0xe000
    for (const { start, end } of ranges) {
      if (start < cursor) continue
      const value = body.slice(start, end)
      let key = `${nonce}${saved.length}TOKEN`
      // Escaped punctuation is still punctuation. An English-word placeholder
      // would manufacture spaces around e.g. Chinese\\{Chinese\\}.
      if (/^\\[^A-Za-z0-9\s]$/.test(value)) {
        while (body.includes(String.fromCodePoint(symbol))) symbol++
        key = String.fromCodePoint(symbol++)
      }
      saved.push({ key, value })
      text += body.slice(cursor, start) + key
      cursor = end
    }
    text += body.slice(cursor)
    // Also handles legacy literal emphasis restored by rehypeGithubAlert.
    text = text.replace(
      /(\*{1,3})(?=\S)([^\n]*?\S)\1/g,
      (all, marks, content, index, whole) => {
        const before = whole[index - 1]
        const after = whole[index + all.length]
        return `${needsSpace(before, content[0]) ? ' ' : ''}${marks}${content}${marks}${needsSpace(content.at(-1), after) ? ' ' : ''}`
      },
    )
    text = autocorrect.format(autocorrect.format(text))
    // Chinese inside a quoted literal/URL is not the language of an English
    // comment. Prose nodes still inherit their paragraph's language context.
    if (chineseContext && (!comment || hasChinese(text))) {
      text = text
        .replace(/\(/g, '（')
        .replace(/\)/g, '）')
        .replace(/"([^"\r\n]+)"/g, '“$1”')
        .replace(/(?<![A-Za-z])'([^'\r\n]+)'(?![A-Za-z])/g, '‘$1’')
        .replace(
          /[,;:!?]/g,
          char =>
            ({ ',': '，', ';': '；', ':': '：', '!': '！', '?': '？' })[char],
        )
        // Decimal numbers, filenames, ellipses and heading numbering are not
        // sentence stops. Ambiguous ASCII dots remain untouched.
        .replace(/(?<=[\p{Script=Han}”’）])\.(?![.\w/\\])/gu, '。')
        .replace(/[ \t]+([，。；：！？）”’])/g, '$1')
        .replace(/([（“‘])[ \t]+/g, '$1')
        .replace(/([，。；：！？])[ \t]+/g, '$1')
        .replace(/[ \t]+（/g, '（')
        .replace(/）[ \t]+(?=\p{Script=Han})/gu, '）')
    }
    for (const { key, value } of saved) {
      if (text.split(key).length !== 2)
        throw new Error('Protected text token was altered')
      text = text.replace(key, () => value)
    }
    return leading + text + trailing
  })
}

// Machine-readable comment directives must remain byte-for-byte identical.
export function isDirective(text) {
  return /(?:\[!code\b|m0rtzz\.blog-source:|autocorrect|typography:|prettier-|eslint|stylelint|markdownlint|shellcheck|shfmt:|\b(?:noqa|nosec|nolint|istanbul|c8|v8)\b|\btype:\s*ignore|\bcoding\s*[:=]|@(?:ts-|errors\b|log\b|filename\b|noErrors\b)|^\s*#!|^\s*%\s*!\s*(?:TEX|BIB)|\b(?:go:|sourceMappingURL|sourceURL|region\b|endregion\b))/i.test(
    text,
  )
}

export function formatComment(text) {
  if (!hasChinese(text) || isDirective(text)) return text
  return text.replace(/[^\r\n]+/g, line => {
    if (isDirective(line)) return line
    // Symmetric rulers are layout, not prose (including the label inside).
    if (/([#*=/~_-])\1{2,}.*\1{3,}/.test(line)) return line
    const match =
      /^(\s*(?:<!--|\/\*+|\/\/+|#+|;+|%+|--|\*)?)([\s\S]*?)(\s*(?:\*\/|-->)?)$/.exec(
        line,
      )
    const [, delimiter, content, suffix] = match
    let body = content
    // JSDoc/Doxygen: only the description is prose, never the tag/type/name.
    if (/^\s*@/.test(body)) {
      const doc =
        /^(\s*@(?:param|arg|argument|return|returns|throws|brief|description)\b[:：]?\s*(?:\{[^}]*\}\s*)?)/.exec(
          body,
        )
      if (!doc) return line
      let prefix = doc[0]
      if (/^\s*@(param|arg|argument)\b/.test(prefix)) {
        prefix +=
          /^(?:\[[^\]]+\]|[\w.$]+)\s*/.exec(body.slice(prefix.length))?.[0] ||
          ''
      }
      return (
        delimiter +
        prefix +
        formatText(body.slice(prefix.length), hasChinese(body), {
          comment: true,
        }) +
        suffix
      )
    }
    // A commented-out statement or an unquoted command example is still
    // technical content. Format only the explanatory prefix, if present.
    if (
      /^\s*(?:(?:export|const|let|var|return|import|include)\b|[A-Za-z_][\w.-]*\s*[:=]|[A-Za-z_][\w:.]*\s*\()/.test(
        body,
      )
    )
      return line
    const command = /^(.*?[：:][ \t]*)([A-Za-z][\w./-]*[^\r\n]*)$/.exec(body)
    if (command && /(?:\s-[\w-]|\$[({]|[|<>"'])/.test(command[2])) {
      body = formatText(command[1]) + command[2]
    } else body = formatText(body, hasChinese(body), { comment: true })
    const addSpace =
      /(?:\/\/|#|;|%|--|\/\*|<!--)$/.test(delimiter) &&
      body &&
      !/^\s/.test(body)
    return delimiter + (addSpace ? ' ' : '') + body + suffix
  })
}
