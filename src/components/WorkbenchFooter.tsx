import type { ReactNode } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'
import { Row } from '@/components/Bench'

export function WorkbenchFooter() {
  return (
    <div className="hidden sm:block">
      <Row className="flex items-center justify-end gap-[2.5ch] px-[3ch] py-4 text-sm text-ink-3">
        <Hint k="/" label="find" />
        <Hint k="#" label="tag" />
        <Hint
          k={
            <span className="flex items-center gap-[0.5ch]">
              <span className="sr-only">arrow keys</span>
              {[ArrowUp, ArrowDown, ArrowLeft, ArrowRight].map((Icon, i) => (
                <Icon key={i} aria-hidden="true" className="size-3.5" strokeWidth={2} />
              ))}
            </span>
          }
          label="move"
        />
        <Hint k="enter" label="open" />
      </Row>
    </div>
  )
}

function Hint({ k, label }: { k: ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-[1ch]">
      <kbd className="font-medium text-ink-2">{k}</kbd>
      <span>{label}</span>
    </span>
  )
}
