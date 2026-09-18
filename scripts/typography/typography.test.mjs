import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import { codeEdits } from './code.mjs'
import { runTypography } from './index.mjs'
import { updateLinks } from './links.mjs'
import {
  applyEdits,
  formatMarkdown,
  headingInfo,
  preserveAnchors,
} from './markdown.mjs'
import { formatText, formatComment } from './text.mjs'

async function format(source) {
  const result = await formatMarkdown(source)
  assert.equal(
    (await formatMarkdown(result.source)).source,
    result.source,
    'Formatting must be idempotent',
  )
  return result.source
}

async function code(source, language) {
  return applyEdits(source, (await codeEdits(source, language)) || [])
}

test('Chinese spacing, width and contextual punctuation, without spelling corrections', () => {
  assert.equal(
    formatText('中文English,有3台(测试)! "名称"'),
    '中文 English，有 3 台（测试）！“名称”',
  )
  assert.equal(
    formatText('English (only), don\'t change: "github"!'),
    'English (only), don\'t change: "github"!',
  )
  assert.equal(formatText('中文ＡＢＣ１２３测试'), '中文 ABC123 测试')
  assert.equal(
    formatText('使用github和javascript'),
    '使用 github 和 javascript',
  )
  assert.equal(
    formatText('  中文English  \r\n\t下一line\t'),
    '  中文 English  \r\n\t下一 line\t',
  )
})

test('technical identifiers, paths, variables, URLs and inline literals', () => {
  for (const literal of [
    'https://example.com/a?q=中文English',
    'foo_bar',
    '/path/中文',
    '${HOME}/.cache',
    'host.docker.internal',
    '--foo-bar',
    'test@example.com',
    '`中文English`',
  ]) {
    assert.ok(formatText(`使用${literal}测试`).includes(literal), literal)
  }
  assert.equal(
    formatText('输入/输出，会议/出版，奖/惩'),
    '输入/输出，会议/出版，奖/惩',
  )
  assert.equal(
    formatText('下载.iso镜像，别忘了./，谢谢 :)'),
    '下载 .iso 镜像，别忘了 ./，谢谢 :)',
  )
  assert.equal(
    formatText('设备I/O操作，TCP/IP协议'),
    '设备 I/O 操作，TCP/IP 协议',
  )
  assert.ok(formatText('三元组\\<S,F,G\\>').includes('\\<S,F,G\\>'))
  assert.ok(
    formatText('公式 $\\text{中文English}$').includes('$\\text{中文English}$'),
  )
})

