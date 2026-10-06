import { hasTags, tokenize, type Field, type Hit, type Query, type Segment } from '@/lib/search'

/*
  An inverted index over every page: for each word, the pages it appears
  in and where, field by field. Built once from the Markdown and kept in
  memory; the whole knowledgebase is small enough that this is cheap.

  Ranking is BM25 per field, with the title weighted over the tags and
  summary, and those over the body. Every loose query word must appear
  somewhere in a page; the last one is usually half-typed, so each word
  also matches the longer words it begins, at a discount. Quoted phrases
  must appear word for word. A `#tag` is a filter, not a word: the page
  must carry that tag, or one it begins.
*/

export interface Source {
  kind: string
  slug: string
  title: string
  summary?: string
  tags?: readonly string[]
  body: string
}

const FIELDS: Field[] = ['title', 'tags', 'summary', 'body']
const BOOST: Record<Field, number> = { title: 3, tags: 2, summary: 2, body: 1 }
const K1 = 1.2
const B = 0.75
/** A word that only begins the indexed word counts for less than the word itself. */
const PREFIX_WEIGHT = 0.6
/** Single letters match only themselves, or `a` would match half the language. */
const MIN_PREFIX = 2
/** Enough expansions to cover a real prefix, few enough that `s` stays cheap. */
const MAX_EXPANSIONS = 64
const SNIPPET_WORDS = 28
const SNIPPET_LEAD = 8

interface Doc {
  kind: string
  slug: string
  tags: readonly string[]
  /** Plain text of the body, with the tokens' character ranges into it. */
  text: string
  starts: number[]
  ends: number[]
  length: Record<Field, number>
}

/** Positions of one word in one page, per field. */
type Postings = Partial<Record<Field, number[]>>

export interface Index {
  docs: Doc[]
  /** word -> page -> positions */
  words: Map<string, Map<number, Postings>>
  /** Every indexed word, sorted, for prefix lookups. */
  sorted: string[]
  average: Record<Field, number>
}

/**
  Markdown down to the words a reader sees. Code keeps its text (it is
  often what someone searches for), links keep their label, and the
  markup itself goes.
*/
export function plainText(md: string) {
  return md
    .replace(/^```[^\n]*$/gm, ' ')
    .replace(/^~~~[^\n]*$/gm, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*\[[^\]]+\]:\s*\S+.*$/gm, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[`*_~#>|$\\{}]/g, ' ')
    .replace(/^\s*(?:[-+]|\d+[.)])\s+/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function buildIndex(sources: readonly Source[]): Index {
  const docs: Doc[] = []
  const words = new Map<string, Map<number, Postings>>()
  const total: Record<Field, number> = { title: 0, tags: 0, summary: 0, body: 0 }

  sources.forEach((src, id) => {
    const text = plainText(src.body)
    const fields: Record<Field, ReturnType<typeof tokenize>> = {
      title: tokenize(src.title),
      tags: tokenize((src.tags ?? []).join(' ')),
      summary: tokenize(src.summary ?? ''),
      body: tokenize(text),
    }
    for (const field of FIELDS) {
      fields[field].forEach((t, pos) => {
        let pages = words.get(t.term)
        if (!pages) words.set(t.term, (pages = new Map()))
        let postings = pages.get(id)
        if (!postings) pages.set(id, (postings = {}))
        ;(postings[field] ??= []).push(pos)
      })
      total[field] += fields[field].length
    }
    docs.push({
      kind: src.kind,
      slug: src.slug,
      tags: src.tags ?? [],
      text,
      starts: fields.body.map((t) => t.start),
      ends: fields.body.map((t) => t.end),
      length: {
        title: fields.title.length,
        tags: fields.tags.length,
        summary: fields.summary.length,
        body: fields.body.length,
      },
    })
  })

  const n = Math.max(1, docs.length)
  return {
    docs,
    words,
    sorted: [...words.keys()].sort(),
    average: {
      title: total.title / n || 1,
      tags: total.tags / n || 1,
      summary: total.summary / n || 1,
      body: total.body / n || 1,
    },
  }
}

/** The indexed words a query word stands for: itself, and the words it begins. */
function expand(index: Index, word: string): { word: string; weight: number }[] {
  if (word.length < MIN_PREFIX) return index.words.has(word) ? [{ word, weight: 1 }] : []
  // Binary search for the first indexed word >= the prefix, then walk.
  let lo = 0
  let hi = index.sorted.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (index.sorted[mid] < word) lo = mid + 1
    else hi = mid
  }
  const out: { word: string; weight: number }[] = []
  for (let i = lo; i < index.sorted.length && out.length < MAX_EXPANSIONS; i++) {
    const w = index.sorted[i]
    if (!w.startsWith(word)) break
    out.push({ word: w, weight: w === word ? 1 : PREFIX_WEIGHT })
  }
  return out
}

function bm25(index: Index, tf: number, df: number, field: Field, length: number) {
  const n = index.docs.length
  const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5))
  const norm = tf + K1 * (1 - B + (B * length) / index.average[field])
  return (idf * tf * (K1 + 1)) / norm
}

