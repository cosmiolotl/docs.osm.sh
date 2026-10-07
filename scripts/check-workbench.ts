import assert from 'node:assert/strict'
import { mkdirSync } from 'node:fs'
import { chromium, type Page } from 'playwright'

const base = process.argv[2] ?? 'http://localhost:3001'
const output = '.impeccable/review'
mkdirSync(output, { recursive: true })

async function views(page: Page) {
  const value = page.locator('dl div').filter({ has: page.locator('dt', { hasText: /^views$/ }) }).locator('dd')
  await page.waitForFunction(() => {
    const label = [...document.querySelectorAll('dt')].find((item) => item.textContent === 'views')
    return /^\d[\d,]*$/.test(label?.nextElementSibling?.textContent ?? '')
  })
  return Number((await value.innerText()).replaceAll(',', ''))
}

const browser = await chromium.launch()
const errors: string[] = []
browser.on('context', (context) => context.on('page', (page) => {
  page.on('pageerror', (error) => errors.push(error.message))
}))

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  let readUrl = ''
  page.on('request', (request) => {
    if (request.method() === 'GET' && request.url().includes('/_serverFn/')) readUrl = request.url()
  })
  await page.goto(base, { waitUntil: 'networkidle' })
  const initial = await views(page)
  await page.screenshot({ path: `${output}/workbench-desktop.png`, fullPage: true })
  const article = page.locator('a.sheet-link').first()
  const href = await article.getAttribute('href')
  assert.ok(href)
  assert.equal(await page.getByText('drawn', { exact: true }).count(), 0)
  const revision = page.locator('dl div').filter({ has: page.locator('dt', { hasText: 'last rev' }) }).locator('dd')
  assert.match(await revision.innerText(), /^\d{4}-\d{2}-\d{2}$/)
  console.log('Last article revision:', await revision.innerText())

  await article.hover()
  await page.waitForTimeout(300)
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await views(page), initial, 'Index reloads and article prefetches must not count')
  await page.locator('#find').fill('kurry')
  await page.waitForURL(/q=kurry/)
  await page.waitForLoadState('networkidle')
  assert.ok(await page.locator('a.sheet-link').count())
  assert.equal(await views(page), initial, 'Search must not count')

  await page.locator('a.sheet-link').first().click()
  await page.waitForURL((url) => url.pathname !== '/')
  await page.waitForLoadState('networkidle')
  await page.reload({ waitUntil: 'networkidle' })
  await page.keyboard.press('h')
  await page.waitForURL((url) => url.pathname === '/')
  await page.waitForLoadState('networkidle')
  assert.equal(await views(page), initial + 2, 'Opening and reloading an article each count once')
  assert.equal(await page.locator('a.sheet-link').first().evaluate((link) => link === document.activeElement), true)

  const readers = await Promise.all(Array.from({ length: 5 }, () => browser.newContext()))
  await Promise.all(readers.map(async (reader) => {
    const articlePage = await reader.newPage()
    await articlePage.goto(`${base}${href}`, { waitUntil: 'networkidle' })
  }))
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await views(page), initial + 7, 'Concurrent visitors must share one lossless total')
  await Promise.all(readers.map((reader) => reader.close()))
  await page.goto(`${base}/notes/does-not-exist`, { waitUntil: 'networkidle' })
  await page.goto(base, { waitUntil: 'networkidle' })
  assert.equal(await views(page), initial + 7, 'Missing pages must not count')

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 320, height: 568 },
    { width: 600, height: 375 },
  ]) {
    const mobile = await browser.newContext({ viewport, isMobile: true, hasTouch: true })
    const mobilePage = await mobile.newPage()
    await mobilePage.goto(base, { waitUntil: 'networkidle' })
    assert.equal(await mobilePage.locator('dl').isVisible(), false, 'Metadata must be hidden')
    assert.equal(await mobilePage.locator('.ruler').isVisible(), false, 'Ruler must be hidden')
    assert.equal(await mobilePage.getByText('move', { exact: true }).isVisible(), false, 'Footer must be hidden')
    const layout = await mobilePage.evaluate(() => {
      const list = document.querySelector<HTMLElement>('section[aria-label="Sheets"]')!
      return {
        pageWidth: document.documentElement.scrollWidth,
        pageHeight: document.documentElement.scrollHeight,
        width: innerWidth,
        height: innerHeight,
        listBottom: list.getBoundingClientRect().bottom,
        overflow: getComputedStyle(list).overflowY,
      }
    })
    assert.equal(layout.pageWidth, layout.width, 'Mobile must not overflow horizontally')
    assert.equal(layout.pageHeight, layout.height, 'Only the article list should scroll')
    assert.equal(layout.listBottom, layout.height, 'No footer or margin below the list')
    assert.equal(layout.overflow, 'auto')
    await mobilePage.screenshot({ path: `${output}/workbench-mobile-${viewport.width}.png` })
    if (viewport.height === 375) {
      const searchBefore = await mobilePage.locator('#find').boundingBox()
      const scrollTop = await mobilePage.locator('section[aria-label="Sheets"]').evaluate((list) => {
        list.scrollTop = list.scrollHeight
        return list.scrollTop
      })
      assert.ok(scrollTop > 0, 'Article list must scroll when it exceeds the available height')
      assert.deepEqual(await mobilePage.locator('#find').boundingBox(), searchBefore, 'Search must stay in place')
    }
    await mobilePage.locator('#find').fill('#kur')
    await mobilePage.getByRole('button', { name: /#kurry/ }).first().click()
    assert.equal(await mobilePage.locator('#find').inputValue(), '#kurry ')
    await mobile.close()
  }

  assert.ok(readUrl, 'Counter should load through a server function')
  await page.route(readUrl, (route) => route.abort())
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await page.getByText('# unavailable', { exact: true }).isVisible(), true)
  assert.ok(await page.locator('a.sheet-link').count(), 'Counter failure must not block reading')
  assert.deepEqual(errors, [])
  console.log('Passed: shared article count, reloads, concurrency, exclusions, search, mobile layout, scrolling, and counter failure.')
} finally {
  await browser.close()
}
