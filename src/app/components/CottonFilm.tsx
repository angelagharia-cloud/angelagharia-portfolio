import { useEffect, useRef } from "react"
import spin from "../../assets/cotton-studio.webp"
import smallSpin from "../../assets/cotton-studio-small.webp"
import fibre from "../../imports/opt/cotton-fibre.webp"
import landing from "../../imports/opt/process-landing.webp"

const clamp = (t: number) => Math.max(0, Math.min(1, t))
const smooth = (t: number) => clamp(t) ** 2 * (3 - 2 * clamp(t))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
type Point = { x: number; y: number }
const rollEnd = 1.45
const hit = 2.72
const finish = 4.85

// Sample both the centreline and its local tangent. The fine cotton texture
// follows the bend, while a continuous core stays legible at phone resolution.
function strand(ctx: CanvasRenderingContext2D, texture: HTMLImageElement, points: Point[], weight: number) {
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.beginPath()
  points.forEach(({ x, y }, i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))
  ctx.strokeStyle = "#887460"
  ctx.lineWidth = weight
  ctx.stroke()
  ctx.strokeStyle = "#d7c8ad"
  ctx.lineWidth = weight * .55
  ctx.stroke()
  if (!texture.naturalWidth) return
  let arc = 0
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i]
    const dx = b.x - a.x, dy = b.y - a.y
    const length = Math.hypot(dx, dy)
    if (length < .25) continue
    ctx.save()
    ctx.translate(a.x, a.y)
    ctx.rotate(Math.atan2(dy, dx))
    ctx.globalAlpha = .8
    ctx.drawImage(texture, Math.floor(arc * 5) % 192, 0, 64, 64, 0, -weight, length + .35, 2 * weight)
    ctx.restore()
    arc += length
  }
}

