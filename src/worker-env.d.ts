import type { ViewCounter } from './server/ViewCounter'

declare global {
  namespace Cloudflare {
    interface Env {
      VIEW_COUNTER: DurableObjectNamespace<ViewCounter>
    }
  }
}
