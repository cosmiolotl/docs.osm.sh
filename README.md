<a href="https://docs.osm.sh"><img src=".github/banner.svg" alt="docs.osm.sh"></a>

osmii's knowledgebase for any text document hosting, including blog posts and project documentation.

## Run

Requires [Bun](https://bun.sh) 1.4+ and Node.js 24+.

```sh
bun install --frozen-lockfile
bun run dev          # http://localhost:3000
bun run build        # vite build + tsc
bun run preview      # preview the production build locally
bun run deploy       # build + wrangler deploy (Cloudflare Workers)
```

The site uses React, TanStack Start, Vite, and Tailwind CSS. To deploy, authenticate with `bunx wrangler login` and set a Worker name, account, and domain in `wrangler.jsonc` first.

## Writing a page

The site is built on [Fumadocs](https://fumadocs.dev). Here is an example article:

````mdx
---
title: Article Title
description: A short one-line description of the article content.
date: 2026-09-25
tags: [tag]
featured: true
---

Body text, written in MDX

```ts title="file.ts"
console.log("Hello world!)
```