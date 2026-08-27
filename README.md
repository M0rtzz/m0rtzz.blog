# My Blog Website Repo

This repo is used to host the front-end code of [my blog website](https://www.m0rtzz.com) :).

## Publishing posts

Markdown files in `posts/` are the source of truth. Every post must start with
Front Matter that maps it to an existing GitHub Discussion:

```yaml
---
discussionNumber: 20
title: 'HUSTNLP NAS 使用说明'
summary: 'A short English summary used for page metadata.'
---
```

- Run `pnpm posts:check` to validate every post without changing files.
- Run `pnpm posts:sync:dry-run` to preview Discussion updates.
- Pushing `master` validates the sources, updates changed Discussions, and only
  then builds and deploys the site.

`summary` is optional. The blog reads it directly from Front Matter; when it is
missing, the summary and page description are simply left empty. Front Matter
is removed before the article body is sent to GitHub Discussions.

LLM summary generation is disabled by default. To generate missing summaries
during development and write them back to Front Matter, set:

```dotenv
ENABLE_LLM_SUMMARY=true
LLM_API_KEY=your-api-key
# LLM_BASE_URL=https://your-openai-compatible-endpoint/v1
# LLM_MODEL=your-model
```

The pre-push hook and GitHub Actions both run `pnpm posts:check`, so missing
summaries are accepted while malformed metadata and duplicate Discussion
numbers are rejected.
