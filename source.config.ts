import { defineConfig } from 'fumadocs-mdx/config'
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

/*
  Global MDX options. Collections themselves are declared with the macro
  API in src/lib/source.ts; this file only extends the default preset
  (GFM, headings, code highlighting) with `$inline$` / `$$display$$` math,
  and highlights code in one light theme with its language on the block.
*/
export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath],
    // KaTeX must run before the preset's rehype plugins see the math nodes.
    rehypePlugins: (v) => [[rehypeKatex, { strict: false, throwOnError: false }], ...v],
    rehypeCodeOptions: {
      // The site is daylight only: the light theme's colours go straight into the markup.
      themes: { light: 'github-light' },
      defaultColor: 'light',
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        {
          // The code block's header names the language.
          name: 'docs:language',
          pre(node) {
            node.properties['data-language'] = this.options.lang
          },
        },
      ],
    },
  },
})