test('all Alert types, quotes, lists, tables and emphasis boundaries', async () => {
  const source =
    ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION']
      .map(type => `> [!${type}]\n> 中文**English**中文,有2项!`)
      .join('\n\n') +
    '\n\n> 引用*English*中文\n\n- 中文~~English~~中文\n\n| 中文English | **标题Title** |\n| --- | --- |\n| 使用`foo`测试 | 数据2项 |\n'
  const result = await format(source)
  for (const type of ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'])
    assert.ok(
      result.includes(`> [!${type}]\n> 中文 **English** 中文，有 2 项！`),
    )
  assert.ok(result.includes('> 引用 *English* 中文'))
  assert.ok(result.includes('- 中文 ~~English~~ 中文'))
  assert.ok(result.includes('| 中文 English | **标题 Title** |'))
  assert.ok(result.includes('| 使用 `foo` 测试 | 数据 2 项 |'))
})

test('bare calls and ASCII tuples retain technical punctuation', async () => {
  for (const literal of [
    'x.wait()',
    'P(mutex)',
    'V(x-sem)',
    'f(g(x, y), (a + b))',
    'log("中文English", ")")',
    '(i, j)',
    '(-1, +2.5)',
  ]) {
    assert.equal(formatText(`执行${literal}之后`), `执行 ${literal} 之后`)
    const source = `调用 ${literal} 后继续。\n`
    assert.equal(await format(source), source)
  }
  assert.equal(
    formatText('使用Linux(测试版),有3项'),
    '使用 Linux（测试版），有 3 项',
  )
  for (const prefix of [
    '',
    '> ',
    ...['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'].map(
      type => `> [!${type}]\n> `,
    ),
  ]) {
    const source = `${prefix}执行x.wait()后检查(i, j)。\n`
    assert.equal(
      await format(source),
      `${prefix}执行 x.wait() 后检查 (i, j)。\n`,
    )
  }
  assert.equal(
    await code('# 执行P(mutex),检查(i, j)\n', 'bash'),
    '# 执行 P(mutex)，检查 (i, j)\n',
  )
})

test('escaped punctuation is not treated as an English word', async () => {
  for (const source of [
    '程序接口\\{系统调用\\}',
    '系统调用分类\\{==WARN：与操作系统的主要功能分开==\\}',
    '中文\\{说明\\}和\\*标记\\*',
    '已有\uE000字符，接口\\{说明\\}',
  ]) {
    assert.equal(formatText(source), source)
    assert.equal(await format(source + '\n'), source + '\n')
  }
  assert.equal(formatText('接口\\{中文English\\}'), '接口\\{中文 English\\}')
  const source = '### 系统调用分类\\{说明\\}\n'
  assert.equal((await formatMarkdown(source)).aliases.size, 0)
})

test('English comments and Chinese parenthetical notes use separate punctuation', async () => {
  const source =
    '# The Focal patches support kernel 5.4, 5.8, 5.11 (Ubuntu 20.04, `uname -r`查看内核版本)\n'
  const expected =
    '# The Focal patches support kernel 5.4, 5.8, 5.11 （Ubuntu 20.04，`uname -r` 查看内核版本）\n'
  assert.equal(await code(source, 'bash'), expected)
  assert.equal(await code(expected, 'bash'), expected)
  assert.equal(
    await format('```bash\n' + source + '```\n'),
    '```bash\n' + expected + '```\n',
  )
  assert.equal(
    formatComment(
      "// English text (don't change), yes! （中文English,说明） Next, sentence.",
    ),
    "// English text (don't change), yes! （中文 English，说明） Next, sentence.",
  )
  assert.equal(
    formatComment('// English, text （中文English（嵌套Note））; more, text.'),
    '// English, text （中文 English（嵌套 Note））; more, text.',
  )
  for (const source of [
    '// English "value(中文English)"',
    '// English `value(中文English)`',
    '// English https://example.com/中文English(test)',
    '// English, text log("中文English"), yes!',
    '// English, text "中文English", yes!',
  ])
    assert.equal(formatComment(source), source)
  assert.equal(
    formatComment('// English, "中文English" （说明English,备注）'),
    '// English, "中文English" （说明 English，备注）',
  )
})

test('decorative comments stay byte-for-byte unchanged', async () => {
  for (const [source, language] of [
    [
      '#################################分割线#################################',
      'bash',
    ],
    ['# --------中文English--------', 'bash'],
    [
      '/********************************分割线********************************/',
      'c',
    ],
    ['// ===== 中文English =====', 'ts'],
    ['<!-- ===== 中文English ===== -->', 'html'],
  ]) {
    assert.equal(formatComment(source), source)
    assert.equal(await code(source + '\n', language), source + '\n')
    assert.equal(
      await format(`\`\`\`${language}\n${source}\n\`\`\`\n`),
      `\`\`\`${language}\n${source}\n\`\`\`\n`,
    )
  }
  assert.equal(formatComment('#普通English注释'), '# 普通 English 注释')
})

test('explicit path and variable boundaries retain literals and format both sides', async () => {
  assert.equal(
    await code('# @brief: 占用`./hdc/`的进程\n', 'bash'),
    '# @brief: 占用 `./hdc/` 的进程\n',
  )
  assert.equal(
    await code('# 使用`/data/中文English/`目录\n', 'bash'),
    '# 使用 `/data/中文English/` 目录\n',
  )
  assert.equal(
    await format('设置`${HOME}`下的文件夹\n'),
    '设置 `${HOME}` 下的文件夹\n',
  )
})

test('emphasis range and literal punctuation repair do not swallow adjoining words', async () => {
  const result = await format(
    '> ***除Conda环境外，***请尽量将***个人代码和Checkpoint*** 放在 `/nas/Users/${USER}` 中。\n',
  )
  assert.ok(
    result.includes(
      '***除 Conda 环境外，***请尽量将***个人代码和 Checkpoint***',
    ),
  )
})

test('unwanted punctuation spacing across inline emphasis boundaries', async () => {
  assert.equal(
    await format('**标题Title** ：使用： **Linux**\n'),
    '**标题 Title**：使用：**Linux**\n',
  )
  assert.equal(
    await format('**标题Title** : 使用: **Linux**\n'),
    '**标题 Title**：使用：**Linux**\n',
  )
})

test('reference image descriptions are prose; their identifiers are unchanged', async () => {
  assert.equal(
    await format(
      '![说明English][image-id]\n\n[image-id]: https://example.com/中文English.png\n',
    ),
    '![说明 English][image-id]\n\n[image-id]: https://example.com/中文English.png\n',
  )
})

test('Front Matter edits only title and summary, preserving scalar styles and CRLF', async () => {
  for (const scalar of [
    '"中文English"',
    "'中文English'",
    '中文English',
    '|-\n  中文English\n  下一line',
    '>-\n  中文English\n  下一line',
  ]) {
    const source =
      `---\ndiscussionNumber: 20\ncategory: "中文English"\nlabels: ["中文English"]\ntitle: ${scalar} # 注释不动\nsummary: '摘要Summary'\n---\n\n正文English\n`.replaceAll(
        '\n',
        '\r\n',
      )
    const result = await format(source)
    assert.ok(
      result.includes('category: "中文English"\r\nlabels: ["中文English"]'),
    )
    assert.ok(result.includes('中文 English'))
    assert.ok(result.includes("summary: '摘要 Summary'"))
    assert.equal(result.match(/(?<!\r)\n/g), null)
  }
  assert.equal(
    (await format('---\ntitle: "中文English"\n---\n')).includes('summary:'),
    false,
  )
})

test('math in every delimiter is byte-for-byte unchanged, including TeX text', async () => {
  const formulas = [
    '$x_{中文English} +  \\frac{a}{b}$',
    '$$\n\\text{中文English} \\label{eq:test}\n$$',
    '\\(\\text{中文English} + x_1\\)',
    '\\[\n\\frac{中文English}{2}  \\label{eq:foo}\n\\]',
  ]
  const source = `正文English\n\n${formulas.join('\n\n')}\n`
  const result = await format(source)
  for (const formula of formulas) assert.ok(result.includes(formula), formula)
  assert.ok(result.includes('正文 English'))
})

test('MDX child prose and static allowlist attributes; expressions/imports protected', async () => {
  const source =
    'import X from "中文English"\n\nexport const x = "中文English"\n\n<Details summary="标题English" data-x="中文English">\n\n中文English{value + "中文English"}\n\n<img alt="图片English" title="标题English" aria-label="说明English" src="中文English.png" />\n\n<Widget title="中文English" summary={"中文English"} />\n\n</Details>\n'
  const result = await format(source)
  assert.ok(result.includes('summary="标题 English" data-x="中文English"'))
  assert.ok(result.includes('中文 English{value + "中文English"}'))
  assert.ok(
    result.includes(
      'alt="图片 English" title="标题 English" aria-label="说明 English" src="中文English.png"',
    ),
  )
  assert.ok(
    result.includes('<Widget title="中文English" summary={"中文English"} />'),
  )
  assert.ok(result.includes('import X from "中文English"'))
})

test('natural-language HTML/MDX comments, source markers and control comments', async () => {
  const marker = '<!-- m0rtzz.blog-source:posts%2F中文English.md -->'
  const result = await format(
    `${marker}\n\n<!--中文English-->\n\n{/*中文English*/}\n\n<!-- prettier-ignore 中文English -->\n`,
  )
  assert.ok(result.includes(marker))
  assert.ok(result.includes('<!-- 中文 English-->'))
  assert.ok(result.includes('{/* 中文 English*/}'))
  assert.ok(result.includes('<!-- prettier-ignore 中文English -->'))
})

test('descriptive image alt and link labels, not filenames or autolinks', async () => {
  const result = await format(
    '[中文English](https://example.com/中文English)\n\n![说明English](a.png)\n\n![截图2024English](b.png)\n\n![中文English.png](c.png)\n\nhttps://example.com/中文English\n',
  )
  assert.ok(result.includes('[中文 English](https://example.com/中文English)'))
  assert.ok(result.includes('![说明 English](a.png)'))
  assert.ok(result.includes('![截图2024English](b.png)'))
  assert.ok(result.includes('![中文English.png](c.png)'))
})

test('Bash comments only: strings, escapes, variables and heredocs never change', async () => {
  const source =
    '#!/bin/bash\necho "${HOME}" #中文English\necho "#中文English"\nprintf \'中文English\'\necho foo\\#中文English\ncat <<EOF\n#中文English\nEOF\ncat <<\'PY\'\n#中文English\nPY\n# shellcheck disable=SC2086 中文English\n# coding: utf-8 中文English\n'
  assert.equal(
    await code(source, 'bash'),
    source.replace('#中文English\necho', '# 中文 English\necho'),
  )
})

test('alternate commands in comments and commented-out statements remain executable', async () => {
  const source =
    '# 或：clashsub add -n "${USER}" -u \'https://example.com\'\n# 或：clashsub del \'My Airport Backup\'\n# 或：eval "$(clashenv)"\n# export VALUE="中文English"\n'
  assert.equal(await code(source, 'bash'), source)
  const commentedCode =
    '// sprintf(buf, "中文English", value);\n// 如果收到"!q"，结束Loop\n'
  assert.equal(
    await code(commentedCode, 'c'),
    commentedCode.replace('收到"', '收到 "').replace('结束Loop', '结束 Loop'),
  )
  assert.equal(
    await code('# footprint: [[-0.12, 0.12]] #其他形状\n', 'yaml'),
    '# footprint: [[-0.12, 0.12]] #其他形状\n',
  )
  assert.equal(
    await code('# @brief: 中文English\n', 'bash'),
    '# @brief: 中文 English\n',
  )
})

test('HTML-comment-looking and TeX-looking JavaScript strings are not prose', async () => {
  const source =
    '{"<!--中文English-->"}\n\n<Component value="<!--中文English-->" />\n\nexport const s = "<!--中文English-->"\n'
  assert.equal(await format(source), source)
})

test('C/TS/JSONC code and machine directives unchanged; normal/doc comments fixed', async () => {
  const source =
    'const s = "中文English"; //中文English\n/*中文English*/\n// [!code focus] 中文English\n// @errors: 2540 中文English\n// @log: Custom log message 中文English\n// @unknown 中文English\n/**\n * @param {string} foo_bar 中文English\n * @returns {number} 返回Value\n */'
  const result = await code(source, 'ts')
  assert.ok(result.includes('const s = "中文English"; // 中文 English'))
  assert.ok(result.includes('/* 中文 English*/'))
  assert.ok(result.includes('* @param {string} foo_bar 中文 English'))
  assert.ok(result.includes('* @returns {number} 返回 Value'))
  for (const tag of [
    '[!code focus]',
    '@errors: 2540',
    '@log: Custom log message',
    '@unknown',
  ])
    assert.ok(result.includes(`// ${tag} 中文English`))
  assert.equal(
    await code('int x = 1; //中文English', 'c'),
    'int x = 1; // 中文 English',
  )
  assert.equal(
    await code('"foo": "中文English", //中文English', 'json'),
    '"foo": "中文English", // 中文 English',
  )
})

test('Makefile tabs, XML comments, TeX percent comments', async () => {
  assert.equal(
    await code('all:\n\techo "中文English" #中文English\n', 'makefile'),
    'all:\n\techo "中文English" # 中文 English\n',
  )
  assert.equal(
    await code('<item name="中文English" /><!--中文English-->', 'xml'),
    '<item name="中文English" /><!-- 中文 English-->',
  )
  assert.equal(
    await code(
      '\\text{中文English} %中文English\n% !TEX program = xelatex 中文English',
      'tex',
    ),
    '\\text{中文English} % 中文 English\n% !TEX program = xelatex 中文English',
  )
})

test('CodeGroup metadata, quote prefixes, fenced code indentation/line count preserved', async () => {
  const source =
    '<CodeGroup >\n\n```ts blog-config.ts twoslash {1} title="中文English"\nconst foo = "中文English" //中文English\n// [!code focus]\n```\n\n```yaml graphql.config.yml\nname: 中文English #中文English\n```\n\n</CodeGroup>\n\n> ```bash\n> echo "中文English" #中文English\n> ```\n'
  const result = await format(source)
  assert.ok(
    result.includes('```ts blog-config.ts twoslash {1} title="中文English"'),
  )
  assert.ok(result.includes('```yaml graphql.config.yml'))
  assert.ok(result.includes('const foo = "中文English" // 中文 English'))
  assert.ok(result.includes('> echo "中文English" # 中文 English'))
  assert.equal(result.split('\n').length, source.split('\n').length)
})

test('unknown/unlabelled/plaintext blocks stay unchanged and report coverage', async () => {
  for (const lang of ['', 'text', 'plaintext', 'unknown-language']) {
    const source = `\`\`\`${lang}\n#中文English\n\`\`\`\n`
    const result = await formatMarkdown(source)
    assert.equal(result.source, source)
    assert.equal(result.warnings.length, 1)
  }
})

test('anchors match GitHub slugging, duplicate headings, literal emphasis and inline code', async () => {
  const source =
    '# 中文English\n\n## 中文English\n\n### `原文Code`和**English**\n'
  const before = headingInfo(source)
  const result = await formatMarkdown(source)
  const after = headingInfo(result.source)
  assert.deepEqual(
    before.headings.slice(0, 2).map(item => item.slug),
    ['中文english', '中文english-1'],
  )
  assert.deepEqual(
    after.headings.slice(0, 2).map(item => item.slug),
    ['中文-english', '中文-english-1'],
  )
  for (const old of before.headings)
    assert.ok(after.ids.some(item => item.id === old.slug))
  assert.equal(await format(result.source), result.source)
  assert.throws(
    () =>
      preserveAnchors(
        '# 中文English\n\n## 中文 English\n',
        '# 中文 English\n\n## 中文 English\n<a id="中文english"></a>\n',
      ),
    /冲突/,
  )
})

test('update same-page, relative-source, site links and reference definitions; not third-party URLs', async () => {
  const first =
    '# 中文English\n\n[本站](#中文english)\n\n[外部](https://example.org/posts/1#中文english)\n'
  const second =
    '[跨页](/posts/1#中文english)\n\n[文件](one.md#中文english)\n\n[引用][ref]\n\n[ref]: https://www.m0rtzz.com/posts/1#%E4%B8%AD%E6%96%87english\n'
  const documents = [
    {
      path: '/test/one.md',
      discussionNumber: 1,
      result: await formatMarkdown(first),
    },
    {
      path: '/test/two.md',
      discussionNumber: 2,
      result: await formatMarkdown(second),
    },
  ]
  updateLinks(documents)
  assert.ok(documents[0].result.source.includes('[本站](#中文-english)'))
  assert.ok(
    documents[0].result.source.includes(
      'https://example.org/posts/1#中文english',
    ),
  )
  assert.ok(documents[1].result.source.includes('/posts/1#中文-english'))
  assert.ok(documents[1].result.source.includes('one.md#中文-english'))
  assert.ok(documents[1].result.source.includes('#%E4%B8%AD%E6%96%87-english'))
})

test('conflicting patches and invalid MDX fail closed', async () => {
  assert.throws(
    () =>
      applyEdits('abcdef', [
        { start: 1, end: 4, replacement: 'x' },
        { start: 3, end: 5, replacement: 'y' },
      ]),
    /Overlapping/,
  )
  await assert.rejects(
    formatMarkdown('<Details summary={invalid\n\n中文English'),
    /./,
  )
})

test('batch preflight: one invalid file means no article is written', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'blog-typography-test-'))
  try {
    await writeFile(join(directory, 'good.md'), '中文English\n')
    await writeFile(join(directory, 'bad.md'), '<Details summary={invalid\n')
    await assert.rejects(
      runTypography({ paths: [directory], fix: true, report() {} }),
      /未写入任何文章/,
    )
    assert.equal(
      await readFile(join(directory, 'good.md'), 'utf8'),
      '中文English\n',
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('file commands: lint fails, format repairs, next format has no changes', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'blog-typography-test-'))
  try {
    const path = join(directory, 'post.md')
    await writeFile(path, '中文English\r\n')
    assert.equal(
      (await runTypography({ paths: [path], report() {} })).ok,
      false,
    )
    assert.equal(
      (await runTypography({ paths: [path], fix: true, report() {} })).changed
        .length,
      1,
    )
    assert.equal(
      (await runTypography({ paths: [path], fix: true, report() {} })).changed
        .length,
      0,
    )
    assert.equal(await readFile(path, 'utf8'), '中文 English\r\n')
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
