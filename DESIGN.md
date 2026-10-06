---
name: docs.osm.sh
description: osmii's knowledgebase as one ruled drawing. Whiteprint paper, hairline rules with registration crosses, navy ink, rose redlines, one monospace face.
colors:
  ink: "#121b35"
  ink-2: "#4a5170"
  ink-3: "#676d8a"
  rose: "#c67b8b"
  rose-ink: "#9a4d62"
  rose-wash: "#f0d9df"
  ground: "#f4f2ec"
  ground-2: "#ebe8df"
  table: "#eeebe3"
  rule: "#c9c6ba"
typography:
  display:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "clamp(1.75rem, 4vw, 2.75rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  find:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "clamp(1.5rem, 3.25vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.375
    letterSpacing: "normal"
  body:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  prose:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  scale:
    fontFamily: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  snug: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
  3xl: "48px"
  4xl: "64px"
  inset: "3ch"
  unit: "16px"
components:
  drawing-table:
    backgroundColor: "{colors.table}"
  margin-hatch:
    backgroundColor: "{colors.rule}"
    width: "28px"
  drawing-column:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    width: "76rem"
  registration-mark:
    backgroundColor: "{colors.ink-3}"
    size: "11px"
  nav-rule:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    padding: "0 2ch"
  nav-rule-current:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  nav-rule-sibling:
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
  nav-rule-sibling-hover:
    textColor: "{colors.rose-ink}"
  title-block:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  title-block-name:
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    padding: "48px 3ch 40px"
  construction-grid:
    backgroundColor: "{colors.ink-3}"
    size: "16px"
  title-block-field:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0 3ch"
    width: "30ch"
  find-row:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    padding: "0 3ch"
    height: "7.5rem"
  find-row-focus:
    backgroundColor: "color-mix(in srgb, #f0d9df 20%, #f4f2ec)"
  find-input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.find}"
    rounded: "{rounded.none}"
    padding: "0"
  find-hint:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    width: "3ch"
    height: "24px"
  ruler:
    textColor: "{colors.ink-3}"
    typography: "{typography.scale}"
    height: "1.75rem"
  sheet:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "24px 3ch 20px"
    height: "12rem"
  sheet-hover:
    backgroundColor: "color-mix(in srgb, #ebe8df 60%, #f4f2ec)"
    textColor: "{colors.rose-ink}"
  sheet-mark:
    backgroundColor: "{colors.rose-ink}"
    size: "11px"
  redline:
    backgroundColor: "{colors.rose-wash}"
    textColor: "{colors.ink}"
  page-title:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  note:
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
    padding: "24px 3ch"
  footer:
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
    padding: "16px 3ch"
  tag:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
  tag-hover:
    textColor: "{colors.rose-ink}"
  tags-row:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    padding: "12px 3ch"
  mark:
    backgroundColor: "#ffffff"
    textColor: "{colors.rose}"
    size: "64px"
---

# Design System: docs.osm.sh

## Overview

**Creative North Star: "The Whiteprint Workbench"**

docs.osm.sh is a drafting workbench in daylight, and it belongs to the same osm.sh family as puzzles.osm.sh. Every surface is one ruled drawing on a single sheet of paper, laid on a drafting table. A column stands between two rails that run the full height of the page. Hairline rules cut it into rows and run the full width of the window, and a small registration cross sits wherever a rule crosses a rail. The labelled nav rule is the drawing's first rule. Under it, the knowledgebase's title block is the banner, the find row is the search, a ruler measures the drawing, and every page is a cell in the sheet grid below. Outside the rails the table shows through, hatched in a band beside each rail, and each title block's lettering cell carries a faint construction grid. The palette is a whiteprint: warm paper, navy text, `rule` hairlines, and rose redlines that mark what the search found and which sheet is in hand. Fira Code is the only face, corners are square, and nothing casts a shadow.

Search comes first. The caret waits in the find row on arrival (fine pointers only), `/` returns to it from anywhere, and typing narrows the sheet grid live while the matched words are redlined on every sheet that stays. A word that starts with `#` is a tag: it keeps only the sheets that carry it, and while one is being typed a tags row under find offers the set's tags that begin it. The index does not sort sheets by kind. Writing, projects, and notes still exist as directories and URL segments (`/writing/…`, `/projects/…`, `/notes/…`), but on the index they are one numbered set, newest first. Sheet numbers count up from the oldest page as three-digit numbers (`001`), so the newest sheet carries the highest number. Opening a sheet draws it at full size between the same rails, with its own title block across the top, and `h` or `q` puts it back where it was.

