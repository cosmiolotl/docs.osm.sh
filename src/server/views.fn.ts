import { createServerFn } from '@tanstack/react-start'

export const loadViews = createServerFn({ method: 'GET' }).handler(async () => {
  const { env } = await import('cloudflare:workers')
  return env.VIEW_COUNTER.getByName('global').read()
})

export const recordPageRead = createServerFn({ method: 'POST' })
  .validator((data: { path: string }) => {
    if (typeof data.path !== 'string' || !data.path.startsWith('/')) {
      throw new Error('Invalid page path')
    }
    return { path: data.path }
  })
  .handler(async ({ data }) => {
    const { findPage } = await import('@/server/content')
    const [kind, ...slug] = data.path.slice(1).split('/')
    if (!findPage(kind, slug.join('/'))) throw new Error('Page not found')
    const { env } = await import('cloudflare:workers')
    return env.VIEW_COUNTER.getByName('global').increment()
  })
