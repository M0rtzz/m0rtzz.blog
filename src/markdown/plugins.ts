import { isElement } from 'hast-util-is-element'
import { visit } from 'unist-util-visit'

import type { Text } from 'hast'
import type { Plugin } from 'unified'

export const findCodeText = (node: unknown): Text | null => {
  if (!isElement(node)) {
    return null
  }

  if (node.tagName === 'code') {
    return node.children[0] as Text
  }

  for (const child of node.children) {
    const text = findCodeText(child)
    if (text) {
      return text
    }
  }
  return null
}



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