import { isElement } from 'hast-util-is-element'
import { visit } from 'unist-util-visit'

import type { Text } from 'hast'
import type { Directives } from 'mdast-util-directive'
import type { Plugin } from 'unified'
import type { Node } from 'unist'

const isDirectiveNode = (node: Node): node is Directives => {
  const { type } = node
  return (
    type === 'textDirective' ||
    type === 'leafDirective' ||
    type === 'containerDirective'
  )
}

export const remarkDirectiveContainer: Plugin = () => tree =>
  visit(tree, node => {
    if (isDirectiveNode(node)) {
      if (node.name === 'code-group') {
        const childrenMeta = node.children.map(child => child.meta)
        node.data = {
          hName: 'CodeGroup',
          hProperties: {
            ...node.attributes,
            'data-children-meta': JSON.stringify(childrenMeta),
          },
        }
      } else if (node.name === 'details') {
        node.data = {
          hName: 'Details',
          hProperties: {
            ...node.attributes,
          },
        }
      }
    }
  })

export const rehypeGithubAlert: Plugin = () => tree =>
  visit(tree, node => {
    if (isElement(node)) {
      if (node.tagName === 'blockquote') {
        const firstParagraph = node.children.find(child => {
          return isElement(child) && child.tagName === 'p'
        })
        if (!isElement(firstParagraph)) {
          return
        }
        const text = firstParagraph.children[0] as Text
        const value = text.value
        if (!value) {
          return
        }
        const matches = value.match(/\[!(.+)]/)
        if (matches) {
          const type = matches[1].toLowerCase()
          text.value = value.replace(matches[0], '').trim()
          node.tagName = 'Alert'
          node.properties = {
            ...node.properties,
            type,
          }
        }
      }
    }
  })
