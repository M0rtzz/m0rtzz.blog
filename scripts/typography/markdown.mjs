import assert from 'node:assert/strict'

import GithubSlugger from 'github-slugger'
import { toHast } from 'mdast-util-to-hast'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { parseDocument, isScalar } from 'yaml'

import { codeEdits, codeSignature } from './code.mjs'
import { formatText, formatComment, hasChinese, needsSpace } from './text.mjs'

const base = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkFrontmatter)
const parser = base().use(remarkMdx)
const offsets = node => [node.position.start.offset, node.position.end.offset]
export function walk(node, visitor) {
  if (visitor(node) === false) return
  for (const child of node.children || []) walk(child, visitor)
}

export function applyEdits(source, edits) {
  const sorted = [...edits].sort((a, b) => a.start - b.start || a.end - b.end)
  let end = -1
  for (const edit of sorted) {
    if (
      edit.start < end ||
      edit.end < edit.start ||
      edit.start < 0 ||
      edit.end > source.length
    ) {
      throw new Error(
        `Overlapping/invalid source patches at offset ${edit.start}`,
      )
    }
    end = edit.end
  }
  for (const edit of sorted.reverse()) {
    source =
      source.slice(0, edit.start) + edit.replacement + source.slice(edit.end)
  }
  return source
}

function addEdit(edits, source, start, end, replacement, rule) {
  const old = source.slice(start, end)
  if (old === replacement) return
  // Minimize the patch, preserving source outside the actual change.
  let prefix = 0,
    suffix = 0
  while (
    prefix < old.length &&
    prefix < replacement.length &&
    old[prefix] === replacement[prefix]
  )
    prefix++
  while (
    suffix < old.length - prefix &&
    suffix < replacement.length - prefix &&
    old.at(-1 - suffix) === replacement.at(-1 - suffix)
  )
    suffix++
  edits.push({
    start: start + prefix,
    end: end - suffix,
    replacement: replacement.slice(prefix, replacement.length - suffix),
    rule,
  })
}

export function parseMarkdown(source) {
  const preliminary = base.parse(source)
  const protectedRanges = []
  walk(preliminary, node => {
    if (
      ['code', 'inlineCode', 'math', 'inlineMath', 'yaml'].includes(node.type)
    ) {
      protectedRanges.push(offsets(node))
      return false
    }
  })
  const masks = []
  const overlaps = (start, end) =>
    [...protectedRanges, ...masks.map(mask => [mask.start, mask.end])].some(
      ([left, right]) => start < right && end > left,
    )
  // remark-math does not recognize TeX's alternate delimiters. Protect them
  // explicitly before MDX's JavaScript expression parser sees their braces.
  for (const match of source.matchAll(
    /\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]|<!--[\s\S]*?-->/g,
  )) {
    const start = match.index,
      end = start + match[0].length
    if (overlaps(start, end)) continue
    if (source[start - 1] === '\\') continue
    masks.push({
      start,
      end,
      kind: match[0].startsWith('<!--') ? 'comment' : 'math',
    })
  }
  const maskSource = ranges =>
    applyEdits(
      source,
      ranges.map(mask => ({
        ...mask,
        replacement: source
          .slice(mask.start, mask.end)
          .replace(/[^\r\n]/g, mask.kind === 'comment' ? ' ' : 'x'),
      })),
    )
  let tree = parser.parse(maskSource(masks))
  // A comment-looking string inside JavaScript/JSX is not a prose comment.
  const expressions = []
  walk(tree, node => {
    if (
      ['mdxFlowExpression', 'mdxTextExpression', 'mdxjsEsm'].includes(node.type)
    )
      expressions.push(offsets(node))
    for (const attribute of node.attributes || [])
      if (attribute.position) expressions.push(offsets(attribute))
  })
  const actualMasks = masks.filter(
    mask =>
      !expressions.some(
        ([start, end]) => mask.start >= start && mask.end <= end,
      ),
  )
  if (actualMasks.length !== masks.length)
    tree = parser.parse(maskSource(actualMasks))
  return { tree, masks: actualMasks }
}

