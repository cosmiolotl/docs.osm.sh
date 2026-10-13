import { Fragment, Suspense, use, useEffect, useRef, type ReactNode } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { docs } from '@/lib/source'
import { KIND, REPOSITORY, type Kind } from '@/lib/kinds'
import { loadPage, type Link as PageLink, type PageData, type ShelfData } from '@/server/docs.fn'
import { useMDXComponents } from '@/components/mdx'
import { Footer, HeaderBand, KindSquare } from '@/components/chrome'
import { Rail } from '@/components/rail'
import { Toc } from '@/components/toc'
import { Arrow, Lean } from '@/components/arrow'
import { usePageRead } from '@/hooks/usePageRead'

export const Route = createFileRoute('/$')({
  loader: async ({ params }) => {
    const slugs = (params._splat ?? '').split('/').filter(Boolean)
    const data = await loadPage({ data: slugs })
    if (data.type === 'page') await docs.getPage(data.path)?.preload()
    return data
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: 'docs.osm.sh' }] }
    if (loaderData.type === 'shelf') {
      const { title, blurb } = KIND[loaderData.kind]
      return { meta: [{ title: `${title} · docs.osm.sh` }, { name: 'description', content: blurb }] }
    }
    return {
      meta: [
        { title: `${loaderData.title} · docs.osm.sh` },
        ...(loaderData.description ? [{ name: 'description', content: loaderData.description }] : []),
      ],
    }
  },
  component: View,
})

function View() {
  const data = Route.useLoaderData()
  return data.type === 'shelf' ? <Shelf {...data} /> : <PageView key={data.url} {...data} />
}

/** Is the reader typing somewhere a key should go to the field, not the page? */
const typing = (e: KeyboardEvent) =>
  e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || !!(e.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable="true"]')

/* The title over the night band: where it sits, what it's called, and what it's for. */
function Title({ crumbs, kind, title, description, children }: { crumbs: string[]; kind: Kind; title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 pt-14 pb-10 md:px-12 md:pt-[72px] md:pb-12 lg:pl-[352px]">
      <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[13px] leading-4">
        <KindSquare kind={kind} />
        {crumbs.map((crumb, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <span aria-hidden="true" className="text-fd-ring">
                /
              </span>
            )}
            {i === 0 && crumbs.length > 1 ? (
              <Link to="/$" params={{ _splat: kind }} activeOptions={{ exact: true }} className="text-paper/60 hover:text-paper">
                {crumb}
              </Link>
            ) : (
              <span className={i === crumbs.length - 1 ? 'text-paper' : 'text-paper/60'}>{crumb}</span>
            )}
          </Fragment>
        ))}
        {children}
      </p>
      <h1 className="max-w-[720px] text-[36px] leading-10 font-semibold tracking-[-0.025em] text-balance text-paper md:text-[48px] md:leading-[52px]">
        {title}
      </h1>
      {description && <p className="max-w-[620px] text-[17px] leading-7 text-pretty text-paper/75 md:text-[19px]">{description}</p>}
    </div>
  )
}

