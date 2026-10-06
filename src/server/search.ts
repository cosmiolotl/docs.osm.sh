import { allPages } from '@/server/content'
import { buildIndex, search, type Index } from '@/lib/search-index'
import { isEmpty, parseQuery, type Hit } from '@/lib/search'

/*
  The index is built the first time anyone searches, from the same
  bundled pages the site renders, and kept for the life of the Worker
  isolate. Content only changes on deploy, and a deploy starts fresh.
*/
let index: Index | undefined

export function searchPages(input: string): Hit[] {
  const query = parseQuery(input)
  if (isEmpty(query)) return []
  index ??= buildIndex(allPages())
  return search(index, query)
}
