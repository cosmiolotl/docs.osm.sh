// Checks the inverted index against a few synthetic pages.   bun scripts/search-check.ts
import { buildIndex, plainText, search } from '@/lib/search-index'
import { hasTags, markTag, markWords, parseQuery, parseTags, tagAt } from '@/lib/search'

const index = buildIndex([
  {
    kind: 'writing',
    slug: 'russh',
    title: 'Serving a TUI over SSH with russh',
    summary: 'How the terminal site is served.',
    tags: ['rust', 'ssh'],
    body: '# Setup\n\nThe server keeps a **host key** on disk and hands each session a `Handle`.\n\n```rust\nlet key = load_host_key()?;\n```\n\nSee [the docs](https://docs.rs/russh).',
  },
  {
    kind: 'projects',
    slug: 'osm.sh/deploy',
    title: 'deploy',
    summary: 'Shipping to Fly.',
    tags: ['osm.sh', 'fly-io', 'rust'],
    body: 'Deploys run through fly. The key for the host lives in a secret, never in the image. Café au lait.',
  },
  {
    kind: 'notes',
    slug: 'ratatui',
    title: 'ratatui in the browser',
    tags: ['ratatui'],
    body: 'One source, two surfaces. Rendering cells in the browser with ratatui and a canvas backend.',
  },
])

let failed = 0
function check(name: string, ok: boolean, detail?: unknown) {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${ok ? '' : ` -> ${JSON.stringify(detail)}`}`)
  if (!ok) failed++
}
const slugs = (q: string) => search(index, parseQuery(q)).map((h) => h.slug)

check('body-only word is found', slugs('secret').join() === 'osm.sh/deploy', slugs('secret'))
check('title outranks body', slugs('ratatui')[0] === 'ratatui', slugs('ratatui'))
check('prefix matches a half-typed word', slugs('rata').includes('ratatui'), slugs('rata'))
check('every loose word must appear', slugs('host fly').join() === 'osm.sh/deploy', slugs('host fly'))
check('no match is empty', slugs('zzzz').length === 0)
check('phrase needs adjacent words', slugs('"host key"').join() === 'russh', slugs('"host key"'))
check('accents fold', slugs('cafe').join() === 'osm.sh/deploy', slugs('cafe'))
check('code inside fences is searchable', slugs('load_host_key').join() === 'russh', slugs('load_host_key'))
check('link urls are not indexed, labels are', slugs('docs.rs').length === 0 && slugs('the docs').length > 0)
check('one letter does not expand', slugs('l').length === 0, slugs('l'))

const hit = search(index, parseQuery('secret'))[0]
const snippet = hit.snippet?.segments.map((s) => (s.hit ? `[${s.text}]` : s.text)).join('')
check('snippet marks the match', snippet?.includes('[secret]') ?? false, snippet)
check('snippet reports body field', hit.fields.includes('body') && !hit.fields.includes('title'), hit.fields)

check('markdown is flattened', plainText('## A [link](x) and `code`') === 'A link and code', plainText('## A [link](x) and `code`'))

const marked = markWords('Serving a TUI', ['serv', 'tui'])
check(
  'markWords marks word starts only',
  marked.map((s) => (s.hit ? `[${s.text}]` : s.text)).join('') === '[Serv]ing a [TUI]',
  marked,
)
const inside = markWords('SYNTHETIC', ['the'])
check('markWords ignores matches inside words', inside.every((s) => !s.hit), inside)

const tags = (raw?: string) => parseTags(raw).join()
check('frontmatter tags fold and split', tags('Rust, #SSH,  blood on the clocktower ,rust') === 'rust,ssh,blood-on-the-clocktower', tags('Rust, #SSH,  blood on the clocktower ,rust'))
check('bracketed tag lists parse', tags("[a, 'b c']") === 'a,b-c', tags("[a, 'b c']"))
check('no tags is empty', tags(undefined) === '' && tags('  ') === '')
const pq = parseQuery('ssh #Rust "host key" c# #')
check('query splits tags from words', pq.tags.join() === 'rust' && pq.terms.join() === 'ssh,c' && pq.phrases.length === 1, pq)
check('a # inside quotes is a word', parseQuery('"#rust"').tags.length === 0)
const sorted = (q: string) => slugs(q).sort().join()
check('a tag alone filters, newest first', slugs('#rust').join() === 'russh,osm.sh/deploy', slugs('#rust'))
check('a tag matches the tags it begins', slugs('#rat').join() === 'ratatui' && slugs('#fly').join() === 'osm.sh/deploy', [slugs('#rat'), slugs('#fly')])
check('tags and words both bind', sorted('#rust host') === 'osm.sh/deploy,russh' && slugs('#ssh fly').length === 0, slugs('#rust host'))
check('every tag must match', slugs('#rust #ssh').join() === 'russh', slugs('#rust #ssh'))
check('an unknown tag is empty', slugs('#zzz').length === 0)
check('plain words find tags', slugs('io').join() === 'osm.sh/deploy', slugs('io'))
check('hasTags needs every tag', hasTags(['rust', 'ssh'], ['ru', 'ss']) && !hasTags(['rust'], ['rust', 'ssh']))
check('tagAt finds the tag at the caret', JSON.stringify(tagAt('ssh #ru', 7)) === '{"prefix":"ru","start":4,"end":7}', tagAt('ssh #ru', 7))
check('tagAt wants the caret at its end', tagAt('#rust x', 2) === null && tagAt('#rust x', 5)?.prefix === 'rust')
check('tagAt offers every tag for a bare #', tagAt('ssh #', 5)?.prefix === '')
check('tagAt skips a phrase', tagAt('"a #b', 5) === null)
const mt = (t: string, q: string[], words: string[]) =>
  markTag(t, q, words).map((s) => (s.hit ? `[${s.text}]` : s.text)).join('')
check('markTag marks a tag prefix', mt('ratatui', ['rat'], []) === '[#rat]atui', mt('ratatui', ['rat'], []))
check('markTag marks words in a tag', mt('blood-on-the-clocktower', [], ['clock']) === '#blood-on-the-[clock]tower', mt('blood-on-the-clocktower', [], ['clock']))

console.log(failed ? `\n${failed} failed` : '\nall passed')
process.exit(failed ? 1 : 0)
