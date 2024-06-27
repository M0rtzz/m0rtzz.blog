import path from 'node:path'

import rehypeShiki, { type RehypeShikiOptions } from '@shikijs/rehype'
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

import { rehypeGithubAlert, findCodeText } from './plugins'
import { rendererMdx } from './twoslash/renderMdx'

interface MarkdownProps {
  source: string
  useMDXComponents?: MDXProps['useMDXComponents']
}

export async function Markdown(props: MarkdownProps) {
  const { source, useMDXComponents } = props
  return (
    <MDX
      source={source}
      useMDXComponents={useMDXComponents}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeAutolinkHeadings,
        rehypeGithubAlert,
        rehypeKatex,
        rehypeSlug,
        remarkMath,
        [
          rehypeDefaultCodeLang,
          {
            defaultLang: 'text',
          },
        ],
        [
          rehypeShiki,
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
            themes: {
              light: 'catppuccin-latte',
              dark: 'material-theme-ocean',
            },
            transformers: [
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
      ]}
    />
  )
}