An empty knowledgebase looks empty. With no pages the title block reads `0` sheets and `# none` for last rev, the find count reads `0 sheets`, the sheet row holds a single note, `# nothing published yet`, and there is no footer.

**Key Characteristics:**
- One face, Fira Code, with ligatures off on a 16px base. Chrome weights are 400 and 500, and 700 appears only as `strong` inside prose.
- Paper on a table. The column is `ground` paper. The margins outside the rails are the `table`, with a 28px band of 45° `rule` section hatching beside each rail. Inside the column there is no mat, panel, or card surface.
- One line colour. Every rule, rail, and cell edge is a 1px `rule` hairline. Emphasis comes from marks, never from a heavier line.
- Rules run edge to edge of the window, and content stays between the rails (at most 76rem).
- Registration crosses in `ink-3` sit on every point where a rule crosses a rail. The sheet in hand gets `rose-ink` crosses at its four corners.
- Rose is the redline: the search-match wash, the find row's focus stroke, the marks on the sheet in hand, focus rings, hovered links, and text selection.
- Zero radius. No shadows.
- The labelled hairline nav rule opens every surface and is part of the family system.

## Colors

A whiteprint on one warm paper ground, with navy ink, a single hairline tone, and dusty rose as the only accent. Every value is inherited from the osm.sh family palette.

### Primary
- **Navy Ink** (`ink`): All primary text: the name and page titles, sheet titles, field values, sheet numbers, the find input's text, and the `h` key. It draws no lines.
- **Dusty Rose** (`rose`): The redline's 1px underline beneath a match, the underline colour of prose links and the empty-state `clear`, text selection, and the slash of the mark. It is never text on paper.
- **Rose Ink** (`rose-ink`): Rose deep enough to read as text on paper. It colours hovered links and hovered sheet titles, prose links, the empty-state `clear`, and the input caret. It also draws the corner crosses on the sheet in hand, the find row's 2px focus stroke, and focus outlines.
- **Rose Wash** (`rose-wash`): Rose at paper strength. It fills the redlined words of a search match. The find row also tints to 20% of it on paper while it holds focus.

### Neutral
- **Paper Ground** (`ground`): The paper of the drawing. It fills the column between the rails, every row and cell, the patch of paper behind each nav label where the label cuts the rule, and `theme-color`.
- **Ground 2** (`ground-2`): Inline `code`, `pre`, and table headers inside prose, and the scrollbar track. Mixed 60% into `ground`, it is also the tint of the sheet in hand.
- **Table** (`table`): The drafting table under the drawing, a step deeper than paper. It fills the margins outside the rails and the overscroll.
- **Hairline** (`rule`): Every line in the system. That covers the full-width row rules (the nav rule and the closing rule included), both rails, the title block's field dividers, the sheet cells' shared edges, prose table, blockquote, and `hr` borders, the `/` key's box, the nav's `│` separator, and the scrollbar thumb.
- **Ink 2** (`ink-2`): Secondary text: sheet summaries and dates, the subtitle `osmii's knowledgebase`, the find label, count, and placeholder, `clear`, tags on sheets and pages, the tags row's label and the completions after its first, earlier steps of the nav trail, `back to all sheets`, the footer's key glyphs, and prose blockquotes. It also draws the ruler's major ticks.
- **Ink 3** (`ink-3`): Tertiary text: title-block field labels (`drawn`, `sheets`, `last rev`, `sheet`, `date`), the sibling links `osm.sh` and `puzzles`, the trail's `/`, the page's `kind/slug` path, the tags row's counts and `tab complete`, the footer's hint labels, and every `#` comment (`# none`, `# undated`, `# no summary`, `# nothing published yet`). It also draws the registration crosses, the ruler's minor ticks and numerals, and the hovered scrollbar thumb.

The stylesheet also carries `ground-3` (the tone of the retired cutting mat) and the family's diff pair (`plus`, `plus-wash`, `minus`, `minus-wash`), which shadcn maps to `destructive`. No docs surface uses them, so they stay out of the token set. If the diff pair appears, it keeps the meanings puzzles gives it.

