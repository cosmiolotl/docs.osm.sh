import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { useNavigate } from '@tanstack/react-router'
import { entryHref, type Entry } from '@/lib/kinds'
import { SiteHeader } from '@/components/SiteHeader'
import { Margin, Row } from '@/components/Bench'
import { Sheet } from '@/components/Sheet'
import { TagCompletions } from '@/components/TagCompletions'
import { Ruler } from '@/components/Ruler'
import { WorkbenchTitle } from '@/components/WorkbenchTitle'
import { WorkbenchFooter } from '@/components/WorkbenchFooter'
import { findPages } from '@/server/content.fn'
import {
  hasTags,
  parseQuery,
  queryWords,
  tagAt,
  tokenize,
  type Hit,
} from '@/lib/search'

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

/**
  Before the server answers the first search, sheets are narrowed by what
  the browser already holds: every query word must begin some word of
  the title, summary, tags, or path, and every `#tag` must begin one of
  the sheet's tags. The server's full-text hits replace this as soon as
  they land. A query of tags alone never needs the server.
*/
function provisional(entries: Entry[], words: string[], tags: string[]) {
  return entries.filter((e) => {
    if (!hasTags(e.tags, tags)) return false
    const have = tokenize(`${e.title} ${e.summary ?? ''} ${e.slug} ${e.tags.join(' ')}`).map((t) => t.term)
    return words.every((w) => have.some((t) => t.startsWith(w)))
  })
}

type Shown = { entry: Entry; hit?: Hit }

