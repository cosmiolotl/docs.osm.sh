import { useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { loadPage } from '@/server/content.fn'
import { sheetNo } from '@/lib/kinds'
import { SiteHeader } from '@/components/SiteHeader'
import { Fields, Margin, Row } from '@/components/Bench'
import { Markdown } from '@/components/Markdown'

export const Route = createFileRoute('/$kind/$')({
  loader: ({ params }) => loadPage({ data: { kind: params.kind, slug: params._splat ?? '' } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} · docs.osm.sh` : 'docs.osm.sh' },
      ...(loaderData?.summary ? [{ name: 'description', content: loaderData.summary }] : []),
    ],
  }),
  component: PageView,
})

/*
  A page is the same drawing at full size: its title block across the
  top, then the prose in the rails. h (or q) goes back to the index with
  this sheet focused, the way you left it. Its tags sit in the path row,
  each a link back to the index with that tag in find.
*/
function PageView() {
  const page = Route.useLoaderData()
  const navigate = useNavigate()
  const at = `${page.kind}/${page.slug}`

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if ((e.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'h' || e.key === 'q') {
        e.preventDefault()
        navigate({ to: '/', search: { at } })
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [navigate, at])

  return (
    <div className="flex flex-col min-h-dvh">
      <SiteHeader trail={[{ label: page.title }]} />
      <main className="flex-1 flex flex-col">
        <Row open label="Title block" className="grid grid-cols-1 sm:grid-cols-[1fr_30ch]">
          <div className="title-cell px-[3ch] pt-12 pb-10 sm:py-14">
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.025em] text-balance">
              {page.title}
            </h1>
          </div>
          <Fields
            fields={[
              { label: 'sheet', value: sheetNo(page.no) },
              { label: 'date', value: page.date ?? '# undated', muted: !page.date },
            ]}
          />
        </Row>
        <Row className="flex flex-wrap items-center gap-x-[2ch] gap-y-1 px-[3ch] py-3 text-sm">
          <span className="text-ink-3 truncate min-w-0">{at}</span>
          {page.tags.length > 0 && (
            <ul aria-label="tags" className="flex flex-wrap gap-x-[1.5ch] min-w-0">
              {page.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    to="/"
                    search={{ q: `#${tag}` }}
                    className="text-ink-2 no-underline hover:underline hover:text-rose-ink transition-colors duration-150"
                  >
                    <span className="sr-only">find tag </span>#{tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/"
            search={{ at }}
            className="ml-auto shrink-0 text-ink-2 no-underline hover:underline hover:text-rose-ink transition-colors duration-150"
          >
            <kbd className="font-medium text-ink">h</kbd> back to all sheets
          </Link>
        </Row>
        <Row grow label="Page" className="px-[3ch] pt-10 pb-16">
          <Markdown source={page.body} className="max-w-[76ch]" />
        </Row>
      </main>
      <Margin ruled className="h-10" />
    </div>
  )
}
