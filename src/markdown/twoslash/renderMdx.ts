import {
  rendererRich,
  type RendererRichOptions,
  type TwoslashRenderer,
} from '@shikijs/twoslash'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { defaultHandlers, toHast } from 'mdast-util-to-hast'

import type { Element, ElementContent, Text } from 'hast'
import type { ShikiTransformerContextCommon } from 'shiki'

function compose(parts: { popup: Element; token: Element | Text }): Element[] {
  return [
    {
      children: [parts.token],
      properties: {},
      tagName: 'span',
      type: 'element',
    },
    {
      children: [parts.popup],
      properties: {},
      tagName: 'TwoslashTooltip',
      type: 'element',
    },
  ]
}

export function rendererMdx(
  options: RendererRichOptions = {},
): TwoslashRenderer {
  const { errorRendering = 'line' } = options

  const hoverBasicProps = {
    class: 'twoslash-hover',
  }

  const rich = rendererRich({
    ...options,
    customTagIcons: {
      annotate: {
        children: [],
        properties: {
          class: 'size-4 text-green-600',
        },
        tagName: 'IconBulb',
        type: 'element',
      },
      error: {
        children: [],
        properties: {
          class: 'size-4 text-red-500',
        },
        tagName: 'IconBug',
        type: 'element',
      },
      log: {
        children: [],
        properties: {
          class: 'size-4 text-blue-500',
        },
        tagName: 'IconInfoSquareRounded',
        type: 'element',
      },
      warn: {
        children: [],
        properties: {
          class: 'size-4 text-yellow-600',
        },
        tagName: 'IconAlertTriangle',
        type: 'element',
      },
    },
    hast: {
      completionCompose({ cursor, popup }) {
        return [
          <Element>{
            children: [
              cursor,
              {
                children: [popup],
                properties: {
                  noArrow: true,
                },
                tagName: 'TwoslashTooltip',
                type: 'element',
              },
            ],
            properties: {
              open: true,
            },
            tagName: 'TwoslashTrigger',
            type: 'element',
          },
        ]
      },
      completionCursor: {
        class: 'h-5 w-0.5 bg-blue-600 align-text-bottom',
      },
      errorCompose: compose,
      errorToken:
        errorRendering === 'line'
          ? undefined
          : {
              properties: {
                ...hoverBasicProps,
                class: 'twoslash-error twoslash-error-hover',
              },
              tagName: 'TwoslashTrigger',
            },
      hoverCompose: compose,
      hoverToken: {
        properties: hoverBasicProps,
        tagName: 'TwoslashTrigger',
      },
      popupDocs: {
        class: `px-3 py-2`,
      },
      popupDocsTags: {
        class: `px-3 py-2 space-y-1`,
      },
      popupTypes: {
        class: 'block px-3 py-1 [&~*]:border-t',
      },
      queryCompose: compose,
      queryToken: {
        properties: {
          ...hoverBasicProps,
          open: true,
        },
        tagName: 'TwoslashTrigger',
      },
    },
    renderMarkdown,
    renderMarkdownInline,
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
              children: this.codeToHast(node.value, {
                ...this.options,
                lang,
                structure: node.value.trim().includes('\n')
                  ? 'classic'
                  : 'inline',
                transformers: [],
              }).children,
              properties: {},
              tagName: 'code',
              type: 'element',
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
  if (context === 'tag:param') {
    md = md.replace(/^([\w$-]+)/, '`$1` ')
  }

  const children = renderMarkdown.call(this, md)
  if (
    children.length === 1 &&
    children[0].type === 'element' &&
    children[0].tagName === 'p'
  ) {
    return children[0].children
  }
  return children
}
