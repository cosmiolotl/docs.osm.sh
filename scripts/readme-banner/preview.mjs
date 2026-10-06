// Render .github/banner.svg as an <img> (as GitHub does) on light and dark
// README backgrounds. Usage: node scripts/readme-banner/preview.mjs <out-dir>
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright'

const root = resolve(import.meta.dirname, '../..')
const outDir = resolve(process.argv[2] ?? '.')
const svg = readFileSync(join(root, '.github/banner.svg'))
const src = `data:image/svg+xml;base64,${svg.toString('base64')}`

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 880, height: 300 } })
for (const [name, bg] of [['light', '#ffffff'], ['dark', '#0d1117']]) {
  await page.setContent(
    `<body style="margin:0;padding:32px;background:${bg}"><img id="b" src="${src}" style="max-width:100%"></body>`,
  )
  await page.locator('#b').evaluate((img) => img.decode())
  await page.screenshot({ path: join(outDir, `banner-${name}.png`), fullPage: true })
}
await browser.close()
console.log(`previews in ${outDir}`)