function visible(node) {
  if (['text', 'inlineCode', 'inlineMath'].includes(node.type))
    return node.value
  if (node.type === 'image') return '' // hast-util-to-string ignores image alt.
  return (node.children || []).map(visible).join('')
}

function edge(node, last) {
  if (node.type === 'inlineCode')
    return { char: last ? node.value.at(-1) : node.value[0], code: true }
  if (node.type === 'text')
    return { char: last ? node.value.at(-1) : node.value[0] }
  if (
    ['emphasis', 'strong', 'delete', 'link', 'linkReference'].includes(
      node.type,
    )
  ) {
    const child = last ? node.children.at(-1) : node.children[0]
    return child ? edge(child, last) : {}
  }
  return {}
}

function yamlDocument(source, node) {
  const [start, end] = offsets(node)
  const raw = source.slice(start, end)
  const header = /^---\r?\n/.exec(raw)
  if (!header) throw new Error('Unrecognized Front Matter delimiter')
  const yamlStart = start + header[0].length
  const yamlEnd = end - /(?:\r?\n)---$/.exec(raw)[0].length
  const document = parseDocument(source.slice(yamlStart, yamlEnd), {
    keepSourceTokens: true,
  })
  if (document.errors.length)
    throw new Error(document.errors.map(error => error.message).join('\n'))
  return { document, yamlStart }
}

function formatYaml(source, node, edits) {
  const { document, yamlStart } = yamlDocument(source, node)
  for (const key of ['title', 'summary']) {
    const value = document.get(key, true)
    if (value === undefined) continue
    if (!isScalar(value) || typeof value.value !== 'string')
      throw new Error(`Front Matter ${key} must be a string`)
    if (value.anchor || value.tag)
      throw new Error(
        `Front Matter ${key}: anchored/tagged scalars require manual review`,
      )
    let [start, end] = value.range
    start += yamlStart
    end += yamlStart
    if (['QUOTE_DOUBLE', 'QUOTE_SINGLE'].includes(value.type)) {
      start++
      end--
    }
    if (['BLOCK_FOLDED', 'BLOCK_LITERAL'].includes(value.type))
      start = source.indexOf('\n', start) + 1
    addEdit(
      edits,
      source,
      start,
      end,
      formatText(source.slice(start, end)),
      `frontmatter-${key}`,
    )
  }
}

function isTextAttribute(node, attribute) {
  return (
    typeof attribute.value === 'string' &&
    ((node.name === 'Details' && attribute.name === 'summary') ||
      (/^[a-z][a-z\d-]*$/.test(node.name || '') &&
        ['title', 'alt', 'aria-label'].includes(attribute.name)))
  )
}

