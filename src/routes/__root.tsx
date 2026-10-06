import type { ReactNode } from 'react'
import { Link, Outlet, createRootRoute, HeadContent, Scripts, useLocation } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { SiteHeader } from '@/components/SiteHeader'
import { Margin, Row } from '@/components/Bench'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'docs.osm.sh' },
      { name: 'description', content: "osmii's knowledgebase: writing, project docs, and notes." },
      { name: 'color-scheme', content: 'light' },
      { name: 'theme-color', content: '#f4f2ec' },
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

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  const { pathname } = useLocation()
  return (
    <div className="flex flex-col min-h-dvh">
      <SiteHeader />
      <main className="flex-1 flex flex-col">
        <Row open label="Title block">
          <div className="title-cell px-[3ch] pt-12 pb-10 sm:py-14">
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.025em]">
              no such sheet
            </h1>
            <p className="mt-3 text-ink-2 break-all">
              <span className="text-ink-3">sheet not in set:</span> {pathname}
            </p>
          </div>
        </Row>
        <Row grow className="px-[3ch] py-3 text-sm">
          <Link
            to="/"
            className="text-ink-2 no-underline hover:underline hover:text-rose-ink transition-colors duration-150"
          >
            back to all sheets
          </Link>
        </Row>
      </main>
      <Margin ruled className="h-10" />
    </div>
  )
}
