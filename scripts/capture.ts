// Review captures of the workbench at desktop and mobile, a search, and a
// page.   bun scripts/capture.ts [baseUrl] [prefix]
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const base = process.argv[2] ?? 'http://localhost:3000'
const prefix = process.argv[3] ?? ''
const out = '.impeccable/review'
mkdirSync(out, { recursive: true })

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

const browser = await chromium.launch({ headless: true })
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `${out}/${prefix}${vp.name}.png`, fullPage: true })
  await page.screenshot({ path: `${out}/${prefix}${vp.name}-fold.png` })
  if (vp.name === 'desktop') {
    await page.hover('a.sheet >> nth=4')
    await page.waitForTimeout(250)
    await page.screenshot({ path: `${out}/${prefix}desktop-hover.png` })
    await page.mouse.move(0, 0)
  }

  // Search: / focuses find, typing narrows and redlines.
  await page.keyboard.press('/')
  await page.keyboard.type('the', { delay: 30 })
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${out}/${prefix}${vp.name}-search.png` })
  console.log(vp.name, 'url after search:', page.url())

  if (vp.name === 'desktop') {
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(200)
    console.log('focused:', await page.evaluate(() => (document.activeElement as HTMLElement)?.dataset.at))
    await page.keyboard.press('Enter')
    await page.waitForURL((u) => u.pathname !== '/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${out}/${prefix}page.png`, fullPage: true })
    await page.keyboard.press('h')
    await page.waitForURL((u) => u.pathname === '/')
    await page.waitForTimeout(600)
    console.log('back at', page.url(), 'focused:', await page.evaluate(() => (document.activeElement as HTMLElement)?.dataset.at))
    await page.goto(`${base}/nowhere/at-all`, { waitUntil: 'networkidle' })
    await page.screenshot({ path: `${out}/${prefix}notfound.png` })
    await page.goto(`${base}/?q=zzzz`, { waitUntil: 'networkidle' })
    await page.screenshot({ path: `${out}/${prefix}nomatch.png` })
  }
  if (errors.length) console.log(vp.name, 'errors:', errors)
  await ctx.close()
}
await browser.close()