/*
  The index: one ruled drawing. The knowledgebase's title block is the
  banner, the find row under it searches the full text of every page, and
  every page is a cell of the sheet grid below. / finds, arrows walk the sheets, enter opens.
  Every sheet is a plain link, so pointer, tab, and crawler all get the
  same page. A `#` in find starts a tag: the tags row under find offers
  the set's tags that begin it, and tab takes the first.
*/
export function Workbench({ entries, q = '', at }: { entries: Entry[]; q?: string; at?: string }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(q)
  const [caret, setCaret] = useState(q.length)
  const [focused, setFocused] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const grid = useRef<HTMLUListElement>(null)

  const parsed = useMemo(() => parseQuery(query), [query])
  const words = useMemo(() => queryWords(parsed), [parsed])
  const tags = parsed.tags
  const active = words.length > 0 || tags.length > 0
  const [results, setResults] = useState<{ q: string; hits: Hit[] | null } | null>(null)
  const total = entries.length

  // Every tag in the set, the most used first.
  const tagSet = useMemo(() => {
    const counts = new Map<string, number>()
    for (const e of entries) for (const t of e.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
    return [...counts]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
  }, [entries])

  // The #tag being typed, and the set's tags it could become. A tag the
  // query already names elsewhere is not offered twice; the exact tag leads.
  const completing = useMemo(() => (focused ? tagAt(query, caret) : null), [focused, query, caret])
  const completions = useMemo(() => {
    if (!completing) return []
    const { prefix, start, end } = completing
    const named = parseQuery(query.slice(0, start) + query.slice(end)).tags
    return tagSet
      .filter(({ tag }) => tag.startsWith(prefix) && !named.includes(tag))
      .sort((a, b) => Number(b.tag === prefix) - Number(a.tag === prefix))
  }, [completing, query, tagSet])
  // A tag typed out in full, with nothing longer to become, has nothing to offer.
  const offering = completing !== null && !(completions.length === 1 && completions[0].tag === completing.prefix)

  // Set the query and put the caret back in find at `to`.
  const place = (next: string, to: number) => {
    setQuery(next)
    setCaret(to)
    requestAnimationFrame(() => {
      input.current?.focus()
      input.current?.setSelectionRange(to, to)
    })
  }

  // Take a completion: the #tag being typed becomes the whole tag and a space.
  const complete = (tag: string) => {
    if (!completing) return
    const before = query.slice(0, completing.start)
    const after = query.slice(completing.end)
    const spaced = after.startsWith(' ')
    const insert = `#${tag}${spaced ? '' : ' '}`
    place(before + insert + after, before.length + insert.length + (spaced ? 1 : 0))
  }

  // A tag picked off a sheet joins the query, finishing a #tag left half-typed at its end.
  const addTag = (tag: string) => {
    const open = tagAt(query, query.length)
    if (!open && tags.includes(tag)) {
      input.current?.focus()
      return
    }
    const base = open && tag.startsWith(open.prefix) ? query.slice(0, open.start) : query
    const next = `${base.trimEnd()}${base.trim() ? ' ' : ''}#${tag} `
    place(next, next.length)
  }

  // Full-text search runs on the server, against the inverted index over
  // every page's body; tags alone are answered here. Answers that arrive
  // after a newer query are dropped.
  const asked = useRef(0)
  useEffect(() => {
    if (words.length === 0) {
      setResults(null)
      return
    }
    const id = ++asked.current
    const timer = setTimeout(() => {
      findPages({ data: { q: query } })
        .then((hits) => id === asked.current && setResults({ q: query, hits }))
        .catch(() => id === asked.current && setResults({ q: query, hits: null }))
    }, 120)
    return () => clearTimeout(timer)
  }, [query, words.length])

  const byKey = useMemo(() => new Map(entries.map((e) => [`${e.kind}/${e.slug}`, e])), [entries])
  const pending = words.length > 0 && results?.q !== query
  // A failed search falls back to titles and summaries, and says so.
  const partial = words.length > 0 && results?.hits === null
  const shown: Shown[] = useMemo(() => {
    if (!active) return entries.map((entry) => ({ entry }))
    if (words.length === 0 || !results || results.hits === null)
      return provisional(entries, words, tags).map((entry) => ({ entry }))
    return results.hits.flatMap((hit) => {
      const entry = byKey.get(`${hit.kind}/${hit.slug}`)
      return entry ? [{ entry, hit }] : []
    })
  }, [entries, active, words, tags, results, byKey])

  // The query rides in the URL, so a search can be linked and survives back.
  useEffect(() => {
    if (query === q) return
    const id = setTimeout(() => {
      navigate({ to: '/', search: query ? { q: query } : {}, replace: true, resetScroll: false })
    }, 200)
    return () => clearTimeout(id)
  }, [query, q, navigate])

  const sheets = useCallback(
    () => Array.from(grid.current?.querySelectorAll<HTMLAnchorElement>('a.sheet-link') ?? []),
    [],
  )

  // Back from a page: the sheet you left is focused and in view.
  useEffect(() => {
    if (!at) return
    const el = sheets().find((a) => a.dataset.at === at)
    if (el) {
      el.focus({ preventScroll: true })
      el.scrollIntoView({ block: 'center' })
    }
  }, [at, sheets])

  // Arriving fresh with a pointer and keyboard, the caret waits in find.
  // Touch screens are spared the keyboard popping up.
  useEffect(() => {
    if (!at && window.matchMedia('(pointer: fine)').matches) input.current?.focus({ preventScroll: true })
  }, [at])

  // / finds from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === '/') {
        e.preventDefault()
        input.current?.focus()
        input.current?.select()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const onFindKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    // Already in find: a leading / is the habit of the shortcut, not a query.
    if (e.key === '/' && !query) {
      e.preventDefault()
    } else if (e.key === 'Tab' && !e.shiftKey && offering && completions.length) {
      e.preventDefault()
      complete(completions[0].tag)
    } else if (e.key === 'Escape') {
      if (query) place('', 0)
      else input.current?.blur()
      e.preventDefault()
    } else if (e.key === 'ArrowDown') {
      const first = sheets()[0]
      if (first) {
        e.preventDefault()
        first.focus()
      }
    } else if (e.key === 'Enter' && active && shown[0]) {
      e.preventDefault()
      navigate({ to: entryHref(shown[0].entry) })
    }
  }

  // Arrows walk the sheets as the grid lays them out: left and right by
  // one, up and down by a row. Up from the first row returns to find.
  const onGridKey = (e: ReactKeyboardEvent<HTMLUListElement>) => {
    const list = sheets()
    const i = list.indexOf(document.activeElement as HTMLAnchorElement)
    if (i < 0) return
    const cols = grid.current ? getComputedStyle(grid.current).gridTemplateColumns.split(' ').length : 1
    let next = i
    switch (e.key) {
      case 'ArrowRight':
      case 'l':
        next = Math.min(list.length - 1, i + 1)
        break
      case 'ArrowLeft':
      case 'h':
        next = Math.max(0, i - 1)
        break
      case 'ArrowDown':
      case 'j':
        next = Math.min(list.length - 1, i + cols)
        break
      case 'ArrowUp':
      case 'k':
        if (i < cols) {
          e.preventDefault()
          input.current?.focus()
          return
        }
        next = i - cols
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = list.length - 1
        break
      default:
        return
    }
    e.preventDefault()
    list[next]?.focus()
    list[next]?.scrollIntoView({ block: 'nearest' })
  }

  return (
    <div className="workbench flex flex-col min-h-dvh">
      <SiteHeader />

      <main className="flex-1 flex flex-col">
        <WorkbenchTitle entries={entries} />

        <Row label="Find">
          <div className="group relative flex flex-wrap sm:flex-nowrap items-center gap-x-[2ch] gap-y-3 px-[3ch] py-6 sm:py-0 sm:min-h-[7.5rem] focus-within:bg-[color-mix(in_srgb,var(--rose-wash)_20%,var(--ground))] transition-colors duration-150">
            <label htmlFor="find" className="text-sm text-ink-2 shrink-0">
              find
            </label>
            <input
              ref={input}
              id="find"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setCaret(e.target.selectionStart ?? e.target.value.length)
              }}
              onSelect={(e) => setCaret(e.currentTarget.selectionStart ?? query.length)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={onFindKey}
              placeholder="search sheets, #tags"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-controls="sheets"
              aria-describedby="find-count"
              className="find-input order-last sm:order-none basis-full sm:basis-auto flex-1 min-w-0 bg-transparent text-[clamp(1.5rem,3.25vw,2.5rem)] leading-tight tracking-[-0.02em] text-ink outline-none"
            />
            <span
              id="find-count"
              aria-live="polite"
              aria-busy={pending}
              className={`ml-auto sm:ml-0 text-sm tabular-nums whitespace-nowrap transition-colors duration-150 ${pending ? 'text-ink-3' : 'text-ink-2'}`}
            >
              {active ? `${shown.length} of ${total}${partial ? ' · titles only' : ''}` : plural(total, 'sheet')}
            </span>
            {query ? (
              <button
                type="button"
                onClick={() => place('', 0)}
                className="text-sm text-ink-2 hover:text-rose-ink hover:underline transition-colors duration-150 cursor-pointer"
              >
                clear
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center justify-center w-[3ch] h-6 border border-rule text-sm text-ink-2 group-focus-within:hidden">
                /
              </kbd>
            )}
            {/* The find row's focus mark: a redline drawn along its bottom rule. */}
            <span
              aria-hidden="true"
              className="absolute z-[1] left-0 right-0 -bottom-px h-0.5 bg-rose-ink scale-x-0 origin-left group-focus-within:scale-x-100 transition-transform duration-200 ease-[var(--ease-out-expo)] motion-reduce:transition-none"
            />
          </div>
        </Row>

        {completing && offering && (
          <TagCompletions
            prefix={completing.prefix}
            completions={completions}
            hasTags={tagSet.length > 0}
            onPick={complete}
          />
        )}

        <div className="hidden sm:block">
          <Row><Ruler /></Row>
        </div>

        <Row grow label="Sheets">
          {total === 0 ? (
            <p className="px-[3ch] py-6 text-sm text-ink-3"># nothing published yet</p>
          ) : shown.length === 0 ? (
            <p className="px-[3ch] py-6 text-sm text-ink-3">
              # no sheet matches “{query.trim()}” ·{' '}
              <button
                type="button"
                onClick={() => place('', 0)}
                className="text-rose-ink underline decoration-rose underline-offset-[0.2em] hover:text-ink cursor-pointer"
              >
                clear
              </button>{' '}
              to show all {total}
            </p>
          ) : (
            <ul
              id="sheets"
              ref={grid}
              onKeyDown={onGridKey}
              className="sheets grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
              {shown.map(({ entry, hit }) => (
                <Sheet
                  key={`${entry.kind}/${entry.slug}`}
                  entry={entry}
                  hit={hit}
                  words={words}
                  tags={tags}
                  onTag={addTag}
                />
              ))}
            </ul>
          )}
        </Row>

        {total > 0 && <WorkbenchFooter />}
      </main>
      <div className="hidden sm:block">
        <Margin ruled className="h-10" />
      </div>
    </div>
  )
}
