import { Link } from '@tanstack/react-router'
import { Fragment } from 'react'
import { Margin } from '@/components/Bench'

const sibling = 'text-ink-3 no-underline hover:underline hover:text-rose-ink transition-colors duration-150'

/*
  The labelled rule every page opens with, the same device puzzles.osm.sh
  heads its pages with. Here it is the drawing's first full-width rule:
  the trail and the sibling links sit in the line, which runs out past the
  rails to both edges of the page. The trail runs from the site down to
  the page; the far end points back to the rest of osm.sh.
*/
export function SiteHeader({ trail = [] }: { trail?: { label: string; to?: string; search?: Record<string, string> }[] }) {
  return (
    <header>
      <Margin className="h-6" />
      <div className="bench-row">
        <div className="bench-col h-0">
          <nav
            aria-label="Site"
            className="absolute z-10 inset-x-0 top-0 -translate-y-1/2 flex items-center px-[2ch] text-sm leading-6 whitespace-nowrap min-w-0 [&>*]:bg-ground"
          >
            <Link
              to="/"
              aria-current={trail.length === 0 ? 'page' : undefined}
              className={
                trail.length === 0
                  ? 'px-[0.75ch] text-ink font-medium no-underline'
                  : 'px-[0.75ch] text-ink-2 no-underline hover:underline hover:text-rose-ink transition-colors duration-150'
              }
            >
              docs.osm.sh
            </Link>
            {trail.map((step, i) => (
              <Fragment key={i}>
                <span aria-hidden="true" className="text-ink-3">
                  /
                </span>
                {step.to ? (
                  <Link
                    to={step.to}
                    search={step.search}
                    className="px-[0.75ch] text-ink-2 no-underline hover:underline hover:text-rose-ink transition-colors duration-150"
                  >
                    {step.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="px-[0.75ch] text-ink font-medium truncate min-w-0">
                    {step.label}
                  </span>
                )}
              </Fragment>
            ))}
            <span aria-hidden="true" className="flex-1 min-w-[3ch] !bg-transparent" />
            <a href="https://osm.sh" className={`px-[0.75ch] ${sibling}`}>
              osm.sh
            </a>
            <span aria-hidden="true" className="text-rule">
              │
            </span>
            <a href="https://puzzles.osm.sh" className={`px-[0.75ch] ${sibling}`}>
              puzzles
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
