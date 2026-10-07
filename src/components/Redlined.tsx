import type { Segment } from '@/lib/search'

export function Redlined({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((s, i) =>
        s.hit ? (
          <mark key={i} className="redline">
            {s.text}
          </mark>
        ) : (
          s.text
        ),
      )}
    </>
  )
}
