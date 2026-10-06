---
version: 1
slug: "src-routes-index-tsx"
primary_target: "src/routes/index.tsx"
related_targets: []
---

# Surface: docs index (`/`)

Mode: Read. Audience: engineers arriving from a deep link who step up to see what else exists; recruiters from the osm.sh Outlinks tab. Job: find an article by searching, or browse the set, and open one. Content: Markdown files in `content/{writing,projects,notes}/`; launches with zero pages, 20–100 in year one. No invented entries, dates, or counts.

User steer (2026-09-28): redesign in a workbench / blueprint style on the same palette, drawn as a whiteprint (paper ground, navy linework, rose redlines). Search is the primary interaction, front and centre, with articles below. No differentiation between article kinds on the index. The title bar sits in a hero banner position. The labelled hairline nav rule (`── docs.osm.sh ──── osm.sh │ puzzles ─`) stays; it is part of the family system.

User steer (2026-09-28, later): the gridded cutting mat was rejected. Asked for crosshairs in the visual style of vercel / zed.dev and a matching reorganization: the page became one ruled drawing of full-width rows between two rails, with registration crosses at every rule/rail crossing, sheets as shared-border grid cells, and the title block's fields stacked at the right.

Chosen structure: Title-block hero over a workbench mat (steered by the user after two rounds: drawers / revision log / specimens, then pegboard / sheet index / lettering guide; seed a38ab4db, re-roll 1).

Anti-goals: kind tabs or kind badges on the index, a dashboard, a hero-metric template, decorative illustration.

## Direction contract

THESIS: The index is a drafting workbench: the knowledgebase's title block is the hero, and its biggest cell is the search field; every article lies below as a drawing sheet on a cutting mat. It refuses the docs-site default of a marketing hero over a sidebar of sections.

OWN-WORLD: Whiteprint on one paper ground: the page is a single ruled drawing, a column (max 76rem) between two full-height rails, cut into rows by full-width 1px `rule` hairlines, with an 11px ink-3 registration cross wherever a rule crosses a rail. Every line is `rule`; there is no mat or second surface. Sheets are cells of a shared-border grid; the sheet in hand gets rose-ink crosses at its four corners and a faint ground-2 tint. Navy ink for text, rose redline marks on search matches, Fira Code only, zero radius, no shadows.

STORY: The visitor lands on the title block, sees whose knowledgebase this is and how many sheets it holds, types into the find cell, watches the mat narrow to the matching sheets with the matched words redlined, and opens one; the page opens as the full sheet with its title block.

FIRST VIEWPORT: The labelled nav rule as the drawing's first full-width rule, crossed at both rails. Under it the title block row: a large `docs.osm.sh` with `osmii's knowledgebase` at the left, and drawn / sheets / last rev stacked in a 30ch field column at the right, so one divider meets the nav rule. Then the find row across the column with a large input, live `n of N` count and `/` hint; then the ruler row; then the sheet grid (1/2/3 columns) with its first row or two of sheets visible.

FORM: Workbench title block + mat of sheets, user-steered (outside the dealt list), seed key a38ab4db.

Signature interaction: `/` focuses find from anywhere; typing filters the mat live and redlines matches (rose wash sweeps in, 180ms expo); ArrowDown drops into the sheets, arrows walk the grid, Enter opens; Esc clears. Returning from a page focuses the sheet you left.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

User steer (2026-09-28, texture pass): the background read as flat. The drawing now lies on a `table` tone outside the rails, with a 28px band of 45° section hatching beside each rail. Each title block's lettering cell carries a faded 16px construction grid aligned to the ruler. The registration crosses' paper knockouts were tried and removed: the patches broke the rails. The column stays plain paper for reading.
