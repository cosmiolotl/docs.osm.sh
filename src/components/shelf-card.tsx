import { Link } from '@tanstack/react-router'
import { KIND, type Kind } from '@/lib/kinds'

/*
  A whole card is one link to its shelf. On hover its edges take the
  kind's ink: a frame laid one pixel out, over the grid lines it shares
  with its neighbours.
*/
export function ShelfCard({ kind, count }: { kind: Kind; count: string }) {
  return (
    <Link
      to="/$"
      params={{ _splat: kind }}
      style={{ '--card-accent': KIND[kind].inks[1] } as React.CSSProperties}
      className="group relative flex h-full flex-col text-ink focus-visible:-outline-offset-2"
    >
      <span className="relative block aspect-[410/208] shrink-0 overflow-clip bg-paper md:aspect-auto md:h-[208px]">
        <img
          src={`/kinds/${kind}-poster.png`}
          alt=""
          width={136}
          height={69}
          className="pixelated absolute inset-0 size-full object-cover"
        />
      </span>
      <span className="flex flex-col gap-2 px-6 pt-5 pb-7">
        <span className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-3">
            <span aria-hidden="true" className="size-2 shrink-0" style={{ background: KIND[kind].inks[1] }} />
            <span className="text-2xl leading-[30px] font-semibold tracking-[-0.02em]">
              {KIND[kind].title}
            </span>
          </span>
          <span className="font-mono text-[13px] leading-4 text-fd-muted-foreground">{count}</span>
        </span>
        <span className="pl-5 text-[15px] leading-6 text-fd-muted-foreground">{KIND[kind].blurb}</span>
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute -inset-px z-10 border border-transparent transition-colors group-hover:border-(--card-accent)" />
    </Link>
  )
}