### Named Rules
**The Redline Rule.** Rose marks a finding, a live focus, or the sheet in hand, and nothing else. The wash sits under matched words, the rose-ink stroke under the focused find row, and the rose-ink crosses on the corners of the sheet under the pointer or focus. Outside a match, rose's only fill is the find row's 20% wash while it holds focus. The one standing exception is the mark (see Mark), whose slash is the site's identity, the way the windmill's rose square is the family's.

**The Paper and Table Rule.** The drawing is `ground` paper lying on the `table`. Texture comes only from the drafting world, and it is drawn as linework: 45° section hatching (1px `rule`, 7px pitch, 28px wide) in the margins beside each rail, and the construction grid in a title block's lettering cell. There is no mat, panel, or card surface inside the column. `ground-2` appears only inside prose, in the scrollbar track, and as the tint of the sheet in hand.

**The One Line Rule.** Every line is a 1px `rule` hairline. No line darkens or thickens to show emphasis. Emphasis is a mark added to the drawing: an `ink-3` registration cross, a `rose-ink` corner cross, or the 2px `rose-ink` find stroke.

## Typography

**Display Font:** Fira Code (with `ui-monospace, SFMono-Regular, Menlo, monospace`)
**Body Font:** Fira Code
**Label/Mono Font:** Fira Code
**Math:** KaTeX's own math faces, and only inside prose

**Character:** A single monospace voice lettered like a drawing, with ligatures off. Hierarchy comes from size, weight (400 or 500), and tone (ink, ink-2, ink-3). The three large roles tighten their tracking (-0.02em to -0.03em) so the monospace holds together at display size. Meta text reads like annotation: comments and empty values start with `#`.

### Hierarchy
- **Display** (500, clamp 2.25rem to 3.5rem, 1.05, -0.03em): `docs.osm.sh` in the index's title block. It is the largest text in the system and appears once.
- **Headline** (500, clamp 1.75rem to 2.75rem, 1.1, -0.025em): A page's title in its title block (balanced), and `no such sheet`.
- **Find** (400, clamp 1.5rem to 2.5rem, 1.25, -0.02em): The search input, set large because search is the index's primary act.
- **Title** (500, 1rem, 1.375): A sheet's title in the grid.
- **Body** (400, 1rem, 1.5): The html base, the subtitle, and title-block values from 640px.
- **Prose** (400, 0.95rem, 1.65): Page bodies rendered from Markdown with GitHub tables and KaTeX. Paragraphs are capped at 68ch and the body at 76ch, with 1em between blocks. `strong` is 700 and `em` is italic. Links are `rose-ink` with a `rose` underline and turn `ink` on hover. `code` and `pre` sit on `ground-2`, and `pre` scrolls horizontally. Lists indent 3ch and use `- ` as the bullet. Blockquotes have a 1px `rule` left edge and `ink-2` text. Tables have 1px `rule` cells and 500-weight headers on `ground-2`. `h1` to `h3` are 500. Display math is left-aligned with a 2ch indent, scrolls rather than wraps, and drops to 0.9em with no indent below 640px.
- **Label** (400, 0.875rem, 1.5): The nav rule, title-block field labels (and values below 640px), the find label, count, and `clear`, sheet summaries (3-line clamp, 1.625 leading), sheet numbers and dates, tags, the tags row, the page's path row, notes, and the footer. Every number is tabular.
- **Scale** (400, 0.75rem, 1): The ruler's numerals only.

### Named Rules
**The One Face Rule.** Fira Code is the only family, and inputs and buttons inherit it. KaTeX's math faces are the one exception, and they appear only inside prose.

**The Weight Ceiling Rule.** Chrome stops at 500. Weight 700 belongs only to Markdown `strong`.

**The Annotation Prefix Rule.** Empty or missing values are written as `#` comments in `ink-3` (`# none`, `# undated`, `# no summary`, `# nothing published yet`, `# no sheet matches "…"`, `# no tag begins "…"`). A blank space or an invented value is never used instead. A comment always has a space after its `#`. A tag never does (`#privacy`), and it is set in `ink-2`, so the two never read alike. Tags are optional, and a page without them draws no tag line rather than a comment.

## Layout