export function CottonFilm({ onFallback, onArrival }: { onFallback: () => void; onArrival: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext("2d")
    if (!ctx) { onFallback(); return }
    const anchor = canvas.closest<HTMLElement>(".spool-origin")!
    const word = anchor.parentElement!
    const jacket = document.querySelector<HTMLElement>("#portrait-stage img")!
    const entry = document.querySelector<HTMLElement>(".landing-entry")!
    const atlas = new Image(), grain = new Image(), landingPlate = new Image()
    atlas.src = innerWidth <= 640 ? smallSpin : spin
    grain.src = fibre
    landingPlate.src = landing
    let raf = 0, start = 0, previous = 0, disposed = false, landed = false, following = true, touched = false
    const stop = () => { following = false }
    const inputs = ["wheel", "touchstart", "keydown"] as const
    inputs.forEach(event => window.addEventListener(event, stop, { passive: true }))
    const initialScroll = scrollY
    function paint(now: number) {
      if (disposed || !ctx) return
      if (!start) start = now
      const time = Math.min(finish, (now - start) / 1000)
      const dt = Math.min(.05, (now - previous) / 1000)
      previous = now
      const w = innerWidth, h = innerHeight, dpr = Math.min(devicePixelRatio, 2, Math.sqrt(2_100_000 / (w * h)))
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const o = anchor.getBoundingClientRect(), p = jacket.getBoundingClientRect(), e = entry.getBoundingClientRect()
      const width = anchor.querySelector<HTMLElement>(".flight-spool")!.offsetWidth
      const size = width * .84
      const run = word.getBoundingClientRect().right - o.left
      const pivot = o.left - word.getBoundingClientRect().left
      const u = clamp(time / rollEnd), v = clamp((time - rollEnd) / (hit - rollEnd)), t = clamp((time - hit) / (finish - hit))
      const tilt = smooth(u / .82) * (1 - smooth((time - rollEnd) / .54))
      word.style.setProperty("--surname-tilt", String(4 * tilt) + "deg")
      const edgeY = o.top + (pivot + run) * Math.sin(Math.PI / 45)
      const shoulderX = p.left + p.width * .27 - size * .39
      const shoulderY = p.top + p.height * .205
      const landingWidth = entry.parentElement!.offsetWidth * 75 / 384
      const diameter = lerp(size, landingWidth, smooth(t))
      let x: number, y: number
      if (time <= rollEnd) {
        x = o.left + run * u * u
        y = o.top + (pivot + run * u * u) * Math.sin(tilt * Math.PI / 45)
      } else if (time <= hit) {
        // Match the rolling exit velocity before the longer flight across the hero.
        const distance = shoulderX - o.left - run
        const exitSpeed = 2 * run * (hit - rollEnd) / rollEnd
        const lead = Math.min(exitSpeed, Math.abs(distance) + size)
        // Integrate a short ease into the flight speed, then coast.
        const ramp = .18
        const coast = (distance - lead * ramp * (1 - Math.exp(-1 / ramp))) /
          (1 - ramp * (1 - Math.exp(-1 / ramp)))
        x = o.left + run + coast * v + (lead - coast) * ramp * (1 - Math.exp(-v / ramp))
        y = lerp(edgeY, shoulderY, v * v)
      } else {
        // Deflect out from the cloth, then accelerate towards the landing.
        const rebound = 1 - Math.exp(-10 * t)
        x = lerp(shoulderX, e.left, smooth(t)) - Math.min(54, w * .08) * rebound * (1 - t) ** 2
        y = lerp(shoulderY, e.top, t * t) - Math.min(84, h * .10) * Math.sin(Math.PI * t) * (1 - t) ** 3
      }
      // On narrow screens, let the bobbin clear the controls before it
      // reaches the margin alongside the biography and process introduction.
      if (time > hit && w < 1024) {
        const copy = document.querySelector<HTMLElement>(".hero-copy > .t-lead")!.getBoundingClientRect()
        const rail = Math.max(diameter * .53 + 2, copy.left * .45)
        const clear = smooth((y - shoulderY - 38) / Math.max(90, copy.top - shoulderY - 65))
        const enter = smooth((y - e.top + 105) / 105)
        x = lerp(lerp(shoulderX, rail, clear), e.left, enter)
      }
      const followTarget = Math.max(initialScroll, scrollY + y - h * .57)
      if (!landed && following && time > rollEnd)
        window.scrollTo({ top: lerp(scrollY, followTarget, 1 - Math.exp(-12 * dt)), behavior: "instant" })
      const offset = anchor.getBoundingClientRect().top - o.top
      y += offset
      const lag = Math.exp(-7 * t) * Math.sin(16 * t)
      const end = { x: x - diameter * .24, y: y + diameter * .20 }
      const root = { x: o.left + size * .15, y: o.top + offset + size * .30 }
      const points: Point[] = []
      function span(from: Point, to: Point, slack: number) {
        const length = Math.hypot(to.x - from.x, to.y - from.y)
        const count = Math.max(2, Math.ceil(length / 6))
        for (let i = points.length ? 1 : 0; i <= count; i++) {
          const q = i / count
          points.push({
            x: lerp(from.x, to.x, q) + lag * 8 * Math.sin(Math.PI * q),
            y: lerp(from.y, to.y, q) + 4 * q * (1 - q) * slack,
          })
        }
      }
      const seam = { x: shoulderX - size * .24, y: shoulderY + offset + size * .20 }
      const firstEnd = time <= hit ? end : seam
      span(root, firstEnd, Math.min(32, Math.abs(firstEnd.x - root.x) * .09) * smooth(time / rollEnd))
      if (time > hit) span(seam, end, Math.min(24, Math.hypot(end.x - seam.x, end.y - seam.y) * .1))
      // Once the free end slips off the type, keep a finite paid-out tail.
      // It follows the bobbin into the loose coil in the landing footage.
      const slip = smooth((time - hit - .12) / 1.12)
      const keep = lerp(points.length, Math.min(points.length, 19), slip)
      const trim = Math.max(0, points.length - keep)
      const first = Math.floor(trim)
      const tail = points.slice(first)
      if (tail.length > 1) {
        const fraction = trim - first
        tail[0] = { x: lerp(tail[0].x, tail[1].x, fraction), y: lerp(tail[0].y, tail[1].y, fraction) }
      }
      // A soft footprint narrows against the supporting letter, then fades
      // over the first few pixels of free flight.
      const lift = clamp((time - rollEnd) / .19)
      if (lift < 1) {
        ctx.save()
        ctx.translate(x, y + diameter * .33)
        ctx.rotate(tilt * Math.PI / 45)
        ctx.scale(diameter * (.29 + .09 * lift), Math.max(2, diameter * .042))
        const shadow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
        shadow.addColorStop(0, "rgba(66,44,24,.35)")
        shadow.addColorStop(1, "rgba(66,44,24,0)")
        ctx.globalAlpha = 1 - smooth(lift)
        ctx.fillStyle = shadow
        ctx.fillRect(-1, -1, 2, 2)
        ctx.restore()
      }
      if (time < finish) strand(ctx, grain, tail, w < 640 ? 1.25 : 1.65)
      if (time < finish) {
        const frame = Math.round(47 * clamp((u * u * .22 + v * .30 + t * .48)))
        const cellW = atlas.naturalWidth / 8, cellH = atlas.naturalHeight / 6
        ctx.save()
        ctx.translate(x, y)
        const impactTurn = Math.sin(13 * t) * Math.exp(-7 * t) * 14
        ctx.rotate((4 * tilt + 7 * smooth(v) - 13 * Math.sin(Math.PI * t) + impactTurn) * Math.PI / 180)
        ctx.drawImage(atlas, (frame % 8) * cellW, Math.floor(frame / 8) * cellH, cellW, cellH, -diameter / 2, -diameter * cellH / cellW / 2, diameter, diameter * cellH / cellW)
        ctx.restore()
      }
      anchor.classList.add("film-playing")
      if (!touched && time >= hit) {
        touched = true
        jacket.animate([{ translate: "0 0" }, { translate: "1.5px 1px", offset: .21 }, { translate: "0 0" }], { duration: 285 })
      }
      if (time < finish) raf = requestAnimationFrame(paint)
      else if (!landed) {
        landed = true
        anchor.classList.add("flight-landed")
        canvas.width = canvas.height = 1
        canvas.hidden = true
        atlas.removeAttribute("src")
        grain.removeAttribute("src")
        landingPlate.removeAttribute("src")
        onArrival()
      }
    }
    atlas.decode().then(() => { if (!disposed) raf = requestAnimationFrame(paint) }).catch(() => { if (!disposed) onFallback() })
    return () => {
      disposed = true
      cancelAnimationFrame(raf)

      inputs.forEach(event => window.removeEventListener(event, stop))
      anchor.classList.remove("film-playing", "flight-landed")
      word.style.removeProperty("--surname-tilt")
    }
  }, [onFallback, onArrival])
  return <canvas ref={ref} aria-hidden="true" className="cotton-film" />
}
