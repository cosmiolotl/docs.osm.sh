import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

export function contentRevisions(root: string): Record<string, string> {
  const revisions: Record<string, string> = {}
  const paths = readdirSync(join(root, 'content'), { recursive: true, encoding: 'utf8' })
  for (const path of paths) {
    if (!path.endsWith('.md')) continue
    const relative = `content/${path.replaceAll('\\', '/')}`
    try {
      const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', relative], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim()
      if (date) revisions[`/${relative}`] = date
    } catch {
      // Source archives may lack Git history; frontmatter remains the fallback.
    }
  }
  return revisions
}
