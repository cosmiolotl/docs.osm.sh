/* The ruler: a tick per 16px square, a longer one every fifth, numbered. */
export function Ruler() {
  return (
    <div aria-hidden="true" className="ruler relative overflow-hidden select-none">
      <div className="absolute inset-0 flex">
        {Array.from({ length: 48 }, (_, i) => (
          <span key={i} className="shrink-0 w-[80px] pl-1 pt-0.5 text-xs leading-none text-ink-3 tabular-nums">
            {i * 5}
          </span>
        ))}
      </div>
    </div>
  )
}
