/*
  Search text: how words are cut and folded, shared by the index on the
  server and the highlighting in the browser, so what is marked is what
  matched.
*/

/** A run of letters or digits. Everything else separates words. */
const WORD = /[\p{L}\p{N}]+/gu

/** Lowercase, and fold accents away: `Café` and `cafe` are the same word. */
export function fold(word: string) {
  return word.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
}

export interface Token {
  term: string
  /** Character range of the word in the source text. */
  start: number
  end: number
}

export function tokenize(text: string): Token[] {
  const out: Token[] = []
  for (const m of text.matchAll(WORD)) {
    const term = fold(m[0])
    if (term) out.push({ term, start: m.index, end: m.index + m[0].length })
  }
  return out
}

/**
  A tag as frontmatter or a query names it: folded like a word, with any
  leading `#` dropped and inner spaces joined, so `#Blood on the Clocktower`
  and `blood-on-the-clocktower` are one tag.
*/
export function foldTag(raw: string) {
  return fold(raw.trim().replace(/^#+/, '')).replace(/\s+/g, '-')
}

/** `tags: a, b` or `tags: [a, b]`, folded, empty entries and repeats dropped. */
export function parseTags(raw: string | undefined): string[] {
  if (!raw) return []
  const list = raw.trim().replace(/^\[([\s\S]*)\]$/, '$1')
  return [...new Set(list.split(',').map((t) => foldTag(t.trim().replace(/^(['"])(.*)\1$/, '$2'))).filter(Boolean))]
}

export interface Query {
  /** Loose words: each must appear, and each also matches words it begins. */
  terms: string[]
  /** Quoted phrases: their words must appear in order, side by side. */
  phrases: string[][]
  /** `#tag`s: each must be a tag of the page, or begin one. */
  tags: string[]
}

/** A `#` that starts a word starts a tag; one inside a word (`c#`) does not. */
const TAG = /(^|\s)#([^\s#"]*)/g

/** `ssh "host key" #rust rat` -> terms ssh, rat; phrase host key; tag rust. */
export function parseQuery(input: string): Query {
  const phrases: string[][] = []
  const tags: string[] = []
  const rest = input
    .replace(/"([^"]*)"?/g, (_, inner: string) => {
      const words = tokenize(inner).map((t) => t.term)
      if (words.length > 1) phrases.push(words)
      else if (words.length === 1) return ` ${words[0]} `
      return ' '
    })
    .replace(TAG, (_, lead: string, name: string) => {
      const tag = foldTag(name)
      if (tag && !tags.includes(tag)) tags.push(tag)
      return `${lead} `
    })
  const terms = [...new Set(tokenize(rest).map((t) => t.term))]
  return { terms, phrases, tags }
}

export function isEmpty(q: Query) {
  return q.terms.length === 0 && q.phrases.length === 0 && q.tags.length === 0
}

/** Whether a page's tags answer every `#tag` of a query: each begins one of them. */
export function hasTags(pageTags: readonly string[], queryTags: readonly string[]) {
  return queryTags.every((q) => pageTags.some((t) => t.startsWith(q)))
}

/**
  The `#tag` the caret is in, when it is at that tag's end: what the find
  row offers to complete. `start` and `end` bound the whole `#word`.
*/
export function tagAt(input: string, caret: number): { prefix: string; start: number; end: number } | null {
  let start = caret
  while (start > 0 && !/\s/.test(input[start - 1])) start--
  let end = caret
  while (end < input.length && !/\s/.test(input[end])) end++
  const word = input.slice(start, end)
  if (caret !== end || !word.startsWith('#') || word.includes('"')) return null
  // An open quote before the caret makes this a phrase, not a tag.
  if ((input.slice(0, start).match(/"/g)?.length ?? 0) % 2 === 1) return null
  return { prefix: foldTag(word), start, end }
}

/** Every folded word the query names, loose or in a phrase. */
export function queryWords(q: Query) {
  return [...new Set([...q.terms, ...q.phrases.flat()])]
}

/** A run of snippet text, marked where it matched. */
export interface Segment {
  text: string
  hit?: boolean
}

export type Field = 'title' | 'tags' | 'summary' | 'body'

export interface Hit {
  kind: string
  slug: string
  score: number
  /** Which parts of the page matched. */
  fields: Field[]
  /** The passage of the body where the query words sit closest together. */
  snippet?: { segments: Segment[]; before: boolean; after: boolean }
}

/**
  Marks the words in `text` that a query matched: a word matches when its
  folded form begins with one of the query's words, the same test the
  index applies.
*/
export function markWords(text: string, words: string[]): Segment[] {
  if (words.length === 0) return [{ text }]
  const out: Segment[] = []
  let at = 0
  for (const t of tokenize(text)) {
    const hit = words.find((w) => t.term.startsWith(w))
    if (!hit) continue
    // Mark only the matched stretch of the word, as far as the query reached.
    const end = t.term === hit ? t.end : t.start + Math.min(hit.length, t.end - t.start)
    if (t.start > at) out.push({ text: text.slice(at, t.start) })
    out.push({ text: text.slice(t.start, end), hit: true })
    at = end
  }
  if (at < text.length) out.push({ text: text.slice(at) })
  return out
}

/**
  A tag as it is shown, `#name`, marked as far as a `#tag` of the query
  reached into it, or else where the query's words begin its words.
*/
export function markTag(tag: string, queryTags: string[], words: string[]): Segment[] {
  const reach = Math.max(-1, ...queryTags.filter((q) => tag.startsWith(q)).map((q) => q.length))
  if (reach < 0) return markWords(`#${tag}`, words)
  const out: Segment[] = [{ text: `#${tag.slice(0, reach)}`, hit: true }]
  if (reach < tag.length) out.push({ text: tag.slice(reach) })
  return out
}
