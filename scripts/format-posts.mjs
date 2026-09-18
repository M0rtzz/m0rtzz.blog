import { runTypography } from './typography/index.mjs'

const args = process.argv.slice(2)
if (args.includes('--help')) {
  console.log(
    '用法：pnpm posts:lint [文件或目录...]\n      pnpm posts:format [文件或目录...]\n默认检查 posts/；离线运行，不暂存、不提交、不推送、不访问 Discussion。',
  )
} else {
  try {
    const unsupported = args.find(
      arg => arg.startsWith('-') && arg !== '--write',
    )
    if (unsupported) throw new Error(`未知参数：${unsupported}`)
    const paths = args.filter(arg => !arg.startsWith('-'))
    const result = await runTypography({
      fix: args.includes('--write'),
      ...(paths.length ? { paths } : {}),
    })
    if (!result.ok) process.exitCode = 1
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
