import { useEffect, useRef } from 'react'
import { recordPageRead } from '@/server/views.fn'

export function usePageRead(path: string) {
  const recordedPath = useRef<string | null>(null)

  useEffect(() => {
    // Count rendered pages, not loader prefetches or Strict Mode effect replays.
    if (recordedPath.current === path) return
    recordedPath.current = path
    recordPageRead({ data: { path } })
      .catch((error: unknown) => console.warn('Could not record article view', error))
  }, [path])
}
