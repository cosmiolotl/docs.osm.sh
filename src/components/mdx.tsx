import type { ComponentProps, ReactNode } from 'react'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'

/*
  The article's own pieces. Prose type lives in styles.css under
  `.article`; these supply the structure the CSS can't: a heading's `#`
  anchor, the code block's header, the table's frame, and the callout's
  dithered edge.
*/

function heading(As: 'h1' | 'h2' | 'h3' | 'h4') {
  return function Heading({ id, children, ...props }: ComponentProps<'h1'>) {
    return (
      <As id={id} {...props}>
        {id && (
          <a href={`#${id}`} aria-hidden="true" tabIndex={-1} className="not-article shrink-0 font-mono text-[13px] leading-4 font-normal text-fd-primary hover:text-fd-ring">
            #
          </a>
        )}
        <span className="min-w-0">{children}</span>
      </As>
    )
  }
}

type PreProps = ComponentProps<'pre'> & { title?: string; icon?: string; 'data-language'?: string }

// `icon` is fumadocs' language glyph; this header names the language in words instead.
function Pre({ title, icon: _icon, 'data-language': language, style, className = '', children, ...props }: PreProps) {
  const label = language && language !== 'plaintext' && language !== 'text' ? language : undefined
  return (
    <figure className="not-article border border-fd-border bg-fd-muted">
      {(title || label) && (
        <figcaption className="flex justify-between gap-4 border-b border-fd-border px-4 py-2 font-mono text-xs leading-4 text-fd-muted-foreground">
          <span className="min-w-0 truncate">{title}</span>
          {label && <span>{label}</span>}
        </figcaption>
      )}
      <pre {...props} style={{ ...style, backgroundColor: undefined }} className={`${className} overflow-x-auto p-4 font-mono text-[13px] leading-[22px] [&_.line]:px-0!`}>
        {children}
      </pre>
    </figure>
  )
}

function Table(props: ComponentProps<'table'>) {
  return (
    <div className="overflow-x-auto border border-fd-border">
      <table {...props} />
    </div>
  )
}

/**
  A pull-out statement on rose wash, with a dithered left edge.

    <Callout title="The rule">Never be willing to die because you're a frame.</Callout>
*/
export function Callout({ title, children }: { title?: ReactNode; type?: string; children?: ReactNode }) {
  return (
    <aside className="flex overflow-clip bg-fd-accent">
      <div aria-hidden="true" className="pixelated w-8 shrink-0 bg-[url(/dither/callout-edge.png)] bg-[length:32px_160px] bg-center bg-repeat-y" />
      <div className="flex min-w-0 flex-col gap-1.5 pt-[18px] pr-6 pb-5 pl-5">
        {title && <p className="eyebrow text-fd-primary">{title}</p>}
        <div className="text-lg leading-[27px] font-semibold text-black [&>*+*]:mt-3">{children}</div>
      </div>
    </aside>
  )
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    h1: heading('h1'),
    h2: heading('h2'),
    h3: heading('h3'),
    h4: heading('h4'),
    pre: Pre,
    table: Table,
    Callout,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
