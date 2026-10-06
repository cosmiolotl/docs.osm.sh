import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'

export const loadIndex = createServerFn({ method: 'GET' }).handler(async () => {
  const { listEntries } = await import('@/server/content')
  return listEntries()
})

export const loadPage = createServerFn({ method: 'GET' })
  .validator((d: { kind: string; slug: string }) => ({ kind: String(d.kind), slug: String(d.slug) }))
  .handler(async ({ data }) => {
    const { findPage } = await import('@/server/content')
    const page = findPage(data.kind, data.slug)
    if (!page) throw notFound()
    return page
  })

/*
  Full-text search over every page's title, summary, and body. The index
  lives on the server; the browser only ever receives ranked hits and a
  snippet of text around each match.
*/
export const findPages = createServerFn({ method: 'GET' })
  .validator((d: { q: string }) => ({ q: String(d.q ?? '').slice(0, 200) }))
  .handler(async ({ data }) => {
    const { searchPages } = await import('@/server/search')
    return searchPages(data.q)
  })
