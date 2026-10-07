import { isKind, type Entry, type Page } from '@/lib/kinds'
import { parseTags } from '@/lib/search'

/*
  Every page is a Markdown file in content/<kind>/, bundled at build time.
  Frontmatter is a flat block of `key: value` lines:

    ---
    title: A knight in a minefield
    summary: One line for the index.
    date: 2026-09-25
    tags: chess, puzzles
    ---

  Tags are comma-separated (or a `[a, b]` list), and are folded to
  lowercase with spaces joined by `-`. Files whose name starts with `_`,
  or that set `draft: true`, are left out.
*/
const files = import.meta.glob('/content/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>

const DATE = /^\d{4}-\d{2}-\d{2}$/

function parse(raw: string): { meta: Record<string, string>; body: string } {
  const text = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text)
  if (!match) return { meta: {}, body: text }
  const meta: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const at = line.indexOf(':')
    if (at < 1) continue
    const key = line.slice(0, at).trim()
    let value = line.slice(at + 1).trim()
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1)
    meta[key] = value
  }
  return { meta, body: text.slice(match[0].length) }
}

function titleFromSlug(slug: string) {
  const last = slug.split('/').pop() ?? slug
  return last.replace(/[-_]+/g, ' ')
}

function load(): Page[] {
  const pages: Omit<Page, 'no'>[] = []
  for (const [path, raw] of Object.entries(files)) {
    const [kind, ...rest] = path.replace(/^\/content\//, '').replace(/\.md$/, '').split('/')
    if (!isKind(kind) || rest.length === 0) continue
    if (rest.some((part) => part.startsWith('_'))) continue
    const { meta, body } = parse(raw)
    if (meta.draft === 'true') continue
    const slug = rest.join('/')
    pages.push({
      kind,
      slug,
      title: meta.title || titleFromSlug(slug),
      summary: meta.summary || undefined,
      date: DATE.test(meta.date ?? '') ? meta.date : undefined,
      updated: DATE.test(meta.updated ?? '') ? meta.updated : import.meta.env.CONTENT_REVISIONS[path],
      tags: parseTags(meta.tags),
      body,
    })
  }
  // Newest first; undated pages after dated ones, then by title. Sheet
  // numbers count up from the oldest, so the newest sheet carries the highest.
  pages.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title))
  return pages.map((p, i) => ({ ...p, no: pages.length - i }))
}

const pages = load()

export function listEntries(): Entry[] {
  return pages.map(({ body: _body, ...entry }) => entry)
}

/** Every published page with its body, newest first. */
export function allPages(): readonly Page[] {
  return pages
}

export function findPage(kind: string, slug: string): Page | undefined {
  return pages.find((p) => p.kind === kind && p.slug === slug)
}