**The drawing.** Every surface is one centred column, at most 76rem wide and 2rem narrower than the window (4rem from 640px), so the rails stand 16px in from each edge (32px from 640px). The rails are 1px `rule` lines that run the full height of the page. The column is `ground` paper. Outside it the margins are the `table`, and a 28px band of section hatching runs down beside each rail. It fills the whole margin below 640px and ends well short of the window edge on a wide screen. The column is cut into rows. Each row draws a 1px `rule` across the full width of the window at its top, and an 11px `ink-3` registration cross is centred on each point where that rule crosses a rail. Content inside a row is inset 3ch from the rails. The page opens with a 24px lead-in where only the rails run, then the nav rule, and closes with a final rule and a 40px run-out. The row directly under the nav rule draws no rule of its own and carries no crosses.

**The index** is five rows, top to bottom: the title block, the find row, the ruler, the sheet grid (which grows to fill the viewport), and a footer. While a `#tag` is being typed in find, a sixth row, the tags row, is drawn between find and the ruler, and it goes again when the tag is complete or find loses focus. The footer is drawn only from 640px and only when there are sheets; otherwise the sheet grid runs straight into the closing rule. From 640px the title block has two columns: the name cell (48px top and 40px bottom padding, 64px each from 1024px) beside a 30ch field column. The fields stack in that column as equal-height rows, with the label at the left and the value at the right, divided by `rule` lines, so only one vertical divider meets the nav rule. Below 640px the fields sit side by side under the name, 1.5ch by 16px each, with each label over its value. From 640px the find row is at least 7.5rem tall, with the label, input, count, and `/` key (or `clear`) on one line. Below 640px it is padded 24px and the input wraps to its own full-width line at the end. The ruler row is a 1.75rem strip. The sheet grid has 1 column, 2 from 640px, and 3 from 1024px. The footer holds the key hints at the right and is padded 16px.

**A page** is the same drawing at full size. It has a title block (the Headline title beside `sheet` and `date`), then a path row padded 12px with the `kind/slug` path, the page's tags, and `h back to all sheets` (it wraps below 640px, with the link kept at the right), then a growing prose row padded 40px at the top and 64px at the bottom, capped at 76ch. The not-found page is a one-column title block over a row holding the link back.

The ruler counts in 16px units with a major tick every 80px (0, 5, 10, …). Spacing otherwise follows Tailwind's 4px scale, and the steps in use are 4, 8, 12, 16, 20, 24, 40, 48, 56, and 64px. Horizontal insets are in `ch`: 3ch inside rows and sheets, 1.5ch for narrow fields, 2ch between items on a line, and 0.75ch of paper either side of each nav label. Lines are 1px, and the find stroke and focus outlines are 2px.

Breakpoints: 640px (two-column title block with stacked fields, 2-column sheet grid, one-line find row, the footer, rails 32px in) and 1024px (3-column sheet grid, taller name cell).

### Named Rules
**The Rails Rule.** Rules run the full width of the window, and content never leaves the rails. Nothing is placed in the margins outside the column except the rules' own run-out, the `table`, and the hatch band beside each rail.

**The Registration Rule.** A registration cross (11px, two 1px `ink-3` strokes) is centred on every point where a full-width rule crosses a rail, and nowhere else. A row with no rule of its own carries no crosses.

## Elevation & Depth

The system is flat, and the drawing lies flat on the table. The one step of depth is tonal: `ground` paper against the deeper `table` in the margins. There are no drop shadows, no blur, no z-stacked overlays, and no second surface inside the column. The sheet in hand is marked rather than raised. It gets four `rose-ink` corner crosses and a faint `ground-2` tint. The only `box-shadow` in the system is the redline's inset 1px `rose` underline, which is a line, not elevation. The registration crosses, the sheet marks, and the ruler ticks are drawn with `linear-gradient` hard stops, the margin hatch with a `repeating-linear-gradient`, and the construction grid with hard-edged `radial-gradient` dots. All of them are linework rather than tonal gradients. The construction grid's fade is a mask, not a tonal fill.

### Named Rules
**The Marked-Not-Lifted Rule.** A surface is never lifted. The sheet under the pointer or focus is marked at its corners and tinted, and nothing about it rises, casts a shadow, or gains a heavier edge.

## Shapes

Radius is zero everywhere. `--radius` is 0px, and every Tailwind radius step is 0. Rows, cells, sheets, the find row, the `/` key, code blocks, and tables are hard rectangles. The mark's squircle is an icon enclosure, not a UI shape.

