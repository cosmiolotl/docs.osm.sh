// Rasters of public/favicon.svg, the one source of the mark: favicon.ico
// for browsers that skip SVG icons, and apple-touch-icon.png, full bleed
// because iOS rounds the corners itself.   bun scripts/icons.ts
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'

const svg = readFileSync('public/favicon.svg', 'utf8')
// The touch icon trades the squircle for a square of the same navy.
const square = svg.replace(/<path fill="(#[0-9a-f]+)" d="M32 2C[^"]*"\/>/, '<rect width="64" height="64" fill="$1"/>')
if (square === svg) throw new Error('favicon.svg: enclosure path not found')

const browser = await chromium.launch()
const page = await browser.newPage()

async function png(source: string, size: number) {
  const src = `data:image/svg+xml;base64,${Buffer.from(source).toString('base64')}`
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<body style="margin:0;background:transparent"><img id="i" src="${src}" width="${size}" height="${size}" style="display:block"></body>`,
  )
  await page.locator('#i').evaluate((img: HTMLImageElement) => img.decode())
  return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } })
}

/* An .ico that holds PNGs: a header, one 16-byte entry per image, then the images. */
function ico(images: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6 + images.length * 16)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach(({ size, data }, i) => {
    const at = 6 + i * 16
    header.writeUInt8(size >= 256 ? 0 : size, at)
    header.writeUInt8(size >= 256 ? 0 : size, at + 1)
    header.writeUInt16LE(1, at + 4)
    header.writeUInt16LE(32, at + 6)
    header.writeUInt32LE(data.length, at + 8)
    header.writeUInt32LE(offset, at + 12)
    offset += data.length
  })
  return Buffer.concat([header, ...images.map((i) => i.data)])
}

const sizes = [16, 32, 48]
const images = []
for (const size of sizes) images.push({ size, data: await png(svg, size) })
writeFileSync('public/favicon.ico', ico(images))
writeFileSync('public/apple-touch-icon.png', await png(square, 180))
await browser.close()
console.log(`wrote public/favicon.ico (${sizes.join(', ')}) and public/apple-touch-icon.png (180)`)
