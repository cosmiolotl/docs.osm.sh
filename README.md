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

All four fields are optional. A filename that starts with `_`, or that sets `draft: true`, is not published. Pages are bundled at build time.

## Find

Find searches every page's title, tags, summary, and body. Word matching is loose by default but can be made strict by using quotes around the searched term.

Words that start with `#` indicate tag search. 

## Keys

On the index: `h` `l` `←` `→` move between panes, `j` `k` `↑` `↓` move inside one, `g`/`G`, `enter` selects. `h` or `q` navigates to the index.

In find: `/` focuses it from anywhere, `#` starts a tag, `tab` completes the tag being typed, and `esc` clears the query and unfocuses find.