function formatAttributes(source, node, edits) {
  for (const attribute of node.attributes || []) {
    if (!isTextAttribute(node, attribute)) continue
    const [start, end] = offsets(attribute)
    const raw = source.slice(start, end)
    const match = /=\s*(["'])([\s\S]*)\1$/.exec(raw)
    if (!match) throw new Error('Cannot map a static MDX attribute to source')
    const valueStart = start + match.index + match[0].indexOf(match[1]) + 1
    addEdit(
      edits,
      source,
      valueStart,
      end - 1,
      formatText(match[2]),
      'static-attribute',
    )
  }
}

function codeMapping(source, node) {
  const [start, end] = offsets(node)
  const raw = source.slice(start, end)
  const lines = [...raw.matchAll(/([^\r\n]*)(\r?\n|$)/g)].filter(
    match => match[0],
  )
  const fenced = /^[ \t]*[`~]{3}/.test(lines[0]?.[1] || '')
  const valueLines = node.value.split('\n')
  let valueOffset = 0
  const mapping = []
  for (let i = 0; i < valueLines.length; i++) {
    const line = lines[i + (fenced ? 1 : 0)]
    if (!line || !line[1].endsWith(valueLines[i])) {
      if (!node.value) return []
      throw new Error(
        `Cannot safely map code line ${node.position.start.line + i} to original source`,
      )
    }
    mapping.push({
      valueOffset,
      sourceOffset: start + line.index + line[1].length - valueLines[i].length,
      length: valueLines[i].length,
    })
    valueOffset += valueLines[i].length + 1
  }
  return mapping
}

async function formatCode(source, node, edits, warnings) {
  const changes = await codeEdits(node.value, node.lang)
  if (changes === null) {
    warnings.push({
      offset: node.position.start.offset,
      rule: 'code-coverage',
      message: `代码块 ${node.lang || '(无语言)'} 不支持可靠的注释识别，已原样保留。`,
    })
    return
  }
  if (!changes.length) return
  const mapping = codeMapping(source, node)
  for (const change of changes) {
    const line = mapping.find(
      item =>
        change.start >= item.valueOffset &&
        change.end <= item.valueOffset + item.length,
    )
    if (!line)
      throw new Error('Comment patch crosses an unmappable source line')
    const start = line.sourceOffset + change.start - line.valueOffset
    addEdit(
      edits,
      source,
      start,
      start + change.end - change.start,
      change.replacement,
      change.rule,
    )
  }
}

function formatTextNode(source, node, masks, edits, chineseContext) {
  const [start, end] = offsets(node)
  const excluded = masks.filter(mask => mask.start < end && mask.end > start)
  let cursor = start
  const formatRange = (left, right) => {
    const raw = source.slice(left, right)
    // A multiline text node includes blockquote/list prefixes in its source,
    // even though its decoded AST value doesn't. Never format those prefixes.
    for (const match of raw.matchAll(/[^\r\n]+/g)) {
      let offset = left + match.index
      let line = match[0]
      if (offset > start && source[offset - 1] === '\n') {
        const prefix = /^[ \t]*(?:>[ \t]*)*/.exec(line)[0]
        offset += prefix.length
        line = line.slice(prefix.length)
      }
      addEdit(
        edits,
        source,
        offset,
        offset + line.length,
        formatText(line, chineseContext),
        'prose-typography',
      )
    }
  }
  for (const mask of excluded.sort((a, b) => a.start - b.start)) {
    formatRange(cursor, Math.max(cursor, mask.start))
    cursor = Math.max(cursor, mask.end)
  }
  formatRange(cursor, end)
}

function boundaryEdits(source, node, edits, chineseContext) {
  const children = node.children || []
  for (let i = 1; i < children.length; i++) {
    const left = children[i - 1],
      right = children[i]
    if (left.position.end.offset !== right.position.start.offset) continue
    const a = edge(left, true),
      b = edge(right, false)
    if (right.type === 'text' && a.char && !/\s/.test(a.char)) {
      const leading = /^[ \t]+(?=[，。；：！？）”’])/.exec(
        formatText(right.value, chineseContext),
      )?.[0]
      if (leading)
        edits.push({
          start: right.position.start.offset,
          end: right.position.start.offset + leading.length,
          replacement: '',
          rule: 'punctuation-boundary-space',
        })
    }
    if (left.type === 'text' && b.char && !/\s/.test(b.char)) {
      const trailing = /[，。；：！？（“‘]([ \t]+)$/.exec(
        formatText(left.value, chineseContext),
      )?.[1]
      if (trailing)
        edits.push({
          start: left.position.end.offset - trailing.length,
          end: left.position.end.offset,
          replacement: '',
          rule: 'punctuation-boundary-space',
        })
    }
    if (needsSpace(a.char, b.char, a.code, b.code)) {
      edits.push({
        start: right.position.start.offset,
        end: right.position.start.offset,
        replacement: ' ',
        rule: 'inline-boundary-space',
      })
    }
  }
}

// Mirrors rehypeGithubAlert's literal-emphasis recovery before rehype-slug.
function headingText(node) {
  const hast = toHast(node)
  const text = (item, inCode = false) => {
    if (item.type === 'text')
      return inCode
        ? item.value
        : item.value.replace(/(\*{3}|\*{2}|\*)(?=\S)([^\n]*?\S)\1/g, '$2')
    return (item.children || [])
      .map(child => text(child, inCode || item.tagName === 'code'))
      .join('')
  }
  return text(hast)
}

export function headingInfo(source) {
  const { tree } = parseMarkdown(source)
  const slugger = new GithubSlugger()
  const headings = [],
    ids = []
  walk(tree, node => {
    if (node.type === 'heading')
      headings.push({
        slug: slugger.slug(headingText(node)),
        offset: node.position.start.offset,
      })
    if (node.type.startsWith('mdxJsx')) {
      for (const attribute of node.attributes || []) {
        if (attribute.name === 'id' && typeof attribute.value === 'string')
          ids.push({ id: attribute.value, offset: node.position.start.offset })
      }
    }
  })
  return { headings, ids }
}

export function preserveAnchors(before, after) {
  const oldInfo = headingInfo(before),
    newInfo = headingInfo(after)
  if (oldInfo.headings.length !== newInfo.headings.length)
    throw new Error('Heading count changed')
  const occupied = new Map()
  for (const item of [
    ...newInfo.headings.map(h => ({ id: h.slug, offset: h.offset })),
    ...newInfo.ids,
  ]) {
    if (occupied.has(item.id))
      throw new Error(`重复或冲突的章节 ID：${item.id}`)
    occupied.set(item.id, item.offset)
  }
  const edits = [],
    aliases = new Map()
  const newline = after.includes('\r\n') ? '\r\n' : '\n'
  oldInfo.headings.forEach((heading, index) => {
    const target = newInfo.headings[index]
    if (heading.slug === target.slug) return
    if (occupied.has(heading.slug))
      throw new Error(`旧锚点与现有 ID 冲突：${heading.slug}`)
    // Aliases inside quoted/list headings need their own container prefix.
    const lineStart = after.lastIndexOf('\n', target.offset - 1) + 1
    const prefix = after.slice(lineStart, target.offset)
    if (!/^[ \t>]*$/.test(prefix))
      throw new Error(`列表内标题锚点需要人工处理：${heading.slug}`)
    const escaped = heading.slug
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
    edits.push({
      start: lineStart,
      end: lineStart,
      replacement: `${prefix}<a id="${escaped}"></a>${newline}${prefix.trimEnd()}${newline}`,
      rule: 'legacy-heading-anchor',
    })
    aliases.set(heading.slug, target.slug)
    occupied.set(heading.slug, target.offset)
  })
  return { source: applyEdits(after, edits), aliases, edits }
}

async function signature(source) {
  const { tree, masks } = parseMarkdown(source)
  const result = []
  async function visit(node) {
    if (node.type === 'yaml') {
      const { document } = yamlDocument(source, node)
      const value = document.toJS()
      for (const field of ['title', 'summary'])
        if (field in value)
          value[field] = { type: document.get(field, true).type }
      result.push(['yaml', value])
      return
    }
    if (node.type === 'code') {
      result.push([
        'code',
        node.lang,
        node.meta,
        await codeSignature(node.value, node.lang),
      ])
      return
    }
    if (['inlineCode', 'math', 'inlineMath', 'mdxjsEsm'].includes(node.type)) {
      result.push([node.type, node.value])
      return
    }
    if (
      node.type === 'mdxFlowExpression' ||
      node.type === 'mdxTextExpression'
    ) {
      result.push([
        node.type,
        /^\s*\/\*[\s\S]*\*\/\s*$/.test(node.value)
          ? formatComment(node.value)
          : node.value,
      ])
      return
    }
    if (['link', 'image', 'definition'].includes(node.type))
      result.push([node.type, node.url, node.title])
    if (['linkReference', 'imageReference'].includes(node.type))
      result.push([node.type, node.identifier])
    if (node.type.startsWith('mdxJsx')) {
      if (
        node.name === 'a' &&
        node.attributes?.length === 1 &&
        node.attributes[0].name === 'id' &&
        !node.children.length
      )
        return
      result.push([
        node.type,
        node.name,
        node.attributes.map(attribute => [
          attribute.name,
          isTextAttribute(node, attribute)
            ? 'TEXT'
            : typeof attribute.value === 'object'
              ? attribute.value?.value
              : attribute.value,
        ]),
      ])
    }
    if (
      [
        'heading',
        'list',
        'listItem',
        'table',
        'tableRow',
        'tableCell',
        'blockquote',
        'thematicBreak',
      ].includes(node.type)
    )
      result.push([
        node.type,
        node.depth,
        node.ordered,
        node.start,
        node.checked,
        node.align,
        'open',
      ])
    for (const child of node.children || []) await visit(child)
    if (
      [
        'heading',
        'list',
        'listItem',
        'table',
        'tableRow',
        'tableCell',
        'blockquote',
        'thematicBreak',
      ].includes(node.type)
    )
      result.push([node.type, 'close'])
  }
  await visit(tree)
  result.push(
    masks.map(mask => [
      mask.kind,
      mask.kind === 'math'
        ? source.slice(mask.start, mask.end)
        : formatComment(source.slice(mask.start, mask.end)),
    ]),
  )
  return result
}

export async function formatMarkdown(source) {
  const { tree, masks } = parseMarkdown(source)
  const edits = [],
    warnings = []
  async function visit(node, chineseContext = false) {
    if (['paragraph', 'heading', 'tableCell'].includes(node.type))
      chineseContext = hasChinese(visible(node))
    if (node.type === 'yaml') {
      formatYaml(source, node, edits)
      return
    }
    if (node.type === 'code') {
      await formatCode(source, node, edits, warnings)
      return
    }
    if (node.type === 'text') {
      formatTextNode(source, node, masks, edits, chineseContext)
      return
    }
    if (node.type === 'image' || node.type === 'imageReference') {
      const [start, end] = offsets(node)
      const raw = source.slice(start, end)
      const alt = /^!\[([^\]\r\n]*)\]/.exec(raw)
      if (
        alt &&
        hasChinese(alt[1]) &&
        !/^(?:image|screenshot|屏幕截图|截图)[-_\s]?\d/i.test(alt[1]) &&
        !/\.(?:png|jpe?g|webp|gif)$/i.test(alt[1])
      ) {
        addEdit(
          edits,
          source,
          start + 2,
          start + 2 + alt[1].length,
          formatText(alt[1]),
          'image-description',
        )
      }
      return
    }
    if (
      node.type === 'mdxFlowExpression' ||
      node.type === 'mdxTextExpression'
    ) {
      const [start, end] = offsets(node)
      const raw = source.slice(start, end)
      if (/^\{\/\*[\s\S]*\*\/\}$/.test(raw))
        addEdit(
          edits,
          source,
          start + 1,
          end - 1,
          formatComment(raw.slice(1, -1)),
          'mdx-comment',
        )
      return
    }
    if (node.type.startsWith('mdxJsx')) {
      if (['script', 'style', 'pre', 'code'].includes(node.name)) return
      formatAttributes(source, node, edits)
    }
    // Autolinks display their destination. Their label is technical data.
    if (
      node.type === 'link' &&
      node.children.length === 1 &&
      node.children[0].type === 'text' &&
      (node.children[0].value === node.url ||
        node.url === `mailto:${node.children[0].value}`)
    )
      return
    boundaryEdits(source, node, edits, chineseContext)
    for (const child of node.children || []) await visit(child, chineseContext)
  }
  await visit(tree)
  for (const mask of masks)
    if (mask.kind === 'comment') {
      addEdit(
        edits,
        source,
        mask.start,
        mask.end,
        formatComment(source.slice(mask.start, mask.end)),
        'html-comment',
      )
    }
  const formatted = applyEdits(source, edits)
  assert.deepEqual(
    await signature(formatted),
    await signature(source),
    'Protected content or document structure changed',
  )
  const anchored = preserveAnchors(source, formatted)
  assert.deepEqual(
    await signature(anchored.source),
    await signature(formatted),
    'Anchor insertion changed document structure',
  )
  return {
    source: anchored.source,
    edits,
    anchorEdits: anchored.edits,
    aliases: anchored.aliases,
    warnings,
  }
}