The form language is a single ruled drawing with registration marks. Cells share their edges. A sheet draws only its right and bottom edge, and the grid is pulled 1px under the right rail and under the next row's rule so every edge lands on a line that is already drawn. No line is ever doubled. A cross is two 1px strokes, 11px square, centred on its intersection. The nav rule is a labelled hairline: its row's own full-width rule, with each label set into the line on a patch of paper 0.75ch wide on either side, starting 2ch in from the rail, and the bare line showing between the trail and the sibling links.

## Components

### Nav Rule (family signature)
The labelled hairline every surface opens with, shared with puzzles.osm.sh, and a fixed part of the system: `──┼─ docs.osm.sh / Title ──────── osm.sh │ puzzles ─┼──` at 14px. It is the drawing's first full-width rule, stacked above the paper of the rows around it (`z-index: 10`), so the column's `ground` never clips its labels. It runs past the rails to both edges of the window, carries registration crosses where it meets them, and sits 24px below the top of the page. On the index it reads `docs.osm.sh` alone, in `ink` at 500 (`aria-current="page"`). On a page, `docs.osm.sh` is an `ink-2` link, the `/` separator is `ink-3`, and the page title is `ink` at 500 and truncates. The sibling links are `ink-3`, separated by a `│` in `rule`. Links have no underline until hover, when they turn `rose-ink` and underline (150ms). The kind is not a trail step.

### Table and Margin Hatch
The ground the drawing lies on. `body` is painted `table` (so is `html`, which covers overscroll), and the drawing column paints itself `ground`, so the table only shows in the margins. Section hatching runs down beside each rail: 1px `rule` lines at -45°, 7px apart, in a 28px band centred on the column (`calc(var(--col) + 2 * var(--hatch))`) and running the full height of the page in one piece, so the lines never break at a row. Registration crosses sit on the hatch as bare strokes, and nothing clears a patch beneath them, because any patch would break the rail. The hatch is decorative and never carries content.

### Drawing Row and Registration Marks
The unit every surface is built from. A row is a full-width band whose top edge is a `rule` line. Its content sits in the centred column between the two `rule` rails, and an 11px `ink-3` cross marks each point where its rule meets a rail. A row can grow to fill the viewport, as the sheet grid and the page prose do. The margins are rows with no content: the 24px lead-in above the nav rule has no rule, and the 40px run-out below the closing rule does.

### Title Block (signature)
The drawing's title block, set in hairlines on paper, and the index's banner. The name cell holds the Display `docs.osm.sh` with `osmii's knowledgebase` in `ink-2` 12px beneath. The cell carries a construction grid: a 1.5px `ink-3` dot at 55% opacity on every 16px unit, measured from the rail so it lands on the ruler's ticks. It is masked to rise out of the cell's bottom-right corner and fade before it reaches the lettering (a 60% by 110% ellipse, 45% by 90% below 640px). Every title block (index, page, not found) has it, on the lettering cell marked `title-cell`. The fields (`drawn` `osmii`, `sheets` `N`, `last rev` `YYYY-MM-DD` or `# none` in `ink-3`) stack in a 30ch column at the right, one per equal-height row, each with an `ink-3` label at the left and its value at the right, the way a drawing's title block lists drawn-by, sheet, and date. Values are tabular and never wrap. On a page the name cell holds the Headline title and the fields are `sheet` `NNN` and `date` (or `# undated`). Below 640px the fields drop under the name and sit side by side.

### Find (primary interaction)
The row directly under the title block. It holds the `find` label in `ink-2`, a borderless, transparent input in the Find role with a `rose-ink` caret and the `ink-2` placeholder `search sheets, #tags`, and the live count (`N sheets`, or `n of N` while a query is active, announced politely). At rest, from 640px, it also shows a 3ch by 24px `/` key boxed in `rule`, and it shows `clear` in `ink-2` while a query is present. On focus the row tints to 20% `rose-wash` on paper (150ms), and a 2px `rose-ink` stroke draws itself left to right along the row's bottom rule (200ms, expo). That stroke is the focus mark, and the input draws no outline. Find searches the full text of every page (title, tags, summary, and body) through a server-side inverted index, ranked with the title weighted over the tags and summary, and those over the body. Every loose word must appear, each also matches the words it begins, and quoted words must appear side by side. A word that starts with `#` is a tag, not a word. The sheet must carry that tag or one it begins, every tag in the query must hold, and tags combine with words (`#privacy hash`). A query of tags alone is answered in the browser, at once, newest first. Results arrive about 120ms after typing stops. Until they do, the sheets are narrowed by title and summary, and the count dims to `ink-3`. If the search fails, the count reads `n of N · titles only`. Keys: `/` focuses from anywhere, Tab takes the first completion while a `#tag` is being typed, Esc clears the query and then blurs, Enter opens the best match, and ArrowDown drops onto the first sheet. The query rides in the URL (`?q=`, debounced 200ms), so a search can be linked. Built-in search-cancel decorations are removed.

