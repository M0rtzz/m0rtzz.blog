import { rendererRich } from '@shikijs/twoslash'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { defaultHandlers, toHast } from 'mdast-util-to-hast'

import type { RendererRichOptions, TwoslashRenderer } from '@shikijs/twoslash'
import type { Element, ElementContent, Text } from 'hast'
import type { ShikiTransformerContextCommon } from 'shiki'

export function rendererMdx(
  options: RendererRichOptions = {},
): TwoslashRenderer {
  const { errorRendering = 'line' } = options

  const hoverBasicProps = {
    class: 'twoslash-hover',
  }

  function compose(parts: {
    token: Element | Text
    popup: Element
  }): Element[] {
    return [
      {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [parts.token],
      },
      {
        type: 'element',
        tagName: 'TwoslashTooltip',
        properties: {},
        children: [parts.popup],
      },
    ]
  }

  const rich = rendererRich({
    ...options,
    customTagIcons: {
      log: {
        type: 'element',
        tagName: 'IconInfoSquareRounded',
        properties: {
          class: 'size-4 text-blue-500',
        },
        children: [],
      },
      error: {
        type: 'element',
        tagName: 'IconBug',
        properties: {
          class: 'size-4 text-red-500',
        },
        children: [],
      },
      warn: {
        type: 'element',
        tagName: 'IconAlertTriangle',
        properties: {
          class: 'size-4 text-yellow-600',
        },
        children: [],
      },
      annotate: {
        type: 'element',
        tagName: 'IconBulb',
        properties: {
          class: 'size-4 text-green-600',
        },
        children: [],
      },
    },
    renderMarkdown,
    renderMarkdownInline,
    hast: {
      hoverToken: {
        tagName: 'TwoslashTrigger',
        properties: hoverBasicProps,
      },
      hoverCompose: compose,
      queryToken: {
        tagName: 'TwoslashTrigger',
        properties: {
          ...hoverBasicProps,
          open: true,
        },
      },
      queryCompose: compose,
      popupTypes: {
        class: 'block px-3 py-1 [&~*]:border-t',
      },
      popupDocs: {
        class: `px-3 py-2`,
      },
      popupDocsTags: {
        class: `px-3 py-2 space-y-1`,
      },
      errorToken:
        errorRendering === 'line'
          ? undefined
          : {
              tagName: 'TwoslashTrigger',
              properties: {
                ...hoverBasicProps,
                class: 'twoslash-error twoslash-error-hover',
              },
            },
      errorCompose: compose,
      completionCursor: {
        class: 'h-5 w-0.5 bg-blue-600 align-text-bottom',
      },
      completionCompose({ popup, cursor }) {
        return [
          <Element>{
            type: 'element',
            tagName: 'TwoslashTrigger',
            properties: {
              open: true,
            },
            children: [
              cursor,
              {
                type: 'element',
                tagName: 'TwoslashTooltip',
                properties: {
                  noArrow: true,
                },
                children: [popup],
              },
            ],
          },
        ]
      },
    },
  })

  return rich
}

function renderMarkdown(
  this: ShikiTransformerContextCommon,
  md: string,
): ElementContent[] {
  const mdast = fromMarkdown(
    md.replace(/\{@link ([^}]*)\}/g, '$1'), // replace jsdoc links
    { mdastExtensions: [gfmFromMarkdown()] },
  )

  return (
    toHast(mdast, {
      handlers: {
        code: (state, node) => {
          const lang = node.lang || ''
          if (lang) {
            return <Element>{
              type: 'element',
              tagName: 'code',
              properties: {},
              children: this.codeToHast(node.value, {
                ...this.options,
                transformers: [],
                lang,
                structure: node.value.trim().includes('\n')
                  ? 'classic'
                  : 'inline',
              }).children,
            }
          }
          return defaultHandlers.code(state, node)
        },
      },
    }) as Element
  ).children
}

function renderMarkdownInline(
  this: ShikiTransformerContextCommon,
  md: string,
  context?: string,
): ElementContent[] {
  if (context === 'tag:param') md = md.replace(/^([\w$-]+)/, '`$1` ')

  const children = renderMarkdown.call(this, md)
  if (
    children.length === 1 &&
    children[0].type === 'element' &&
    children[0].tagName === 'p'
  )
    return children[0].children
  return children
}
