import path from 'node:path'

import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers'
import { transformerTwoslash } from '@shikijs/twoslash'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypeDefaultCodeLang } from 'rehype-default-code-lang'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { MDX, type MDXProps } from 'rsc-mdx'
import { createHighlighter } from 'shiki/bundle/full'

import { rehypeGithubAlert, findCodeText } from './plugins'
import { rendererMdx } from './twoslash/renderMdx'

import type { RehypeShikiOptions } from '@shikijs/rehype'
import type { ShikiTransformer } from 'shiki'

interface MarkdownProps {
  source: string
  useMDXComponents?: MDXProps['useMDXComponents']
  signalReady?: boolean
}

const highlighter = await createHighlighter({
  // Keep server startup fast while covering every language currently used by
  // the local posts. Shiki still accepts aliases such as `txt` and `shell`.
  langs: [
    'asm',
    'bash',
    'c',
    'cmake',
    'cpp',
    'css',
    'html',
    'ini',
    'javascript',
    'js',
    'json',
    'make',
    'makefile',
    'markdown',
    'nginx',
    'python',
    'shell',
    'shellscript',
    'ssh-config',
    'tex',
    'toml',
    'ts',
    'typescript',
    'xml',
    'yaml',
    'yml',
  ],
  themes: ['catppuccin-latte', 'material-theme-ocean'],
})

const transformerCodeContent: ShikiTransformer = {
  name: 'rehype-shiki:code-content',
  pre(node) {
    node.properties.content = this.source
  },
}

export async function Markdown(props: MarkdownProps) {
  const { source, useMDXComponents, signalReady } = props
  const compiled = await MDX({
    source,
    useMDXComponents,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
        rehypeAutolinkHeadings,
        rehypeGithubAlert,
        rehypeKatex,
        rehypeSlug,
        remarkMath,
        [
          rehypeDefaultCodeLang,
          {
            defaultLang: 'txt',
          },
        ],
        [
          rehypeShikiFromHighlighter,
          highlighter,
          {
            parseMetaString: (meta, node) => {
              const metaData = meta.split(' ')
              const fileName = metaData.find(item => path.extname(item) !== '')
              const codeText = findCodeText(node)

              return {
                'data-file': fileName,
                content: codeText?.value,
              }
            },
            addLanguageClass: true,
            themes: {
              light: 'catppuccin-latte',
              dark: 'material-theme-ocean',
            },
            transformers: [
              transformerCodeContent,
              transformerNotationDiff(),
              transformerNotationHighlight(),
              transformerNotationWordHighlight(),
              transformerNotationFocus(),
              transformerNotationErrorLevel(),
              transformerMetaHighlight(),
              transformerMetaWordHighlight(),
              // transformerRemoveLineBreak(),
              transformerTwoslash({
                renderer: rendererMdx(),
                explicitTrigger: true,
              }),
            ],
          } as RehypeShikiOptions,
        ],
    ],
  })

  // Only articles need a marker for their whole-page reveal gate.
  return signalReady ? <>{compiled}<span data-markdown-ready hidden /></> : compiled
}
