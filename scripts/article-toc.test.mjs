import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'

import { fromMarkdown } from 'mdast-util-from-markdown'
import { toc } from 'mdast-util-toc'
import * as React from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

const source = await readFile(
  new URL('../src/app/(article)/posts/[id]/toc.tsx', import.meta.url),
  'utf8',
)
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
  },
}).outputText

function renderOutline(markdown, activeId) {
  const exports = {}
  runInNewContext(compiled, {
    exports,
    require(name) {
      if (name === 'react') return React
      if (name === 'react/jsx-runtime') return jsxRuntime
      if (name === '@/components/ui/collapsible') {
        // Keep every branch visible to inspect the renderer's depth mapping.
        return {
          Collapsible: ({ children }) => children,
          CollapsibleContent: ({ children }) => children,
        }
      }
      assert.equal(name, './article-navigation')
      return {
        decodeHash: hash => decodeURIComponent(hash.slice(1)),
        useArticleNavigation: () => ({ activeId, navigate: () => true }),
      }
    },
  })
  const html = renderToStaticMarkup(
    React.createElement(exports.TOCClient, {
      toc: [toc(fromMarkdown(markdown)), new Map()],
    }),
  )
  const links = Array.from(html.matchAll(/<a\b[^>]*>/g), ([tag]) => ({
    href: tag.match(/href="([^"]+)"/)[1],
    depth: Number(tag.match(/data-toc-depth="(\d+)"/)[1]),
    active: tag.includes('aria-current="location"'),
  }))
  return { html, links }
}

test('exposes a distinct nesting depth for each of the six supported heading levels', () => {
  const markdown = Array.from(
    { length: 6 },
    (_, index) => `${'#'.repeat(index + 1)} Level ${index + 1}`,
  ).join('\n\n')
  const { html, links } = renderOutline(markdown, 'level-6')
  assert.deepEqual(
    links.map(link => link.depth),
    [1, 2, 3, 4, 5, 6],
  )
  assert.deepEqual(
    links.filter(link => link.active).map(link => link.href),
    ['#level-6'],
  )
  assert.equal((html.match(/role="list"/g) ?? []).length, 6)
})

test('depth follows the outline nesting when the article starts at H2', () => {
  const { links } = renderOutline('## Root\n\n### Child\n\n#### Leaf', 'leaf')
  assert.deepEqual(
    links.map(link => link.depth),
    [1, 2, 3],
  )
})

test('sibling branches keep their own depth instead of inheriting the previous leaf depth', () => {
  const { links } = renderOutline(
    '# Root\n\n## First\n\n### Child\n\n#### Leaf\n\n## Second\n\n### Another',
    'another',
  )
  assert.deepEqual(
    links.map(link => link.depth),
    [1, 2, 3, 4, 2, 3],
  )
  assert.deepEqual(
    links.filter(link => link.active).map(link => link.href),
    ['#another'],
  )
})