### Tags Row
Find's completion line for tags. It is drawn as its own row between find and the ruler, only while find holds focus and the caret ends a `#word`, and only when there is something to add. A tag typed out in full that no other tag begins draws no row. The insets are measured at 16px, so the `tags` label in `ink-2` sits under `find`, and the completions start where the query does. The completions are the set's tags that begin what was typed, the exact tag first and then the most used, each `#name` with the typed part redlined and its sheet count in `ink-3`. Tags the query already names are left out. The first is in `ink` at 500, because it is the one Tab takes, and the rest are `ink-2`. At most 12 are listed, then `# N more`. From 640px, `tab complete` sits at the right. Taking a completion, by Tab or a click (which never takes focus from find), writes `#name ` and leaves the caret after the space. With no match the row reads `# no tag begins "…"`, or `# no tags yet` when the set has none. It has no motion of its own.

### Ruler
A 1.75rem row between find and the sheets. It has a short `ink-3` tick every 16px and a long `ink-2` tick every 80px along its bottom, with a numeral (0, 5, 10, …) at each long tick in the Scale role and `ink-3`. It is decorative and hidden from assistive technology.

### Sheet (signature)
A page on the index, and a plain link, drawn as a cell of the sheet grid. It is padded 24px by 3ch (20px at the bottom), at least 12rem tall, and sheets in a row share one height. Inside it are the title (Title role) and up to three lines of summary in `ink-2` (or `# no summary` in `ink-3`). A sheet matched only in its body shows the matching passage from its text instead, set off with `…` and redlined, and along the bottom its tags, then the sheet number `NNN` in `ink` at the left and the date in `ink-2` (or `# undated`) at the right. The tags are a wrapping line of `#name` buttons in `ink-2`, 1.5ch apart and 8px above the number, and a sheet without tags has no tag line. A tag turns `rose-ink` and underlines on hover. Clicking it adds the tag to find (finishing a `#tag` left half-typed there), and a tag that matched is redlined as far as the query reached. The cell is a `li`, and its link (title and summary) is stretched over the whole cell, so a click anywhere but a tag opens the page. The tags sit above that link as their own buttons. On hover or keyboard focus the cell tints to 60% `ground-2` and four `rose-ink` registration crosses fade in on its corners (150ms, expo). Hover also turns the title `rose-ink`. Keyboard focus adds a 2px `rose-ink` outline drawn 2px inside the cell. Arrow keys or `h j k l` walk the grid in its rendered layout, so up and down move by the actual column count. Home and End jump to the ends, and up from the first row returns to find. Returning from a page focuses and centres the sheet you left. A sheet shows no kind label or badge.

### Redline
A search match. The matched words are wrapped in a `mark` whose `rose-wash` fill sweeps in from the left (180ms, expo) over a 1px `rose` underline, and the text keeps its own colour. Redlines appear in sheet titles, summaries, body passages, tags, and the tags row's completions, and `prefers-reduced-motion` removes the sweep.

### Note (empty states)
A `#` comment set straight into the sheet row: `ink-3` label text padded 24px by 3ch. It reads `# nothing published yet` when there are no pages. When nothing matches it reads `# no sheet matches "…" · clear to show all N`, where `clear` is a `rose-ink` link-button with a `rose` underline that turns `ink` on hover.

### Footer
The last row of the index, in `ink-3` Label text, drawn only from 640px and only when there are sheets. It holds nothing but the key hints, set at the right: `/ find`, `# tag`, the four arrow-key icons then `move` (lucide `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` at 14px, stroke 2, in `ink-2`, with an `arrow keys` label for screen readers), `enter open`, each key in `ink-2` at 500.

### Page Reader
One sheet at full size between the rails: the nav rule, the title block, a path row with the `kind/slug` path in `ink-3`, then the page's tags as `#name` links in `ink-2` (each opens the index with that tag in find), and `h back to all sheets` (where `h` is an `ink` key at 500) at the far end, then the prose. `h` or `q` returns to the index with this sheet focused.

