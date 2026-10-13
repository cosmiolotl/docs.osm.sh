import { createFileRoute, Link } from '@tanstack/react-router'
import { Footer, HeaderBand } from '@/components/chrome'
import { ShelfCard } from '@/components/shelf-card'
import { Arrow } from '@/components/arrow'
import { KIND, type Kind } from '@/lib/kinds'
import { loadIndex, type Entry } from '@/server/docs.fn'

export const Route = createFileRoute('/')({
  // The set only changes on deploy.
  staleTime: Infinity,
  loader: () => loadIndex(),
  component: Index,
})

/*
  The index: the knowledgebase's title over the night band, then the three
  shelves, then what's featured and what's newest.
*/
function Index() {
  const { pages, latest, featured, shelves, recent, empty } = Route.useLoaderData()

  return (
    <>
      <HeaderBand art="hero">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 pt-12 pb-10 md:flex-row md:items-end md:justify-between md:px-12 md:pt-16 md:pb-12">
          <div className="flex min-w-0 flex-col gap-5">
            <p className="flex items-center gap-2.5 font-mono text-xs leading-4 tracking-[0.12em] text-fd-ring uppercase">
              <span aria-hidden="true" className="size-2 bg-fd-ring" />
              osmii's knowledgebase
            </p>
            <h1 className="font-mono text-[clamp(3.25rem,1rem+7vw,6.5rem)] leading-[0.92] font-medium tracking-[-0.055em] text-paper">
              docs.osm.sh
            </h1>
          </div>
          <dl className="w-full shrink-0 border border-paper/16 bg-ink/88 font-mono text-[13px] leading-4 md:w-[300px]">
            <div className="flex justify-between border-b border-paper/12 px-4 py-3">
              <dt className="text-paper/55">pages</dt>
              <dd className="text-paper tabular-nums">{pages}</dd>
            </div>
            <div className="flex justify-between px-4 py-3">
              <dt className="text-paper/55">last rev</dt>
              <dd className={latest ? 'text-paper tabular-nums' : 'text-paper/55'}>{latest ?? '# none'}</dd>
            </div>
          </dl>
        </div>
      </HeaderBand>

      <main className="bg-paper text-ink">
        <div className="mx-auto max-w-[1440px] px-6 pt-10 pb-20 md:px-12 md:pt-16 md:pb-28">
          <section aria-labelledby="shelves">
            <SectionHead id="shelves" number="01" label="Shelves" title="Browse articles" />
            <ul className="grid border-b border-l border-fd-border md:grid-cols-3">
              {shelves.map(({ kind, pages, drafts }) => (
                <li key={kind} className="min-w-0 border-r border-fd-border not-last:border-b md:not-last:border-b-0">
                  <ShelfCard kind={kind} count={pages ? plural(pages, 'page') : drafts ? plural(drafts, 'draft') : 'empty'} />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="latest" className="pt-16 md:pt-24">
            <SectionHead id="latest" number="02" label="Latest" title="Recent & featured" />
            <div className="grid border-b border-l border-fd-border md:grid-cols-2">
              <div className="border-r border-b border-fd-border md:border-b-0">
                {featured ? <Featured {...featured} /> : <p className="p-8 font-mono text-[13px] text-fd-muted-foreground"># nothing featured yet</p>}
              </div>
              {/* Equal rows: a third of the featured panel each, or all as tall as the tallest. */}
              <ul className="grid auto-rows-fr border-r border-fd-border">
                {recent.map((entry) => (
                  <li key={entry.url} className="flex border-b border-fd-border last:border-b-0">
                    <Recent {...entry} />
                  </li>
                ))}
                {empty.map((kind) => (
                  <li key={kind} className="flex items-center gap-6 border-b border-fd-border px-6 py-6 font-mono text-[13px] leading-4 text-fd-muted-foreground last:border-b-0 md:px-8">
                    <span className="hidden w-24 shrink-0 sm:block">—</span>
                    <span className="flex flex-1 items-center gap-2">
                      <Square kind={kind} />
                      {KIND[kind].empty}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

/** A kind's square, in its dark ink for the paper. */
function Square({ kind }: { kind: Kind }) {
  return <span aria-hidden="true" className="size-2 shrink-0" style={{ background: KIND[kind].inks[1] }} />
}

function SectionHead({ id, number, label, title }: { id: string; number: string; label: string; title: string }) {
  return (
    <div className="flex flex-col gap-3 border-b border-fd-border pb-5">
      <p className="eyebrow text-fd-muted-foreground">
        {number} · {label}
      </p>
      <h2 id={id} className="text-[30px] leading-9 font-semibold tracking-[-0.025em] md:text-4xl md:leading-10">
        {title}
      </h2>
    </div>
  )
}

function Featured({ url, kind, title, description, tags, draft, published }: Omit<Entry, 'url'> & { url?: string; published: boolean }) {
  const heading = (
    <h3 className="max-w-[460px] text-[28px] leading-[34px] font-semibold tracking-[-0.025em] text-balance transition-colors md:text-[32px] md:leading-[38px]">
      {title}
    </h3>
  )
  return (
    <article className="flex h-full flex-col items-start gap-4 p-6 md:p-8">
      <p className="flex items-center gap-2.5">
        <span className="eyebrow text-fd-primary">Featured</span>
        {draft && <span className="border border-fd-ring/70 px-1.5 py-0.5 font-mono text-[11px] leading-[14px] tracking-[0.08em] text-fd-primary uppercase">draft</span>}
      </p>
      {url ? (
        <Link to={url} className="hover:[&>h3]:text-fd-primary">
          {heading}
        </Link>
      ) : (
        heading
      )}
      {description && <p className="max-w-[500px] text-[17px] leading-7 text-pretty text-fd-muted-foreground">{description}</p>}
      <p className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 pt-6 font-mono text-[13px] leading-4 text-fd-muted-foreground">
        <span className="flex items-center gap-2 text-ink">
          <Square kind={kind} />
          {kind}
        </span>
        {tags.slice(0, 1).map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
        {!published && <span>not published yet</span>}
      </p>
    </article>
  )
}

function Recent({ url, kind, title, date }: Entry) {
  // projects / kurry: where the page sits, without its own name.
  const place = url.split('/').filter(Boolean).slice(0, -1).join(' / ')
  return (
    <Link to={url} className="group flex flex-1 items-center gap-6 px-6 py-6 text-ink transition-colors hover:bg-fd-muted/60 focus-visible:-outline-offset-2 md:px-8">
      <span className="hidden w-24 shrink-0 font-mono text-[13px] leading-4 text-fd-muted-foreground tabular-nums sm:block">{date ?? '—'}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-[19px] leading-[26px] font-semibold tracking-[-0.015em]">{title}</span>
        <span className="flex items-center gap-2 font-mono text-[13px] leading-4 text-fd-muted-foreground">
          <Square kind={kind} />
          {place}
        </span>
      </span>
      <Arrow className="shrink-0 text-fd-primary" />
    </Link>
  )
}
