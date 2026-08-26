import { isElement } from 'hast-util-is-element'
import { visit } from 'unist-util-visit'

import type { Element, ElementContent, Text } from 'hast'
import type { Plugin } from 'unified'

const literalEmphasisPattern = /(\*{3}|\*{2}|\*)(?=\S)([^\n]*?\S)\1/g

const createText = (value: string): Text => ({ type: 'text', value })

const restoreLiteralEmphasis = (element: Element) => {
  if (element.tagName === 'code' || element.tagName === 'pre') {
    return
  }

  element.children = element.children.flatMap(child => {
    if (child.type === 'element') {
      restoreLiteralEmphasis(child)
      return [child]
    }

    if (child.type !== 'text') {
      return [child]
    }

    const replacements: ElementContent[] = []
    let lastIndex = 0

    for (const match of child.value.matchAll(literalEmphasisPattern)) {
      const index = match.index
      if (index > lastIndex) {
        replacements.push(createText(child.value.slice(lastIndex, index)))
      }

      const content = createText(match[2])
      const delimiterLength = match[1].length
      const emphasized: Element =
        delimiterLength === 1
          ? {
              type: 'element',
              tagName: 'em',
              properties: {},
              children: [content],
            }
          : delimiterLength === 2
            ? {
                type: 'element',
                tagName: 'strong',
                properties: {},
                children: [content],
              }
            : {
                type: 'element',
                tagName: 'em',
                properties: {},
                children: [
                  {
                    type: 'element',
                    tagName: 'strong',
                    properties: {},
                    children: [content],
                  },
                ],
              }

      replacements.push(emphasized)
      lastIndex = index + match[0].length
    }

    if (lastIndex === 0) {
      return [child]
    }

    if (lastIndex < child.value.length) {
      replacements.push(createText(child.value.slice(lastIndex)))
    }

    return replacements
  })
}

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
    if (!isElement(node) || node.tagName !== 'blockquote') {
      return
    }

    restoreLiteralEmphasis(node)

    const firstParagraph = node.children.find(
      child => isElement(child) && child.tagName === 'p',
    )
    if (!isElement(firstParagraph)) {
      return
    }

    const text = firstParagraph.children.find(child => child.type === 'text')
    if (!text || text.type !== 'text') {
      return
    }

    const matches = text.value.match(
      /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i,
    )
    if (!matches) {
      return
    }

    text.value = text.value.replace(matches[0], '')

    const markerParagraphIsEmpty = firstParagraph.children.every(child => {
      return child.type === 'text' && child.value.trim() === ''
    })
    if (markerParagraphIsEmpty) {
      node.children = node.children.filter(child => child !== firstParagraph)
    }

    node.tagName = 'Alert'
    node.properties = {
      ...node.properties,
      type: matches[1].toLowerCase(),
    }
  })
