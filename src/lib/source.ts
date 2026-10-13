import { loader, update } from 'fumadocs-core/source'
import { pageSchema } from 'fumadocs-core/source/schema'
import { defineDocs } from 'fumadocs-mdx/macro'
import { z } from 'zod'

/*
  Every page is an MDX file under content/<kind>/, where the kind is
  `writing`, `projects`, or `notes`; the path is the address, so
  content/projects/kurry/privacy.mdx is /projects/kurry/privacy.

    ---
    title: A knight in a minefield
    description: One line, shown in listings and search.
    date: 2026-09-25
    updated: 2026-10-01
    tags: [chess, puzzles]
    featured: true
    ---

  Tags are folded to lowercase with spaces joined by `-`. A file whose
  name starts with `_` is never published. One that sets `draft: true`
  is published only by the dev server, marked as a draft.
*/

/** `YYYY-MM-DD`, whether YAML read it as a string or a date. */
const day = z
  .union([z.string(), z.date()])
  .transform((v) => (typeof v === 'string' ? v : v.toISOString().slice(0, 10)))
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))

/** `#Blood on the Clocktower` and `blood-on-the-clocktower` are one tag. */
function foldTag(raw: string) {
  return raw
    .trim()
    .replace(/^#+/, '')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
}

const tags = z
  .union([z.array(z.string()), z.string()])
  .transform((v) => [...new Set((typeof v === 'string' ? v.split(',') : v).map(foldTag).filter(Boolean))])

export const docs = defineDocs({
  dir: 'content',
  docs: {
    async: true,
    lastModified: true,
    schema: pageSchema.extend({
      date: day.optional(),
      updated: day.optional(),
      tags: tags.default([]),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
    }),
  },
})

const files = docs.toFumadocsSource().files
const hidden = (path: string) => path.split('/').some((part) => part.startsWith('_'))

/** Every page that could be published, drafts included, for the index's featured slot. */
export const candidates = files.flatMap((file) => (file.type === 'page' && !hidden(file.path) ? [file] : []))

const published = update(docs.toFumadocsSource())
  .files((files) => {
    const pages = files.filter(
      (file) => file.type === 'page' && !hidden(file.path) && (!file.data.draft || import.meta.env.DEV),
    )
    // A folder's meta.json only stays while a published page sits under it,
    // so a kind with nothing in it yet is not an empty folder in the sidebar.
    const dirs = new Set(pages.flatMap((page) => page.path.split('/').slice(0, -1).map((_, i, parts) => parts.slice(0, i + 1).join('/'))))
    const metas = files.filter((file) => {
      if (file.type !== 'meta') return false
      const dir = file.path.split('/').slice(0, -1).join('/')
      return dir === '' || dirs.has(dir)
    })
    return [...pages, ...metas]
  })
  .build()

export const source = loader({
  source: published,
  baseUrl: '/',
})

export type Page = ReturnType<typeof source.getPages>[number]

/**
  Latest revision: frontmatter `updated`, else the file's last Git commit,
  else `date` when Git history is unavailable.
*/
export async function revised(page: Page): Promise<string | undefined> {
  if (page.data.updated) return page.data.updated
  const { lastModified } = await page.data.load()
  return lastModified?.toISOString().slice(0, 10) ?? page.data.date
}

/** Every published page, newest first; undated pages after dated ones, then by title. */
export function byDate(pages: Page[]) {
  return [...pages].sort(
    (a, b) => (b.data.date ?? '').localeCompare(a.data.date ?? '') || a.data.title.localeCompare(b.data.title),
  )
}

/** Minutes to read the body at 230 words a minute, never less than one. */
export async function readingMinutes(page: Page) {
  const { structuredData } = await page.data.load()
  const text = structuredData.contents.map((c) => c.content).join(' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 230))
}
