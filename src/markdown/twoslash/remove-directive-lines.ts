import type { ShikiTransformer } from 'shiki'

const twoslashDirectivePattern = /^\s*\/\/\s*@(?:errors?|log|warn|annotate)\b/

/**
 * Twoslash replaces compiler and custom-tag directives with empty Shiki
 * lines. Capture their original line numbers before Twoslash preprocesses the
 * source, then remove both the empty line element and its newline token after
 * Twoslash has rendered its diagnostics.
 */
export const createTwoslashDirectiveLineTransformers = (): [
  ShikiTransformer,
  ShikiTransformer,
] => {
  const directiveLines = new WeakMap<object, number[]>()

  return [
    {
      name: 'capture-twoslash-directive-lines',
      preprocess(code) {
        const lines = code
          .split(/\r?\n/)
          .flatMap((line, index) =>
            twoslashDirectivePattern.test(line) ? [index] : [],
          )

        if (lines.length) directiveLines.set(this.meta, lines)
      },
    },
    {
      name: 'remove-twoslash-directive-lines',
      code(code) {
        const lines = directiveLines.get(this.meta)
        if (!lines) return

        for (const lineNumber of lines.toReversed()) {
          const line = this.lines[lineNumber]
          const index = code.children.indexOf(line)
          if (index < 0) continue

          const next = code.children[index + 1]
          if (next?.type === 'text' && next.value === '\n') {
            code.children.splice(index, 2)
            continue
          }

          const previous = code.children[index - 1]
          if (previous?.type === 'text' && previous.value === '\n') {
            code.children.splice(index - 1, 2)
            continue
          }

          code.children.splice(index, 1)
        }
      },
    },
  ]
}
