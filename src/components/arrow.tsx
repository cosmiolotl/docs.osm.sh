import type { ReactNode } from 'react'

/*
  Arrows lean the way they point when their link is hovered or focused.
  The link carries `group`; the arrow does the moving, so every arrow on
  the site shares one motion.
*/
// Long and even enough to read as motion; a quick ease-out looks like a jump.
const LEAN = 'transition-transform duration-300 ease-in-out motion-reduce:transition-none'
const RIGHT = `${LEAN} group-hover:translate-x-2 group-focus-visible:translate-x-2`
const LEFT = `${LEAN} group-hover:-translate-x-1.5 group-focus-visible:-translate-x-1.5`

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={`${RIGHT} ${className}`}>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  )
}

/** A text arrow, `→` or `←`, that leans with its link. */
export function Lean({ left = false, children, className = '' }: { left?: boolean; children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-block ${left ? LEFT : RIGHT} ${className}`}>
      {children}
    </span>
  )
}
