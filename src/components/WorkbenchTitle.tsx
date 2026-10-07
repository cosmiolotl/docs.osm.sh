import { useEffect, useState } from 'react'
import { Fields, Row } from '@/components/Bench'
import type { Entry } from '@/lib/kinds'
import { loadViews } from '@/server/views.fn'

export function WorkbenchTitle({ entries }: { entries: Entry[] }) {
  const [views, setViews] = useState<number | null>()
  const latest = entries.map((entry) => entry.updated ?? entry.date ?? '').sort().at(-1)

  useEffect(() => {
    let active = true
    loadViews()
      .then((total) => {
        if (active) setViews(total)
      })
      .catch(() => {
        if (active) setViews(null)
      })
    return () => {
      active = false
    }
  }, [])

  let viewLabel = '# loading'
  if (views === null) viewLabel = '# unavailable'
  if (typeof views === 'number') viewLabel = views.toLocaleString('en-US')

  return (
    <Row open label="Title block" className="grid grid-cols-1 sm:grid-cols-[1fr_30ch]">
      <div className="title-cell px-[3ch] pt-12 pb-10 lg:py-16">
        <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.03em]">
          docs.osm.sh
        </h1>
        <p className="mt-3 text-ink-2">osmii's knowledgebase</p>
      </div>
      <div className="hidden sm:grid">
        <Fields
          fields={[
            { label: 'views', value: viewLabel, muted: typeof views !== 'number' },
            { label: 'sheets', value: String(entries.length) },
            { label: 'last rev', value: latest || '# none', muted: !latest },
          ]}
        />
      </div>
    </Row>
  )
}
