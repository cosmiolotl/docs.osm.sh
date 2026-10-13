/*
  The shelf art's hover wave. Each kind's picture is resampled through a
  fixed 4x4 Bayer lattice into four inks; on hover or focus the sampled
  subject sways and a bright sweep crosses it for 1.4s while the dots stay
  put. The resting frame equals the static poster (scripts/kind-art.py),
  so the canvas replaces the <img> without a visible change.
*/
const PAPER = [244, 242, 236]
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const DURATION = 1400

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const luminance = (c: ArrayLike<number>) => (c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722) / 255

export class Dither {
  private context: CanvasRenderingContext2D | null
  private inks: number[][]
  private shades: number[]
  private pixels?: Uint8ClampedArray
  private output?: ImageData
  private frame = 0
  private disposed = false

  constructor(
    private canvas: HTMLCanvasElement,
    inks: readonly string[],
  ) {
    this.context = canvas.getContext('2d', { willReadFrequently: true })
    this.inks = inks.map(rgb)
    this.shades = this.inks.map(luminance)
  }

  /** Resolves true once the canvas holds the resting frame. */
  async load(src: string): Promise<boolean> {
    if (!this.context) return false
    const image = new Image()
    image.src = src
    try {
      await image.decode()
    } catch {
      return false
    }
    if (this.disposed) return false
    const { width, height } = this.canvas
    // Sample the picture alone, not a frame an earlier instance left behind.
    this.context.clearRect(0, 0, width, height)
    this.context.drawImage(image, 0, 0, width, height)
    try {
      this.pixels = this.context.getImageData(0, 0, width, height).data
    } catch {
      return false // A host that taints the canvas keeps the poster.
    }
    this.output = this.context.createImageData(width, height)
    this.draw()
    return true
  }

  play(reducedMotion: boolean) {
    this.stop()
    if (!this.pixels || reducedMotion || document.hidden) return
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1)
      this.draw(progress)
      if (progress < 1) this.frame = requestAnimationFrame(animate)
      else this.stop()
    }
    this.frame = requestAnimationFrame(animate)
  }

  stop() {
    cancelAnimationFrame(this.frame)
    this.frame = 0
    this.draw()
  }

  /** Stop for good; a load still in flight will not touch the canvas. */
  dispose() {
    cancelAnimationFrame(this.frame)
    this.disposed = true
  }

  private draw(progress = 0) {
    const { pixels, output, context } = this
    if (!pixels || !output || !context || this.disposed) return
    const { width, height } = this.canvas
    const envelope = Math.sin(progress * Math.PI)
    for (let y = 0; y < height; y++) {
      // Move the sampled subject while the ordered lattice stays fixed.
      const displacement = Math.round(Math.sin(y * 0.12 - progress * 6) * envelope)
      for (let x = 0; x < width; x++) {
        const sx = Math.max(0, Math.min(width - 1, x + displacement))
        const i = (y * width + sx) * 4
        const distance = x / width - (progress * 1.5 - 0.25)
        const sweep = Math.exp(-distance * distance * 65) * envelope * 0.22
        const threshold = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16
        const level = Math.max(0, Math.min(3, Math.floor(this.tone(luminance(pixels.subarray(i, i + 3))) + sweep + threshold)))
        // Alpha picks the paper; the ascending ramp keeps the object's lighting.
        const color = pixels[i + 3] / 255 > threshold ? this.inks[level] : PAPER
        const o = (y * width + x) * 4
        output.data.set(color, o)
        output.data[o + 3] = 255
      }
    }
    context.putImageData(output, 0, 0)
  }

  /** Brightness as a position along the ink ramp, 0 (ink) to 3 (wash). */
  private tone(lum: number) {
    const s = this.shades
    if (lum <= s[0]) return 0
    for (let i = 1; i < s.length; i++) {
      if (lum <= s[i]) return i - 1 + (lum - s[i - 1]) / (s[i] - s[i - 1])
    }
    return s.length - 1
  }
}
