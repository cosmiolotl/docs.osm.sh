import { Row } from '@/components/Bench'
import { Redlined } from '@/components/Redlined'
import { markTag } from '@/lib/search'
import { tagLook } from '@/lib/tag-look'

const MAX_COMPLETIONS = 12

/*
  The tags row: drawn under find only while a #tag is being typed. It
  lists the set's tags that begin it, most used first, each with how many
  sheets carry it; the first is the one tab takes.
*/
export function TagCompletions({
  prefix,
  completions,
  hasTags,
  onPick,
}: {
  prefix: string
  completions: { tag: string; count: number }[]
  hasTags: boolean
  onPick: (tag: string) => void
}) {
  const listed = completions.slice(0, MAX_COMPLETIONS)
  const more = completions.length - listed.length
  // Insets are measured at the find row's 16px, so `tags` sits under `find`
  // and the completions start where the query does.
  return (
    <Row label="Tag completions" className="flex flex-wrap items-baseline gap-x-[2ch] gap-y-2 px-[3ch] py-3">
      <span className="text-sm text-ink-2 shrink-0">tags</span>
      {listed.length === 0 ? (
        <span className="text-sm text-ink-3">{hasTags ? `# no tag begins “${prefix}”` : '# no tags yet'}</span>
      ) : (
        <>
          <ul className="flex flex-wrap gap-x-[2ch] gap-y-1 min-w-0 text-sm">
            {listed.map(({ tag, count }, i) => (
              <li key={tag}>
                <button
                  type="button"
                  // Keep the caret in find: the click must not blur it first.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onPick(tag)}
                  className={`${i === 0 ? 'text-ink font-medium' : 'text-ink-2'} ${tagLook}`}
                >
                  <Redlined segments={markTag(tag, prefix ? [prefix] : [], [])} />
                  <span className="ml-[0.75ch] font-normal text-ink-3 tabular-nums">
                    <span className="sr-only">, sheets: </span>
                    {count}
                  </span>
                </button>
              </li>
            ))}
            {more > 0 && <li className="text-ink-3"># {more} more</li>}
          </ul>
          <span className="hidden sm:flex ml-auto items-center gap-[1ch] text-sm text-ink-3">
            <kbd className="font-medium text-ink-2">tab</kbd>
            <span>complete</span>
          </span>
          <span className="sr-only" aria-live="polite">
            {`tab completes #${listed[0].tag}`}
          </span>
        </>
      )}
    </Row>
  )
}
