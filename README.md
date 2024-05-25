# Blog

My personal blog.

[zhangyu.dev](zhangyu.dev)

Using [Next.js](https://nextjs.org/) v14 App Router and React Server Components. Styling with [TailwindCSS](https://tailwindcss.com/).

Using [@discublog/api](https://github.com/discublog/api) to query GitHub repository discussions and rendering Markdown with [@mdx-js/mdx](https://github.com/mdx-js/mdx).

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzhangyu1818%2Fblog&env=GITHUB_TOKEN,REPO_NAME,REPO_OWNER&envDescription=GitHub%20Token&envLink=https%3A%2F%2Fdocs.github.com%2Fen%2Fauthentication%2Fkeeping-your-account-and-data-secure%2Fmanaging-your-personal-access-tokens&project-name=blog&repository-name=blog&demo-title=zhangyu1818's%20blog&demo-description=Personal%20blog&demo-url=https%3A%2F%2Fzhangyu.dev)

> [!IMPORTANT]
> Make sure to open [discussions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/enabling-or-disabling-github-discussions-for-a-repository) on the new repository after creating it in "Create Git Repository" and before adding environment variables.

> [!IMPORTANT]
> After enabling Discussions, please make sure to [start a new discussion](https://docs.github.com/en/discussions/quickstart#creating-a-new-discussion), and feel free to choose any topic.

## Write Articles

1. Enable your blog repository discussions.
2. Write a new discussion.

## Fork Guide

1. Make sure you have the GitHub Profile repository like [`zhangyu1818/zhangyu1818`](https://github.com/zhangyu1818/zhangyu1818).
2. Modify site [metadata](https://github.com/zhangyu1818/blog/blob/next14/src/app/layout.tsx#L40).
3. Modify Google verification [here](https://github.com/zhangyu1818/blog/blob/next14/src/app/layout.tsx#L65).
4. Modify the Giscus script [here](https://github.com/zhangyu1818/blog/blob/next14/src/components/giscus/index.tsx#L17-L18).
5. Modify the [resume page](https://github.com/zhangyu1818/blog/blob/next14/src/app/resume/page.tsx).
6. Put your avatar file in `src/images/avatar.webp`.
7. Put your favicon file in `src/app/favicon.ico`.
8. Put your icons in `public/icon`.

### Env

create `.env` file in root folder.

```text
GITHUB_TOKEN=<required>
OPENAI_API_KEY=<optional>
REPO_NAME=<required>
REPO_OWNER=<required>
```

### Summary

If you need Open AI to generate your article summaries, delete `summary.json` in root folder and paste your `OPENAI_API_KEY` in `.env`.