### Mark (logo)
A single `/`, the key that opens search, drawn as the site's mark. It is one 8-unit `rose` slash set at Fira Code's own angle (atan 1755/849, about 64°) and square-ended like the glyph. On a 64-unit box it runs from (22.32, 52) to (41.68, 12), centred on the box. It sits on a pure white (`#fff`) squircle with a transparent exterior, the same enclosure and fill puzzles' favicon uses, so the two read as one family. Nothing else is drawn: no key box, no ticks, and no construction marks. `public/favicon.svg` is the only source. `scripts/icons.ts` renders `favicon.ico` (16, 32, and 48) and a full-bleed white square `apple-touch-icon.png` (180), since iOS rounds its own corners. `scripts/readme-banner/build.py` sets the mark beside `docs` in `ink` and `.osm.sh` in `ink-3`, outlined in Fira Code 500, on the same rounded paper card puzzles' README uses. The mark appears only as an icon and in the README. It never appears inside the drawing, which keeps the nav rule and the title block as they are.

## Do's and Don'ts

### Do:
- **Do** set everything in Fira Code with ligatures off on a 16px base, and measure horizontal insets in `ch`.
- **Do** open every surface with the labelled hairline nav rule as the drawing's first full-width rule, `──┼─ docs.osm.sh ──── osm.sh │ puzzles ─┼──`.
- **Do** build every surface as one ruled drawing: a column of at most 76rem between full-height `rule` rails, rows cut by full-width `rule` hairlines, and an 11px `ink-3` registration cross wherever a rule crosses a rail.
- **Do** let cells share their edges. Each cell draws only its right and bottom, so no line is ever doubled.
- **Do** mark the sheet in hand with four `rose-ink` corner crosses and a 60% `ground-2` tint.
- **Do** lay the drawing on the `table`, with the 28px hatch band beside each rail and a construction grid on the 16px unit in every title block's lettering cell.
- **Do** keep search first: the find row sits directly under the title block, `/` reaches it from anywhere, and matches are redlined in `rose-wash` over a `rose` underline.
- **Do** write tags as `#name` in `ink-2` with no space after the `#`, and keep `# ` with a space for comments.
- **Do** set every page as one numbered sheet (`001`, counting up from the oldest) in a single set, newest first.
- **Do** write missing values as `#` comments in `ink-3` (`# none`, `# undated`, `# no summary`, `# nothing published yet`) and keep counts true (`0 sheets`).
- **Do** keep motion to the redline sweep (180ms), the find stroke (200ms), and colour, tint, and mark fades (150ms), all on `--ease-out-expo`, and honour `prefers-reduced-motion`.
- **Do** theme the browser: `rose` selection, `rose-ink` caret and focus ring, a thin `rule` scrollbar on a `ground-2` track, `color-scheme: light`, and `theme-color` set to the ground.

### Don't:
- **Don't** distinguish article kinds on the index with tabs, badges, colour, or grouping. Kinds live only in directories and URL segments.
- **Don't** put a second surface or a texture inside the column beyond the title block's construction grid. That rules out a gridded mat, cards, panels, and noise or grain anywhere. Texture is drafting linework: the margin hatch and the construction grid.
- **Don't** knock the hatch out behind a mark. A paper patch under a registration cross breaks the rail it sits on.
- **Don't** draw a line in any colour but `rule`, or heavier than 1px. Show emphasis with a mark, never by darkening a line.
- **Don't** introduce a second typeface or a chrome weight above 500.
- **Don't** round a corner. `--radius` is 0.
- **Don't** add a drop shadow or blur, or use a gradient as a tonal fill. Gradients in this system only draw hard-stop lines (the registration crosses, the sheet marks, the ruler ticks, the margin hatch, the construction grid) or a flat wash (the redline).
- **Don't** put rose anywhere but a redline, a focus mark, the marks on the sheet in hand, a hovered link or tag, the selection, or the mark's slash.
- **Don't** turn the index into a dashboard or a marketing hero (stat tiles, featured heroes, tag clouds), or into an app shell with a sidebar of sections. The title block's fields are the only figures. Tags show only on their own sheets, on their page, and in the tags row while a `#tag` is being typed. Nothing lists them at rest.
- **Don't** ship a dark theme. This is a whiteprint in daylight.
- **Don't** invent sheets, dates, summaries, or counts to fill an empty grid.
