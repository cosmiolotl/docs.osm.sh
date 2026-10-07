import { Link } from '@tanstack/react-router'
import { entryHref, sheetNo, type Entry } from '@/lib/kinds'
import { markTag, markWords, type Hit } from '@/lib/search'
import { Redlined } from '@/components/Redlined'
import { tagLook } from '@/lib/tag-look'

/*
  A sheet is one cell, opened by its link: the link's box is stretched over
  the whole cell, so a click anywhere opens the page, and its tags sit
  above it as buttons that put the tag in find.
*/
export function Sheet({
  entry,
  hit,
  words,
  tags,
  onTag,
}: {
  entry: Entry
  hit?: Hit
  words: string[]
  tags: string[]
  onTag: (tag: string) => void
}) {
  // Matched only in its text: show the passage that matched instead of the summary.
  const passage = hit?.snippet && !hit.fields.includes('title') && !hit.fields.includes('summary') ? hit.snippet : null
  return (
    <li className="sheet group px-[3ch] pt-6 pb-5 min-h-[12rem]">
      <span aria-hidden="true" className="sheet-marks" />
      <Link to={entryHref(entry)} data-at={`${entry.kind}/${entry.slug}`} className="sheet-link">
        <span className="block font-medium leading-snug transition-colors duration-150 group-hover:text-rose-ink">
          <Redlined segments={markWords(entry.title, words)} />
        </span>
        <span
          className={`mt-2 block text-sm leading-relaxed line-clamp-3 ${entry.summary ? 'text-ink-2' : 'text-ink-3'}`}
        >
          {passage ? (
            <>
              {passage.before && '… '}
              <Redlined segments={passage.segments} />
              {passage.after && ' …'}
            </>
          ) : entry.summary ? (
            <Redlined segments={markWords(entry.summary, words)} />
          ) : (
            '# no summary'
          )}
        </span>
      </Link>
      <div className="mt-auto pt-6 flex flex-col gap-2 text-sm">
        {entry.tags.length > 0 && (
          <ul aria-label="tags" className="flex flex-wrap gap-x-[1.5ch] gap-y-1">
            {entry.tags.map((tag) => (
              <li key={tag}>
                <button type="button" onClick={() => onTag(tag)} className={`relative z-[2] text-ink-2 ${tagLook}`}>
                  <span className="sr-only">find tag </span>
                  <Redlined segments={markTag(tag, tags, words)} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <span className="flex items-baseline justify-between gap-[2ch] tabular-nums">
          <span className="text-ink">
            <span className="sr-only">sheet </span>
            {sheetNo(entry.no)}
          </span>
          <span className="text-ink-2">{entry.date ?? '# undated'}</span>
        </span>
      </div>
    </li>
  )
}
