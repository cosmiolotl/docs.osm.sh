import { createFileRoute } from '@tanstack/react-router'
import { createFromSource } from 'fumadocs-core/search/server'
import { source } from '@/lib/source'

/*
  Full-text search over every page, built the first time anyone searches
  and kept for the life of the Worker isolate. Each page is tagged with
  its kind, so the dialog can narrow to writing, projects, or notes, and
  its frontmatter tags are indexed as text so a tag's name finds it.
*/
const server = createFromSource(source, {
  language: 'english',
  async buildIndex(page) {
    const { structuredData } = await page.data.load()
    const { tags } = page.data
    return {
      id: page.url,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      tag: page.slugs[0],
      breadcrumbs: page.slugs.slice(0, -1),
      structuredData: tags.length
        ? { ...structuredData, contents: [...structuredData.contents, { heading: undefined, content: tags.map((tag) => `#${tag}`).join(' ') }] }
        : structuredData,
    }
  },
})

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: async ({ request }) => server.GET(request),
    },
  },
})