/** Positions in `field` of `doc` where the phrase starts, or none. */
function phraseAt(index: Index, doc: number, field: Field, phrase: string[]): number[] {
  const lists = phrase.map((w) => index.words.get(w)?.get(doc)?.[field])
  if (lists.some((l) => !l)) return []
  const later = lists.slice(1).map((l) => new Set(l))
  return lists[0]!.filter((p) => later.every((set, i) => set.has(p + i + 1)))
}

export function search(index: Index, query: Query, limit = 200): Hit[] {
  const scores = new Map<number, number>()
  const matched = new Map<number, Set<Field>>()
  /** Body positions to show in the snippet, per page. */
  const bodyHits = new Map<number, Set<number>>()
  let candidates: Set<number> | null = null

  const note = (doc: number, field: Field, positions?: number[]) => {
    let set = matched.get(doc)
    if (!set) matched.set(doc, (set = new Set()))
    set.add(field)
    if (field === 'body' && positions) {
      let hits = bodyHits.get(doc)
      if (!hits) bodyHits.set(doc, (hits = new Set()))
      for (const p of positions) hits.add(p)
    }
  }
  const narrow = (docs: Set<number>) => {
    candidates = candidates ? new Set([...candidates].filter((d) => docs.has(d))) : docs
  }

  // Tags only filter; with no words beside them, every tagged page stays, newest first.
  if (query.tags.length) {
    const docs = new Set<number>()
    index.docs.forEach((d, id) => {
      if (!hasTags(d.tags, query.tags)) return
      docs.add(id)
      note(id, 'tags')
    })
    narrow(docs)
  }

  for (const term of query.terms) {
    const docs = new Set<number>()
    const best = new Map<number, number>()
    for (const { word, weight } of expand(index, term)) {
      const pages = index.words.get(word)!
      for (const [doc, postings] of pages) {
        docs.add(doc)
        let s = 0
        for (const field of FIELDS) {
          const positions = postings[field]
          if (!positions) continue
          s += BOOST[field] * bm25(index, positions.length, pages.size, field, index.docs[doc].length[field])
          note(doc, field, positions)
        }
        // A word and its longer forms are one term: keep the best, don't pile them up.
        best.set(doc, Math.max(best.get(doc) ?? 0, s * weight))
      }
    }
    narrow(docs)
    for (const [doc, s] of best) scores.set(doc, (scores.get(doc) ?? 0) + s)
  }

  for (const phrase of query.phrases) {
    const docs = new Set<number>()
    const first = index.words.get(phrase[0])
    for (const doc of first?.keys() ?? []) {
      for (const field of FIELDS) {
        const starts = phraseAt(index, doc, field, phrase)
        if (starts.length === 0) continue
        docs.add(doc)
        const df = first!.size
        const s = BOOST[field] * bm25(index, starts.length, df, field, index.docs[doc].length[field]) * phrase.length
        scores.set(doc, (scores.get(doc) ?? 0) + s)
        note(doc, field, starts.flatMap((p) => phrase.map((_, i) => p + i)))
      }
    }
    narrow(docs)
  }

  const found: Set<number> = candidates ?? new Set()
  return [...found]
    .map((doc) => ({ doc, score: scores.get(doc) ?? 0 }))
    .sort((a, b) => b.score - a.score || a.doc - b.doc)
    .slice(0, limit)
    .map(({ doc, score }) => {
      const d = index.docs[doc]
      const hits = bodyHits.get(doc)
      return {
        kind: d.kind,
        slug: d.slug,
        score: Math.round(score * 1000) / 1000,
        fields: FIELDS.filter((f) => matched.get(doc)?.has(f)),
        ...(hits && hits.size ? { snippet: snippet(d, hits) } : {}),
      }
    })
}

/**
  The stretch of body text where the matches crowd closest: the window of
  words holding the most matched positions, opened a few words before the
  first of them so the reader gets the lead-in.
*/
function snippet(doc: Doc, hits: Set<number>) {
  const positions = [...hits].sort((a, b) => a - b)
  let bestStart = positions[0]
  let bestCount = 0
  for (let i = 0, j = 0; i < positions.length; i++) {
    while (positions[j] < positions[i] - SNIPPET_WORDS + SNIPPET_LEAD + 1) j++
    const count = i - j + 1
    if (count > bestCount) {
      bestCount = count
      bestStart = positions[j]
    }
  }
  const from = Math.max(0, bestStart - SNIPPET_LEAD)
  const to = Math.min(doc.starts.length - 1, from + SNIPPET_WORDS - 1)
  const segments: Segment[] = []
  let at = doc.starts[from]
  for (let p = from; p <= to; p++) {
    if (!hits.has(p)) continue
    if (doc.starts[p] > at) segments.push({ text: doc.text.slice(at, doc.starts[p]) })
    segments.push({ text: doc.text.slice(doc.starts[p], doc.ends[p]), hit: true })
    at = doc.ends[p]
  }
  const end = doc.ends[to]
  if (end > at) segments.push({ text: doc.text.slice(at, end) })
  return { segments, before: from > 0, after: to < doc.starts.length - 1 }
}
