# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TanStack Start with Tailwind CSS and shadcn/ui, deployed to Cloudflare Workers. This matches `../puzzles` (user-chosen, 2026-09-25). Served at `docs.osm.sh`, the address the osm.sh Outlinks tab already publishes under the label `knowledgebase`.

## Users

- **Engineers and technical peers** who arrive at a specific page from a link or search, want the answer or the write-up, and may stay to follow links.
- **Recruiters and hiring managers** who reach it from the osm.sh Outlinks tab and use it as evidence of how the owner thinks and writes.

Both are primary (confirmed 2026-09-25). No accounts or roles.

## Product Purpose

The owner's knowledgebase: one tree that holds personal notes, long-form technical writing, and documentation for the owner's own projects (osm.sh, puzzles, future repositories). It also gives writing a home. The osm.sh portfolio lists writing as content it must carry, but has not placed it.

Success means an engineer finds and understands the page they came for, and a recruiter leaves with an accurate sense of the owner's depth and clarity.

## Positioning

It is one person's knowledgebase and shares the authored identity of osm.sh and puzzles.osm.sh. It is not a generic docs site or a blog platform. The notes, write-ups, and docs for the owner's own projects live together and link to each other. A neighbouring site can't truthfully claim that authorship or that shared world.

## Operating Context

- Most visitors arrive deep, on one page, from a link or search, not from the index.
- Recruiters come in from the osm.sh Outlinks tab, in a browser, usually on desktop.
- The owner writes each page as a Markdown file in the repository, then commits and deploys. There is no CMS or in-browser editor.
- Hosting runs on Cloudflare Workers, so any server logic has to fit the Workers runtime.

## Capabilities and Constraints

Confirmed:

- The content has three kinds: notes, write-ups, and project docs. They live in one site.
- Authoring is one Markdown file per page, in the repository. Puzzles already renders Markdown with LaTeX math and code, and this site can reuse that pipeline.
- The stack is TanStack Start + Tailwind + shadcn/ui, deployed to Cloudflare.
- Pages carry optional tags in frontmatter (`tags: a, b`), and find filters by `#tag`, with completions as you type (user-chosen, 2026-10-06). Tags describe a page and do not replace the three kinds.
- The site's mark is a single rose `/` on the white squircle puzzles uses (user-chosen, 2026-10-06, replacing an earlier navy key box). It serves as the favicon, the touch icon, and the README banner.

Undecided (do not invent):

- The information architecture: whether the three kinds are separate sections or one flat tree.
- Search, backlinks, dates, RSS, and table-of-contents behaviour.
- Whether writing also surfaces inside the osm.sh TUI or lives only here.
- The exact frontmatter and file layout.

## Brand Commitments

The site must match osm.sh branding (user-declared binding, 2026-09-25), the same way puzzles.osm.sh does. The established facts, from `../@/DESIGN.md`, `../@/PRODUCT.md`, and `../puzzles/DESIGN.md`:

- The typeface is Fira Code throughout, with monospace fallbacks.
- The family palette centres on navy `#121B35` and rose `#C67B8B`. osm.sh uses the dark ground; puzzles is "the osm.sh terminal in daylight". Which treatment docs uses is a later visual decision and is not settled here.
- The owner's handle is `osmii`, and the address is `osm.sh`. Treat them as one identity. Don't embellish either, and don't invent a legal name.
- Email is deliberately not published anywhere.

## Evidence on Hand

No content exists yet (confirmed 2026-09-25). Future work must not fabricate notes, articles, project documentation, dates, or reading metrics. Until the owner writes real pages, placeholders must stay visibly placeholders.

The sibling repositories hold real project facts that could later become project docs, if the owner chooses: `../@/PRODUCT.md`, `../@/DEPLOY.md`, and `../puzzles/README.md`.

## Product Principles

1. **Answer the deep-linked reader.** Every page must work as someone's first and only page.
2. **The writing is the evidence.** Clarity and depth are what a recruiter reads for, so presentation serves the text and never competes with it.
3. **One author, one world.** Docs sits inside the osm.sh family, never beside it.
4. **Files are the source of truth.** A page is a Markdown file in the repository. Nothing requires a CMS.
5. **Never invent content.** An empty knowledgebase looks empty.
