import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'
import { findPath, flattenTree, type Folder, type Item, type Node } from 'fumadocs-core/page-tree'
import { byDate, candidates, readingMinutes, revised, source, type Page } from '@/lib/source'
import { KINDS, isKind, type Kind } from '@/lib/kinds'

export type Link = { title: string; url: string }

export type Entry = Link & {
  kind: Kind
  description?: string
  date?: string
  tags: string[]
  draft: boolean
}

/** A run of sidebar links under an optional label: a `---Label---` separator or a nested folder. */
export type Group = { label?: string; items: Link[] }

export type Project = { name: string; slug: string; url: string }

export type Section = { title?: string; entries: Entry[] }

/** A kind's own address: every published piece of that kind. */
export type ShelfData = { type: 'shelf'; kind: Kind; sections: Section[] }

export type PageData = {
  type: 'page'
  path: string
  url: string
  kind: Kind
  crumbs: string[]
  title: string
  description?: string
  date?: string
  revised?: string
  tags: string[]
  draft: boolean
  minutes: number
  rail: Rail
  prev?: Link
  next?: Link
}

/** What the left rail shows, which depends on the kind of page. */
export type Rail =
  | { kind: 'writing' | 'notes'; entries: Entry[] }
  | { kind: 'projects'; project?: Project; projects: Project[]; groups: Group[] }

function entry(page: Page): Entry {
  return {
    url: page.url,
    kind: page.slugs[0] as Kind,
    title: page.data.title,
    description: page.data.description,
    date: page.data.date,
    tags: page.data.tags,
    draft: page.data.draft,
  }
}

const published = () => source.getPages().filter((page) => isKind(page.slugs[0]))
const ofKind = (kind: Kind) => published().filter((page) => page.slugs[0] === kind)
const pageAt = (url: string) => published().find((page) => page.url === url)

/** The top-level folder for a kind; absent while nothing in it is published. */
function kindFolder(kind: Kind): Folder | undefined {
  return source
    .getPageTree()
    .children.find((node): node is Folder => node.type === 'folder' && flattenTree(node.children)[0]?.url.startsWith(`/${kind}/`) === true)
}

/** Pages in tree order: meta.json first, then the loader's own order. */
const inOrder = (nodes: Node[]) => flattenTree(nodes).flatMap((item) => pageAt(item.url) ?? [])

const link = (item: Item): Link => ({ title: String(item.name), url: item.url })

function project(folder: Folder): Project | undefined {
  const first = flattenTree(folder.children)[0]
  if (!first) return undefined
  return { name: String(folder.name), slug: first.url.split('/')[2], url: first.url }
}

function groups(nodes: Node[]): Group[] {
  const out: Group[] = [{ items: [] }]
  for (const node of nodes) {
    if (node.type === 'separator') out.push({ label: node.name ? String(node.name) : undefined, items: [] })
    else if (node.type === 'page') out[out.length - 1].items.push(link(node))
    else {
      out.push({ label: String(node.name), items: flattenTree(node.children).map(link) })
      out.push({ items: [] })
    }
  }
  return out.filter((group) => group.items.length > 0)
}

/** Every published page for the index, and the one the owner chose to feature. */
export const loadIndex = createServerFn({ method: 'GET' }).handler(async () => {
  const pages = byDate(published())
  const chosen = candidates.find((file) => file.data.featured && isKind(file.path.split('/')[0]))
  const live = chosen && pages.find((page) => page.path === chosen.path)
  const featured = chosen && {
    ...(live
      ? entry(live)
      : {
          url: undefined,
          kind: chosen.path.split('/')[0] as Kind,
          title: chosen.data.title,
          description: chosen.data.description,
          date: chosen.data.date,
          tags: chosen.data.tags,
          draft: chosen.data.draft,
        }),
    // Linked only when this build publishes it.
    published: Boolean(live),
  }

  return {
    pages: pages.length,
    latest: (await Promise.all(pages.map(revised))).filter(Boolean).sort().at(-1),
    featured,
    // Each shelf's count: what's out, else what's being written.
    shelves: KINDS.map((kind) => ({
      kind,
      pages: pages.filter((page) => page.slugs[0] === kind && !page.data.draft).length,
      drafts: candidates.filter((file) => file.path.startsWith(`${kind}/`) && file.data.draft).length,
    })),
    recent: pages.filter((page) => page !== live).slice(0, 3).map(entry),
    empty: KINDS.filter((kind) => !pages.some((page) => page.slugs[0] === kind)),
  }
})

