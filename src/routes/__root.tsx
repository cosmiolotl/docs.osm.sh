import type { ReactNode } from 'react'
import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { RootProvider } from 'fumadocs-ui/provider/tanstack'
import appCss from '../styles.css?url'
import { Search } from '@/components/search'
import { Footer, HeaderBand } from '@/components/chrome'
import { Lean } from '@/components/arrow'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'docs.osm.sh' },
      { name: 'description', content: "osmii's knowledgebase: writing, project docs, and notes." },
      { name: 'color-scheme', content: 'light' },
      { name: 'theme-color', content: '#121b35' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})

/** `/` opens find from anywhere, unless the reader is already typing. */
function slash(e: KeyboardEvent) {
  if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return false
  return !(e.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable="true"]')
}

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col bg-paper font-sans text-ink">
        <RootProvider
          theme={{ enabled: false }}
          search={{
            SearchDialog: Search,
            // One entry: every key listed in hotKey must match together.
            hotKey: [{ key: (e) => slash(e) || (e.key === 'k' && (e.metaKey || e.ctrlKey)), display: '/' }],
          }}
        >
          {children}
        </RootProvider>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <>
      <HeaderBand art="band">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 pt-14 pb-10 md:px-12 md:pt-[72px] md:pb-12 lg:pl-[352px]">
          <p className="font-mono text-[13px] leading-4 text-fd-ring">404</p>
          <h1 className="text-[36px] leading-10 font-semibold tracking-[-0.025em] text-paper md:text-[48px] md:leading-[52px]">Nothing filed here</h1>
          <p className="max-w-[620px] text-[17px] leading-7 text-paper/75 md:text-[19px]">This address has no page. It may have moved, or it may not be written yet.</p>
        </div>
      </HeaderBand>
      <main className="flex-1 bg-paper text-ink">
        <div className="mx-auto max-w-[1440px] px-6 pt-8 pb-24 md:px-12 lg:pl-[352px]">
          <Link to="/" className="group inline-flex items-center gap-2 font-mono text-[13px]">
            <Lean left className="text-fd-primary">
              ←
            </Lean>
            <span className="text-fd-muted-foreground group-hover:text-ink">back to the index</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
