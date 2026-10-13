/*
  The three kinds of page. Each has its own four-ink ramp, from navy ink
  to its palest wash, shared by the shelf art, the breadcrumb square, and
  the project badge.
*/
export const KINDS = ['writing', 'projects', 'notes'] as const
export type Kind = (typeof KINDS)[number]

export const isKind = (value: unknown): value is Kind => KINDS.includes(value as Kind)

export const KIND = {
  writing: {
    title: 'Writing',
    blurb: 'Essays and long-form analysis.',
    inks: ['#121b35', '#78384f', '#c67b8b', '#f0d9df'],
    empty: '# more essays soon',
  },
  projects: {
    title: 'Projects',
    blurb: "Docs and policies for things I've built.",
    inks: ['#121b35', '#365573', '#779bc6', '#d1e1f2'],
    empty: '# nothing published yet',
  },
  notes: {
    title: 'Notes',
    blurb: 'Short entries and half-formed ideas.',
    inks: ['#121b35', '#766038', '#c5a064', '#efe0bd'],
    empty: '# no notes published yet',
  },
} satisfies Record<Kind, { title: string; blurb: string; inks: [string, string, string, string]; empty: string }>

/** Where a page's source lives, for "suggest an edit". */
export const REPOSITORY = 'https://github.com/cosmiolotl/docs.osm.sh'