function PageView(data: PageData) {
  const navigate = useNavigate()
  usePageRead(data.url)

  // h or q goes back to the index; ← and → step through the rail's order.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (typing(e)) return
      const to = { h: '/', q: '/', ArrowLeft: data.prev?.url, ArrowRight: data.next?.url }[e.key]
      if (!to) return
      e.preventDefault()
      navigate({ to })
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [navigate, data.prev, data.next])

  const rail = <Rail rail={data.rail} url={data.url} draft={data.draft} date={data.date} minutes={data.minutes} />

  return (
    <>
      <HeaderBand art="band">
        <Title crumbs={data.crumbs} kind={data.kind} title={data.title} description={data.description}>
          {data.draft && <span className="border border-fd-ring/70 px-1.5 py-0.5 text-[11px] leading-[14px] tracking-[0.08em] text-fd-ring uppercase">draft</span>}
          {data.kind === 'notes' && <span className="text-paper/60">· {data.minutes} min</span>}
        </Title>
      </HeaderBand>

      <main className="bg-paper text-ink">
        <Suspense fallback={<div className="min-h-[50vh]" />}>
          <Columns {...data} rail={rail} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

/*
  Rail, article, and what's on this page: 288 / 680 / 288 at full width.
  The rail folds above the article below 1024px; the contents go below 1280px.
*/
function Columns({ rail, ...data }: Omit<PageData, 'rail'> & { rail: ReactNode }) {
  const article = useRef<HTMLElement>(null)
  const page = docs.getPage(data.path)
  if (!page) throw new Error(`unknown page: ${data.path}`)
  const { toc } = use(page.load())
  const MDX = page.body

  return (
    <div className="mx-auto flex max-w-[1440px] items-start">
      <aside className="hidden w-[288px] shrink-0 self-stretch border-r border-fd-border pt-6 pr-6 pb-12 pl-12 lg:block">
        <div className="sticky top-6">{rail}</div>
      </aside>

      <div className="min-w-0 flex-1 px-6 pt-6 pb-24 md:px-16 xl:pr-0">
        <div className="mx-auto max-w-[680px] lg:mx-0">
          <details className="mb-6 border border-fd-border lg:hidden">
            <summary className="eyebrow cursor-pointer px-3 py-3 text-fd-muted-foreground">In {KIND[data.kind].title.toLowerCase()}</summary>
            <div className="border-t border-fd-border p-3">{rail}</div>
          </details>

          <Meta kind={data.kind} date={data.date} revised={data.revised} tags={data.tags} />

          <article ref={article} className="article mt-6">
            <MDX components={useMDXComponents()} />
          </article>

          {data.kind === 'projects' && (
            <div className="mt-12 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-fd-border pt-5 font-mono text-xs leading-4">
              <span className="text-fd-muted-foreground">
                {data.path}
                {data.revised && ` · updated ${data.revised}`}
              </span>
              <a href={`${REPOSITORY}/edit/main/content/${data.path}`} className="group text-fd-primary">
                suggest an edit <Lean>→</Lean>
              </a>
            </div>
          )}

          <Pager kind={data.kind} prev={data.prev} next={data.next} />
        </div>
      </div>

      {data.kind !== 'notes' && (
        <aside className="sticky top-0 hidden w-[288px] shrink-0 pt-6 pr-12 pl-6 xl:block">
          <Toc toc={toc} article={article} />
        </aside>
      )}
    </div>
  )
}

/** The date (or, for project docs, the latest revision) and the tags. */
function Meta({ kind, date, revised, tags }: { kind: Kind; date?: string; revised?: string; tags: string[] }) {
  const when = kind === 'projects' ? revised && `updated ${revised}` : date
  return (
    <p className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-fd-border pb-5 font-mono text-[13px] leading-4">
      <span className={when ? 'text-ink tabular-nums' : 'text-fd-muted-foreground'}>{when || '# undated'}</span>
      {tags.map((tag) => (
        <span key={tag} className="text-fd-muted-foreground">
          #{tag}
        </span>
      ))}
    </p>
  )
}

const PAGER = {
  writing: ['previous in writing', 'next in writing'],
  notes: ['older note', 'newer note'],
  projects: ['previous', 'next'],
} satisfies Record<Kind, [string, string]>

function Pager({ kind, prev, next }: { kind: Kind; prev?: PageLink; next?: PageLink }) {
  const [before, after] = PAGER[kind]
  const cell = (link: PageLink | undefined, label: string, end: boolean) => {
    const inner = (
      <>
        <span className="font-mono text-xs leading-4 text-fd-muted-foreground">
          {end ? (
            <>
              {label} <Lean>→</Lean>
            </>
          ) : (
            <>
              <Lean left>←</Lean> {label}
            </>
          )}
        </span>
        {link ? (
          <span className="text-base leading-5 font-semibold text-fd-primary">{link.title}</span>
        ) : (
          <span className="font-mono text-[13px] leading-5 text-fd-muted-foreground"># none</span>
        )}
      </>
    )
    const box = `flex flex-1 basis-0 flex-col gap-1.5 border-fd-border px-5 py-[18px] ${end ? 'items-end text-right border-y border-r' : 'border'}`
    return link ? (
      <Link to={link.url} rel={end ? 'next' : 'prev'} className={`${box} group transition-colors hover:bg-fd-accent`}>
        {inner}
      </Link>
    ) : (
      <div className={box}>{inner}</div>
    )
  }
  return (
    <nav aria-label="Pages" className="mt-12 flex">
      {cell(prev, before, false)}
      {cell(next, after, true)}
    </nav>
  )
}

/* A kind's own page: every published piece of that kind, newest or in order. */
function Shelf({ kind, sections }: ShelfData) {
  const { title, blurb, empty } = KIND[kind]
  return (
    <>
      <HeaderBand art="band">
        <Title crumbs={[kind]} kind={kind} title={title} description={blurb} />
      </HeaderBand>
      <main className="bg-paper text-ink">
        <div className="mx-auto max-w-[1440px] px-6 pt-8 pb-24 md:px-12 lg:pl-[352px]">
          <div className="max-w-[680px]">
            {sections.length === 0 && <p className="font-mono text-[13px] text-fd-muted-foreground">{empty}</p>}
            {sections.map((section) => (
              <section key={section.title ?? kind} className="not-first:mt-12">
                {section.title && <h2 className="border-b border-ink pb-4 text-[28px] leading-[34px] font-semibold tracking-[-0.02em]">{section.title}</h2>}
                <ul>
                  {section.entries.map((entry) => (
                    <li key={entry.url}>
                      <Link to={entry.url} className="group flex items-center justify-between gap-6 border-b border-rule py-[22px] text-ink">
                        <div className="min-w-0">
                          <h3 className="text-[22px] leading-7 font-medium tracking-[-0.015em]">
                            {entry.title}
                          </h3>
                          {entry.description && <p className="mt-1.5 text-[15px] leading-6 text-fd-muted-foreground">{entry.description}</p>}
                          <p className="mt-2 flex flex-wrap gap-x-4 font-mono text-xs leading-4 text-fd-muted-foreground">
                            <span className="tabular-nums">{entry.date ?? '# undated'}</span>
                            {entry.draft && <span className="text-fd-primary">draft</span>}
                            {entry.tags.map((tag) => (
                              <span key={tag}>#{tag}</span>
                            ))}
                          </p>
                        </div>
                        <Arrow className="shrink-0 text-fd-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
