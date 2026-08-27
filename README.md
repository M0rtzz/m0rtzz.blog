# My Blog Website Repo

This repo is used to host the front-end code of [my blog website](https://www.m0rtzz.com) :).

## Publishing posts

Markdown files in `posts/` are the source of truth. Every post must start with
Front Matter that selects a Discussion category and one or more repository
labels:

```yaml
---
discussionNumber: 20
category: 'Blog'
labels:
  - 'Linux'
  - 'Environment'
  - 'Configuration'
title: 'HUSTNLP NAS 使用说明'
summary: 'A short English summary used for page metadata.'
---
```

- `discussionNumber` identifies an existing Discussion. Omit it for a new post;
  GitHub Actions creates the Discussion and commits the generated number back
  into the Markdown file.
- `category` must match an existing Discussion category by name or slug.
- `labels` must be a non-empty array of exact repository label names.
- Run `pnpm posts:check` to validate local metadata, remote categories, labels,
  and mapped Discussion numbers without changing files.
- Run `pnpm posts:sync:dry-run` to preview Discussion updates.
- Pushing `master` validates the sources, updates changed Discussions, and only
  then builds and deploys the site.

Both validation commands require `ACCESS_TOKEN`, `REPO_OWNER`, and `REPO_NAME`
in `.env` when run locally. Synchronization validates every post before making
remote changes. Newly created Discussions contain a hidden source marker so a
later run can recover the same Discussion if writing the generated number back
to Git fails.

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
summaries are accepted while malformed metadata, unsupported categories or
labels, missing Discussions, and duplicate Discussion numbers are rejected.
