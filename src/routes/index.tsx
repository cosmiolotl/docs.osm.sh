import { createFileRoute } from '@tanstack/react-router'
import { loadIndex } from '@/server/content.fn'
import { Workbench } from '@/components/Workbench'

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { at?: string; q?: string } => ({
    ...(typeof search.at === 'string' ? { at: search.at } : {}),
    ...(typeof search.q === 'string' && search.q ? { q: search.q } : {}),
  }),
  // The set only changes on deploy; typing a search must not refetch it.
  loaderDeps: () => ({}),
  staleTime: Infinity,
  loader: () => loadIndex(),
  component: Index,
})

function Index() {
  const entries = Route.useLoaderData()
  const { at, q } = Route.useSearch()
  return <Workbench entries={entries} q={q} at={at} />
}