export const loadPage = createServerFn({ method: 'GET' })
  .validator((slugs: string[]) => slugs.map(String))
  .handler(async ({ data: slugs }): Promise<ShelfData | PageData> => {
    // A kind's own address is its shelf: every page of that kind.
    if (slugs.length === 1 && isKind(slugs[0])) return { type: 'shelf', ...shelf(slugs[0]) }

    const page = source.getPage(slugs)
    const kind = page?.slugs[0]
    if (!page || !isKind(kind)) throw notFound()

    const tree = source.getPageTree()
    const path = findPath(tree.children, (node) => node.type === 'page' && node.url === page.url, { includeSeparator: true }) ?? []
    let rail: Rail
    let siblings: Page[]
    let group: string | undefined

    if (kind === 'projects') {
      const root = kindFolder('projects')
      const folder = path[1]?.type === 'folder' ? path[1] : undefined
      rail = {
        kind,
        project: folder && project(folder),
        projects: (root?.children ?? []).flatMap((node) => (node.type === 'folder' ? (project(node) ?? []) : [])),
        groups: groups(folder?.children ?? (root?.children ?? []).filter((node) => node.type !== 'folder')),
      }
      siblings = inOrder(folder?.children ?? [])
      group = rail.groups.find((g) => g.items.some((item) => item.url === page.url))?.label
    } else {
      const pages = kind === 'notes' ? byDate(ofKind(kind)) : inOrder(kindFolder(kind)?.children ?? [])
      rail = { kind, entries: pages.map(entry) }
      siblings = pages
    }

    const at = siblings.indexOf(page)
    const near = (i: number) => (i >= 0 && siblings[i] ? { title: siblings[i].data.title, url: siblings[i].url } : undefined)

    return {
      type: 'page',
      path: page.path,
      url: page.url,
      kind,
      // projects / kurry / legal / privacy: a separator's label reads as part of the address.
      crumbs: group ? [...page.slugs.slice(0, -1), group.toLowerCase(), page.slugs.at(-1)!] : page.slugs,
      title: page.data.title,
      description: page.data.description,
      date: page.data.date,
      revised: await revised(page),
      tags: page.data.tags,
      draft: page.data.draft,
      minutes: await readingMinutes(page),
      rail,
      // Notes run newest first, so the one before is newer.
      prev: kind === 'notes' ? near(at + 1) : near(at - 1),
      next: kind === 'notes' ? near(at - 1) : near(at + 1),
    }
  })

/** A kind's pages; projects are split by project folder, with loose pages last. */
function shelf(kind: Kind): { kind: Kind; sections: Section[] } {
  const pages = ofKind(kind)
  if (kind !== 'projects') {
    const ordered = kind === 'notes' ? byDate(pages) : inOrder(kindFolder(kind)?.children ?? [])
    return { kind, sections: [{ title: undefined, entries: ordered.map(entry) }] }
  }
  const nodes = kindFolder(kind)?.children ?? []
  const sections: Section[] = nodes.flatMap((node) =>
    node.type === 'folder' ? [{ title: String(node.name), entries: inOrder(node.children).map(entry) }] : [],
  )
  const loose = inOrder(nodes.filter((node) => node.type === 'page'))
  if (loose.length) sections.push({ title: 'Other', entries: loose.map(entry) })
  return { kind, sections: sections.filter((section) => section.entries.length > 0) }
}
