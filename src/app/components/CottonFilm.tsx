import { useEffect, useRef } from "react"
import spin from "../../assets/cotton-studio.webp"
import smallSpin from "../../assets/cotton-studio-small.webp"
import fibre from "../../imports/opt/cotton-fibre.webp"
import { flushSync } from "react-dom"

const clamp = (t: number) => Math.max(0, Math.min(1, t))
const smooth = (t: number) => clamp(t) ** 2 * (3 - 2 * clamp(t))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
type Point = { x: number; y: number }
const gravity = 860 // CSS pixels per second squared in the scene plane

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
    const receiver = document.querySelector<HTMLElement>(".process-spool")!
    const atlas = new Image(), grain = new Image()
    atlas.src = innerWidth <= 640 ? smallSpin : spin
    grain.src = fibre
    let raf = 0, start = 0, previous = 0, disposed = false, landed = false, following = true, touched = false
    const stop = () => { following = false }
    const inputs = ["wheel", "touchstart", "keydown"] as const
    inputs.forEach(event => window.addEventListener(event, stop, { passive: true }))
    const initialScroll = scrollY
    let timing: { rollEnd: number; hit: number; ground: number; finish: number; takeoff: number; returnSpeed: number } | undefined
    function paint(now: number) {
      if (disposed || !ctx) return
      if (!start) start = now
      const elapsed = (now - start) / 1000
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
      const edgeY = o.top + (pivot + run) * Math.sin(Math.PI / 45)
      const shoulderX = p.left + p.width * .27 - size * .39
      const shoulderY = p.top + p.height * .205
      if (!timing) {
        const drop = Math.max(4, shoulderY - edgeY)
        const flight = Math.sqrt(2 * drop / gravity)
        const speed = Math.max(12, (shoulderX - o.left - run) / flight)
        const rollEnd = 2 * run / speed
        const hit = rollEnd + flight
        const takeoff = -.19 * gravity * flight
        const returnSpeed = Math.sqrt(takeoff ** 2 + 2 * gravity * Math.max(1, e.top - shoulderY))
        const ground = hit + (returnSpeed - takeoff) / gravity
        const finish = ground + 2 * returnSpeed * .115 * 1.24 / gravity + .14
        timing = { rollEnd, hit, ground, finish, takeoff, returnSpeed }
      }
      const { rollEnd, hit, ground, finish, takeoff, returnSpeed } = timing
      const time = Math.min(finish, elapsed)
      const u = clamp(time / rollEnd), v = clamp((time - rollEnd) / (hit - rollEnd)), t = clamp((time - hit) / (ground - hit))
      const tilt = smooth(u / .82) * (1 - smooth((time - rollEnd) / .54))
      word.style.setProperty("--surname-tilt", String(4 * tilt) + "deg")
      const pressure = Math.sin(Math.PI * smooth(clamp((u - .45) / .55)))
      word.style.setProperty("--letter-load", String(pressure * Math.min(2.8, size * .033)) + "px")
      const afterImpact = Math.max(0, time - ground)
      const landingWidth = parseFloat(getComputedStyle(receiver).width)
      const diameter = lerp(size, landingWidth, smooth(t))
      let x: number, y: number
      if (time <= rollEnd) {
        x = o.left + run * u * u
        y = o.top + (pivot + run * u * u) * Math.sin(tilt * Math.PI / 45)
      } else if (time <= hit) {
        x = lerp(o.left + run, shoulderX, v)
        y = lerp(edgeY, shoulderY, v * v)
      } else {
        // Normal impulse from fabric, followed by gravity. Horizontal
        // travel retains momentum until rolling friction arrests the spool.
        x = lerp(shoulderX, e.left, 1 - (1 - t) ** 1.4)
        y = lerp(shoulderY, e.top, t * t) + takeoff * (ground - hit) * t * (1 - t)
      }
      // On narrow screens, let the bobbin clear the controls before it
      // reaches the margin alongside the biography and process introduction.
      const copyTop = w < 1024 ? document.querySelector<HTMLElement>(".hero-copy > .t-lead")!.getBoundingClientRect().top : 0
      const rail = Math.max(diameter * .53 + 2, 15)
      function lane(atY: number) {
        const clear = smooth((atY - shoulderY - 38) / Math.max(90, copyTop - shoulderY - 65))
        const enter = smooth((atY - e.top + 105) / 105)
        return lerp(lerp(shoulderX, rail, clear), e.left, enter)
      }
      if (time > hit && w < 1024) x = lane(y)
      // Contact reverses only the normal velocity. Two short ballistic
      // hops dissipate energy before scroll takes over the same spindle.
      if (time >= ground) {
        const firstSpeed = returnSpeed * .115
        const firstDuration = 2 * firstSpeed / gravity
        const age = afterImpact < firstDuration ? afterImpact : afterImpact - firstDuration
        const speed = afterImpact < firstDuration ? firstSpeed : firstSpeed * .24
        const hop = Math.max(0, speed * age - gravity * age * age / 2)
        x = e.left
        y = e.top - hop
      }
      const followTarget = Math.max(initialScroll, scrollY + y - h * .57)
      if (!landed && following && time > rollEnd)
        window.scrollTo({ top: lerp(scrollY, followTarget, 1 - Math.exp(-12 * dt)), behavior: "instant" })
      entry.style.setProperty("--contact-shadow", String(smooth(1 - clamp(Math.abs(e.top - y) / size))))
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
      if (time > hit) {
        const pinned = points.length
        span(seam, end, Math.min(24, Math.hypot(end.x - seam.x, end.y - seam.y) * .1))
        // The released cotton trails along the route the bobbin actually
        // took. A straight chord here would cut through the mobile bio.
        if (w < 1024) for (let i = pinned; i < points.length; i++) {
          points[i].x = lane(points[i].y - offset - diameter * .20) - diameter * .24
        }
      }
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
      if (time < finish) {
        // Slack pools at the tangent on touchdown; no disappearing taut wire.
        const gather = smooth(clamp((time - ground + .17) / (finish - ground + .12)))
        if (gather > 0) tail.forEach((point, i) => {
          const q = 1 - i / Math.max(1, tail.length - 1)
          point.x = lerp(point.x, end.x - q * diameter * .72, gather)
          point.y = lerp(point.y, end.y + diameter * (.17 * q + .06 * Math.sin(2 * Math.PI * q)), gather)
        })
        strand(ctx, grain, tail, w < 640 ? 1.25 : 1.65)
      }
      if (time < finish) {
        const phase = 47 * clamp(u * u * .22 + v * .30 + t * .48)
        const frame = Math.floor(phase)
        const cellW = atlas.naturalWidth / 8, cellH = atlas.naturalHeight / 6
        ctx.save()
        ctx.translate(x, y)
        const impactTurn = Math.sin(13 * t) * Math.exp(-7 * t) * 14
        ctx.rotate((4 * tilt + 7 * smooth(v) - 13 * Math.sin(Math.PI * t) + impactTurn - 7 * smooth(t) + 5 * Math.sin(afterImpact * 22) * Math.exp(-10 * afterImpact)) * Math.PI / 180)
        ctx.drawImage(atlas, (frame % 8) * cellW, Math.floor(frame / 8) * cellH, cellW, cellH, -diameter / 2, -diameter * cellH / cellW / 2, diameter, diameter * cellH / cellW)
        if (frame < 47) {
          ctx.globalAlpha = phase - frame
          const next = frame + 1
          ctx.drawImage(atlas, (next % 8) * cellW, Math.floor(next / 8) * cellH, cellW, cellH, -diameter / 2, -diameter * cellH / cellW / 2, diameter, diameter * cellH / cellW)
        }
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
        flushSync(onArrival)
      }
    }
    atlas.decode().then(async () => {
      // When launched from an open fact, let the portrait return to its
      // neutral mark before measuring the collision.
      await new Promise<void>(done => requestAnimationFrame(() => requestAnimationFrame(() => done())))
      if (disposed) return
      const figure = jacket.closest(".portrait-figure")
      await Promise.all((figure?.getAnimations() ?? []).map(animation => animation.finished.catch(() => {})))
      if (!disposed) raf = requestAnimationFrame(paint)
    }).catch(() => { if (!disposed) onFallback() })
    return () => {
      disposed = true
      cancelAnimationFrame(raf)

      inputs.forEach(event => window.removeEventListener(event, stop))
      anchor.classList.remove("film-playing", "flight-landed")
      word.style.removeProperty("--surname-tilt")
      word.style.removeProperty("--letter-load")
      entry.style.removeProperty("--contact-shadow")
    }
  }, [onFallback, onArrival])
  return <canvas ref={ref} aria-hidden="true" className="cotton-film" />
}
