import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

import { renderToStaticMarkup } from 'react-dom/server'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { MDX } from 'rsc-mdx'
import ts from 'typescript'

import { formatMarkdown, headingInfo } from './markdown.mjs'

// Exercise the actual website's emphasis/Alert plugin, not a second mock of
// its behavior. Transpile in memory so the test never writes compiled files.
const source = await readFile(
  new URL('../../src/markdown/plugins.ts', import.meta.url),
  'utf8',
)
const compiled = ts
  .transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  })
  .outputText.replace(
    /from '([^']+)'/g,
    (_, name) => `from '${import.meta.resolve(name)}'`,
  )
const { rehypeGithubAlert } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)

async function render(source) {
  const headings = [],
    emphasis = []
  const text = node =>
    node.type === 'text' ? node.value : (node.children || []).map(text).join('')
  const element = await MDX({
    source,
    // Only typography/MDX structure is under test; the site's client-side
    // Alert UI is represented by its unchanged children.
    useMDXComponents: () => ({ Alert: ({ children }) => children }),
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeGithubAlert,
      rehypeKatex,
      rehypeSlug,
      () => tree => {
        const visit = node => {
          if (node.type === 'element') {
            if (/^h[1-6]$/.test(node.tagName)) headings.push(node.properties.id)
            if (['strong', 'em', 'del'].includes(node.tagName))
              emphasis.push([node.tagName, text(node).replace(/\s/g, '')])
          }
          node.children?.forEach(visit)
        }
        visit(tree)
      },
    ],
  })
  return { html: renderToStaticMarkup(element), headings, emphasis }
}

test('real MDX rendering: legacy and new anchors are both present, duplicate slugs agree', async () => {
  const original =
    '# 中文English\n\n## 中文English\n\n### `原文Code`和**English**\n'
  const result = await formatMarkdown(original)
  const rendered = await render(result.source)
  assert.deepEqual(
    rendered.headings,
    headingInfo(result.source).headings.map(heading => heading.slug),
  )
  for (const [oldSlug, newSlug] of result.aliases) {
    assert.ok(rendered.html.includes(`id="${oldSlug}"`))
    assert.ok(rendered.html.includes(`id="${newSlug}"`))
  }
})

test('real emphasis recovery: formatting preserves the existing emphasis ranges', async () => {
  const source =
    '> ***除Conda环境外，***请尽量将***个人代码和Checkpoint*** 放在 `/nas/Users/${USER}` 中。\n\n中文**English**中文\n'
  const before = await render(source)
  const after = await render((await formatMarkdown(source)).source)
  assert.deepEqual(after.emphasis, before.emphasis)
  // Do not silently repair the renderer's pre-existing handling of ambiguous
  // delimiter runs; this formatter promises to preserve the visible ranges.
})

test('review regressions: escaped braces, inline technical notation and legacy variable heading', async () => {
  const source = [
    '<a id="设置home下的文件夹为英文"></a>',
    '',
    '### 设置 `${HOME}` 下的文件夹为英文',
    '',
    '程序接口\\{系统调用\\}',
    '',
    '> [!NOTE]',
    '> 执行 `x.wait()` 后检查 `(i, j)`。',
    '',
    '```bash',
    '# The Focal patches support 5.4, 5.8, 5.11 （Ubuntu 20.04，`uname -r` 查看版本）',
    '# @brief: 占用 `./hdc/` 的进程',
    '#################################分割线#################################',
    '```',
    '',
  ].join('\n')
  assert.equal((await formatMarkdown(source)).source, source)
  const rendered = await render(source)
  assert.ok(rendered.html.includes('程序接口{系统调用}'))
  assert.ok(rendered.html.includes('<code>x.wait()</code>'))
  assert.ok(rendered.html.includes('<code>(i, j)</code>'))
  assert.ok(rendered.html.includes('id="设置home下的文件夹为英文"'))
  assert.ok(rendered.html.includes('id="设置-home-下的文件夹为英文"'))
  assert.ok(rendered.html.includes('5.4, 5.8, 5.11'))
  assert.ok(
    rendered.html.includes(
      '#################################分割线#################################',
    ),
  )
})
