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
    const { source } = await import('@/lib/source')
    const slugs = data.path.split('/').filter(Boolean)
    // The index is not an article; only published pages count.
    if (slugs.length === 0 || !source.getPage(slugs)) throw new Error('Page not found')
    const { env } = await import('cloudflare:workers')
    return env.VIEW_COUNTER.getByName('global').increment()
  })
