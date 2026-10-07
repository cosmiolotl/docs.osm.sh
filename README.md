<a href="https://docs.osm.sh"><img src=".github/banner.svg" alt="docs.osm.sh"></a>

osmii's knowledgebase for any text document hosting, including blog posts and project documentation.

## Run

```sh
bun install
bun run dev          # http://localhost:3000
bun run build        # vite build + tsc
bun run deploy       # build + wrangler deploy (Cloudflare Workers)
```

## Writing a page

Every page is a Markdown file under `content/<kind>/`, where the kind is `writing`, `projects`, or `notes`. The index lists them in three panes, newest first. Subdirectories become part of the address: `content/projects/osm.sh/deploy.md` is `/projects/osm.sh/deploy`.

```md
---
title: How the host key survives a restart
summary: One line, shown in the index's preview line.
date: 2026-09-25
tags: osm.sh, ssh, deploy
---

Body in Markdown, with GitHub tables and `$inline$` / `$$display$$` math.
```

All fields are optional. An optional `updated: YYYY-MM-DD` overrides the article's latest Git revision date. The index's `last rev` shows the latest revision across published articles, falling back to `date` when Git history is unavailable. A filename that starts with `_`, or that sets `draft: true`, is not published. Pages are bundled at build time.

## Article views

The index shows a shared count of article opens. Opening or reloading an article adds one view; index visits, searches, link prefetches, and missing pages do not. The count is recorded after the article renders in a browser with JavaScript enabled.

The Cloudflare `VIEW_COUNTER` Durable Object persists the total across visitors and deployments. Its binding and SQLite migration are included in `wrangler.jsonc` and provisioned by the normal deploy command. Local development uses separate local storage. An unavailable counter displays `# unavailable` and does not block reading.

## Find

Find searches every page's title, tags, summary, and body. Word matching is loose by default but can be made strict by using quotes around the searched term.

Words that start with `#` indicate tag search. 

## Keys

On the index: `h` `l` `←` `→` move between panes, `j` `k` `↑` `↓` move inside one, `g`/`G`, `enter` selects. `h` or `q` navigates to the index.

In find: `/` focuses it from anywhere, `#` starts a tag, `tab` completes the tag being typed, and `esc` clears the query and unfocuses find.
