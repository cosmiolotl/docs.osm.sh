import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type RefObject } from 'react'
import type { TableOfContents } from 'fumadocs-core/toc'

/*
  On this page: the headings, every section on screen marked in rose, and
  a pixel meter of how far through the article the reader is.

  A section runs from its heading to the next one (the last to the end of
  the article). The rose bar beside the list is the viewport mapped onto
  it: each edge of the screen lands part-way through some section, and the
  bar's edge lands the same part-way through that section's entry. So the
  bar slides and stretches with the scroll instead of hopping between
  headings, and a screen that spans three sections lights all three.
*/
export function Toc({ toc, article }: { toc: TableOfContents; article: RefObject<HTMLElement | null> }) {
  const top = Math.min(...toc.map((item) => item.depth))
  const list = useRef<HTMLElement>(null)
  const thumb = useRef<HTMLDivElement>(null)
  const active = useSections(toc, article, list, thumb)

  return (
    <div className="flex flex-col gap-4">
      {toc.length > 0 && (
        <>
          <p className="eyebrow text-fd-muted-foreground">On this page</p>
          <nav ref={list} aria-label="On this page" className="relative flex flex-col">
            {toc.map((item, i) => (
              <a
                key={item.url}
                href={item.url}
                onClick={jump}
                data-active={active[i] ?? false}
                aria-current={active[i] ? 'location' : undefined}
                style={{ paddingLeft: 14 + (item.depth - top) * 12 }}
                className="border-l-2 border-fd-border py-1.5 text-sm leading-5 text-fd-muted-foreground transition-colors duration-200 hover:text-ink data-[active=true]:text-fd-primary"
              >
                {item.title}
              </a>
            ))}
            <div
              ref={thumb}
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 h-0 w-0.5 origin-top bg-fd-primary opacity-0 transition-[translate,height,opacity] duration-150 ease-out motion-reduce:transition-none"
            />
          </nav>
        </>
      )}
      <ReadMeter article={article} />
    </div>
  )
}

/** Glide to a heading rather than jumping, and keep its address in the bar. */
function jump(e: MouseEvent<HTMLAnchorElement>) {
  const id = decodeURIComponent(e.currentTarget.hash.slice(1))
  const target = document.getElementById(id)
  if (!target || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  history.replaceState(history.state, '', `#${id}`)
}

/**
  Which sections overlap the viewport, kept in React state since it only
  changes at section boundaries; the bar itself is moved directly on every
  frame so scrolling never re-renders the list.
*/
function useSections(
  toc: TableOfContents,
  article: RefObject<HTMLElement | null>,
  list: RefObject<HTMLElement | null>,
  thumb: RefObject<HTMLDivElement | null>,
) {
  const [active, setActive] = useState<boolean[]>([])

  useLayoutEffect(() => {
    const headings = toc.map((item) => document.getElementById(decodeURIComponent(item.url.slice(1))))
    let frame = 0
    let last = ''

    const measure = () => {
      frame = 0
      const body = article.current
      const nav = list.current
      const bar = thumb.current
      if (!body || !nav || !bar) return
      const items = [...nav.querySelectorAll<HTMLElement>(':scope > a')]

      // Each section's extent on screen: its heading to the next, the last to the article's end.
      const end = body.getBoundingClientRect().bottom
      const tops = headings.map((h) => h?.getBoundingClientRect().top ?? Infinity)
      const bottoms = tops.map((_, i) => Math.min(tops.slice(i + 1).find(Number.isFinite) ?? end, end))
      const view = { top: 0, bottom: window.innerHeight }

      const on = tops.map((t, i) => Number.isFinite(t) && t < view.bottom && bottoms[i] > view.top && bottoms[i] > t)
      const key = on.map(Number).join('')
      if (key !== last) {
        last = key
        setActive(on)
      }

      const first = on.indexOf(true)
      const final = on.lastIndexOf(true)
      if (first === -1) {
        bar.style.opacity = '0'
        return
      }
      // Where a screen edge sits within section i, carried over to entry i.
      const place = (y: number, i: number) => {
        const f = Math.min(1, Math.max(0, (y - tops[i]) / (bottoms[i] - tops[i])))
        return items[i].offsetTop + f * items[i].offsetHeight
      }
      const from = place(view.top, first)
      const to = place(view.bottom, final)
      bar.style.opacity = '1'
      bar.style.translate = `0 ${from}px`
      bar.style.height = `${Math.max(2, to - from)}px`
    }

    const schedule = () => {
      frame ||= requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Images, math, and fonts settling all move the headings.
    const resized = new ResizeObserver(schedule)
    if (article.current) resized.observe(article.current)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      resized.disconnect()
    }
  }, [toc, article, list, thumb])

  return active
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const CELL = 4
const WIDTH = 216
const TRAIL = 12

function ReadMeter({ article }: { article: RefObject<HTMLElement | null> }) {
  const read = useRead(article)
  const percent = Math.round(read * 100)
  const filled = Math.round((read * WIDTH) / CELL)
  const cells: { x: number; y: number; fill: string }[] = []
  // Past the solid bar, the ink thins out through the lattice: rose ink, rose, wash.
  for (let k = 0; k < TRAIL; k++) {
    const column = filled + k
    if (column * CELL >= WIDTH) break
    for (let row = 0; row < 2; row++) {
      if (1 - k / TRAIL <= (BAYER[(row % 4) * 4 + (column % 4)] + 0.5) / 16) continue
      cells.push({ x: column * CELL, y: row * CELL, fill: k < 2 ? '#9a4d62' : k < 6 ? '#c67b8b' : '#f0d9df' })
    }
  }

  return (
    <div className="flex flex-col gap-2.5 border-t border-fd-border pt-4">
      <p className="flex justify-between font-mono text-xs leading-4">
        <span className="text-fd-muted-foreground">read</span>
        <span className="text-ink tabular-nums">{percent}%</span>
      </p>
      <svg width={WIDTH} height={CELL * 2} viewBox={`0 0 ${WIDTH} ${CELL * 2}`} shapeRendering="crispEdges" role="progressbar" aria-label="Read" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} className="max-w-full">
        <rect width={filled * CELL} height={CELL * 2} fill="#9a4d62" />
        {cells.map((c) => (
          <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width={CELL} height={CELL} fill={c.fill} />
        ))}
      </svg>
    </div>
  )
}

/** How far the article has scrolled through the viewport, 0 to 1. */
function useRead(article: RefObject<HTMLElement | null>) {
  const [read, setRead] = useState(0)
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const el = article.current
      if (!el) return
      const { top, height } = el.getBoundingClientRect()
      // Once the article's end is on screen, it has all been read.
      const span = height - window.innerHeight
      setRead(top + height <= window.innerHeight ? 1 : Math.min(1, Math.max(0, -top / span)))
    }
    const schedule = () => (frame ||= requestAnimationFrame(measure))
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [article])
  return read
}
