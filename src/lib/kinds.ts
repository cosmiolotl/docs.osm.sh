/*
  The three kinds of page. Each is a directory under content/ and a segment
  of the URL; the index sets them all as one set of sheets.
*/
export const KINDS = ['writing', 'projects', 'notes'] as const
export type Kind = (typeof KINDS)[number]

export function isKind(value: string): value is Kind {
  return (KINDS as readonly string[]).includes(value)
}

/** What the index needs of a page. The body never leaves the server for it. */
export interface Entry {
  kind: Kind
  /** Path under the kind's directory, without `.md`: `osm.sh/deploy`. */
  slug: string
  title: string
  summary?: string
  /** `YYYY-MM-DD`, when the file gives one. */
  date?: string
  /** Folded and in the file's order: `blood-on-the-clocktower`. Empty when it gives none. */
  tags: string[]
  /** Sheet number in the set: 1 is the oldest page, the newest is the highest. */
  no: number
}

export interface Page extends Entry {
  body: string
}

/** `7` -> `007`, the way a drawing set numbers its sheets. */
export function sheetNo(n: number) {
  return String(n).padStart(3, '0')
}

export function entryHref(e: Pick<Entry, 'kind' | 'slug'>) {
  return `/${e.kind}/${e.slug}`
}
