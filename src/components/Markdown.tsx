import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { cn } from '@/lib/utils'

/* Page prose: markdown with GitHub tables and KaTeX math, set to the sheet's reading measure. */
export function Markdown({ source, className }: { source: string; className?: string }) {
  return (
    <div className={cn('prose-mono', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
