import { dirname, resolve } from 'node:path'

import { parseMarkdown, walk, applyEdits } from './markdown.mjs'

const siteHosts = new Set(['www.m0rtzz.com', 'm0rtzz.com'])

export function updateLinks(documents) {
  const byPath = new Map(
    documents.map(document => [resolve(document.path), document]),
  )
  const byNumber = new Map(
    documents
      .filter(document => document.discussionNumber)
      .map(document => [String(document.discussionNumber), document]),
  )
  for (const document of documents) {
    const source = document.result.source
    const edits = []
    const { tree } = parseMarkdown(source)
    walk(tree, node => {
      if (
        !['link', 'definition'].includes(node.type) ||
        !node.url.includes('#')
      )
        return
      const hashIndex = node.url.indexOf('#')
      const address = node.url.slice(0, hashIndex)
      let oldSlug
      try {
        oldSlug = decodeURIComponent(node.url.slice(hashIndex + 1))
      } catch {
        return
      }
      let target
      if (!address) target = document
      else if (
        !/^[a-z][\w+.-]*:|^\/\//i.test(address) &&
        /\.mdx?$/i.test(address)
      ) {
        target = byPath.get(
          resolve(dirname(document.path), decodeURIComponent(address)),
        )
      } else {
        let url
        try {
          url = new URL(address, 'https://www.m0rtzz.com')
        } catch {
          return
        }
        if (!siteHosts.has(url.hostname)) return
        const match = /^\/posts\/(\d+)\/?$/.exec(url.pathname)
        if (match) target = byNumber.get(match[1])
      }
      const slug = target?.result.aliases.get(oldSlug)
      if (!slug) return
      const raw = source.slice(
        node.position.start.offset,
        node.position.end.offset,
      )
      const index = raw.lastIndexOf(node.url)
      if (index < 0)
        throw new Error(`Cannot safely map chapter URL: ${node.url}`)
      // Preserve the existing URL encoding convention.
      const fragment = /%[\da-f]{2}/i.test(node.url.slice(hashIndex + 1))
        ? encodeURIComponent(slug)
        : slug
      const start = node.position.start.offset + index + hashIndex + 1
      edits.push({
        start,
        end: start + node.url.length - hashIndex - 1,
        replacement: fragment,
        rule: 'chapter-link',
      })
    })
    document.result.source = applyEdits(source, edits)
    document.result.linkEdits = edits
  }
}
