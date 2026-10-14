import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { useSearchContext } from 'fumadocs-ui/contexts/search'

/*
  The frame every page shares: a navy band with the nav and the title
  over a dithered plasma, a seam where band and plasma dissolve together
  into the paper, and the same seam reversed into the footer. Dither art
  is drawn at 4px a cell and scaled with nearest-neighbour, never smoothed.
*/

export function Mark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-mono text-[15px] leading-[18px] font-medium ${className}`}>
      <img src="/favicon.svg" alt="" width={24} height={24} className="size-6 shrink-0" />
      <span className="text-paper">docs.osm.sh</span>
    </span>
  )
}

function SearchButton() {
  const { setOpenSearch } = useSearchContext()
  return (
    <button
      type="button"
      onClick={() => setOpenSearch(true)}
      className="group flex h-9 w-full max-w-[360px] min-w-0 shrink items-center justify-between border border-paper/20 bg-ink/70 pr-1.5 pl-3 text-left transition-colors hover:border-paper/40 focus-visible:border-fd-ring"
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0 stroke-paper/60">
          <circle cx="6" cy="6" r="4.5" fill="none" strokeWidth="1.2" />
          <path d="M9.5 9.5L13 13" fill="none" strokeWidth="1.2" />
        </svg>
        <span className="truncate text-sm leading-[18px] text-paper/62 group-hover:text-paper/80">Search the knowledgebase</span>
      </span>
      <kbd className="flex h-[22px] w-6 shrink-0 items-center justify-center border border-paper/24 font-mono text-xs text-paper/75">/</kbd>
    </button>
  )
}

function Nav() {
  return (
    <nav className="relative border-b border-paper/14">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-6 md:px-12">
        <div className="flex flex-1 basis-0 items-center">
          <Link to="/" aria-label="docs.osm.sh, home" className="hover:opacity-80">
            <Mark />
          </Link>
        </div>
        <SearchButton />
        <div aria-hidden="true" className="hidden flex-1 basis-0 sm:block" />
      </div>
    </nav>
  )
}

/** The navy band at the top: nav, then whatever title block the page brings, then the seam into paper. */
export function HeaderBand({ art, children }: { art: 'hero' | 'band'; children: ReactNode }) {
  return (
    <header className="relative">
      <div aria-hidden="true" className="seam-down absolute inset-0 bg-ink">
        <div
          className={`pixelated absolute inset-0 bg-no-repeat max-md:opacity-40 ${art === 'hero' ? 'bg-[url(/dither/hero.png)] bg-cover bg-[50%_40%]' : 'bg-[url(/dither/band.png)] bg-[length:max(100%,1440px)_auto] bg-right-bottom'}`}
        />
      </div>
      <Nav />
      <div className="relative">{children}</div>
      <div className="h-24" />
    </header>
  )
}

export function Footer() {
  return (
    <footer className="relative mt-auto pt-24">
      <div aria-hidden="true" className="seam-up absolute inset-0 bg-ink">
        <div className="pixelated absolute inset-0 bg-[url(/dither/footer.png)] bg-cover bg-bottom bg-no-repeat" />
      </div>
      <div className="relative mx-auto flex h-[200px] max-w-[1440px] flex-wrap items-end justify-between gap-x-6 gap-y-4 px-6 pb-10 md:px-12">
        <div className="flex flex-col gap-2.5">
          <Link to="/" className="self-start hover:opacity-80">
            <Mark />
          </Link>
          <p className="text-sm leading-[18px] text-paper/62">
            by osmii · part of{' '}
            <a href="https://osm.sh" className="hover:text-paper">
              osm.sh
            </a>
          </p>
        </div>
        <p className="hidden gap-7 font-mono text-[13px] leading-4 text-paper/70 sm:flex">
          <span>[/] search</span>
          <span>[←][→] prev / next</span>
        </p>
      </div>
    </footer>
  )
}

/** One mono square in the kind's colour, the start of every breadcrumb. */
export function KindSquare({ kind }: { kind: string }) {
  const color = kind === 'projects' ? 'bg-projects-light' : kind === 'notes' ? 'bg-notes-light' : 'bg-fd-ring'
  return <span aria-hidden="true" className={`size-2 shrink-0 ${color}`} />
}
