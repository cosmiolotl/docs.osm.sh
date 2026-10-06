import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/*
  The page is one drawing: a column between two rails that run the full
  height, cut into rows by rules that run the full width. Every place a
  rule crosses a rail carries a registration mark.

  A row draws its top rule; `open` leaves it off, for the row that sits
  directly under a line drawn some other way (the nav's labelled rule).
*/
export function Row({
  open = false,
  grow = false,
  className,
  children,
  label,
}: {
  open?: boolean
  grow?: boolean
  className?: string
  children?: ReactNode
  label?: string
}) {
  return (
    <section aria-label={label} data-open={open || undefined} className={cn('bench-row', grow && 'flex-1 flex flex-col')}>
      <div className={cn('bench-col', grow && 'flex-1', className)}>{children}</div>
    </section>
  )
}

/*
  A title block's field column: label and value on each line, stacked in
  one column at the right of the block, the way a drawing's title block
  lists drawn-by, sheet, and date. One divider meets the rule above, so
  it clears the nav's labels. On narrow screens the fields sit side by
  side under the title instead.
*/
export function Fields({ fields }: { fields: { label: string; value: string; muted?: boolean }[] }) {
  return (
    <dl
      style={{ gridTemplateColumns: `repeat(${fields.length}, minmax(0, 1fr))` }}
      className="grid sm:!grid-cols-1 sm:auto-rows-fr border-t sm:border-t-0 sm:border-l border-rule"
    >
      {fields.map((f) => (
        <div
          key={f.label}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-l first:border-l-0 sm:border-l-0 sm:border-t sm:first:border-t-0 border-rule px-[1.5ch] sm:px-[3ch] py-4 sm:py-0 min-w-0"
        >
          <dt className="text-sm text-ink-3">{f.label}</dt>
          <dd className={cn('text-sm sm:text-base whitespace-nowrap', f.muted ? 'text-ink-3' : 'text-ink tabular-nums')}>
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/*
  The rails' lead-in above the first rule, and their run-out below the
  last; `ruled` draws the closing rule across its top.
*/
export function Margin({ className, ruled = false }: { className?: string; ruled?: boolean }) {
  return (
    <div aria-hidden="true" data-open={ruled ? undefined : true} className="bench-row">
      <div className={cn('bench-col', className)} />
    </div>
  )
}
