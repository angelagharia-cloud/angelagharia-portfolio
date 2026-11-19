import { useEffect, useRef, type RefObject } from "react"
import { crestAt, measureTypeRail, type TypeRail } from "./typeRail"
import { cottonSpan, type CottonPoint } from "./cottonSpan"
import spin from "../../assets/cotton-studio.webp"
import smallSpin from "../../assets/cotton-studio-small.webp"
import fibre from "../../imports/opt/cotton-fibre.webp"
import { createPortal, flushSync } from "react-dom"

const clamp = (t: number) => Math.max(0, Math.min(1, t))
const smooth = (t: number) => clamp(t) ** 2 * (3 - 2 * clamp(t))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const gravity = 860 // CSS pixels per second squared in the scene plane

// Sample both the centreline and its local tangent. The fine cotton texture
// follows the bend, while a continuous core stays legible at phone resolution.
function strand(ctx: CanvasRenderingContext2D, texture: CanvasPattern | null, points: CottonPoint[], width: number) {
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.beginPath()
  points.forEach(({ x, y }, i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))
  ctx.strokeStyle = texture ? "rgba(79,59,40,.38)" : "#ad9982"
  ctx.lineWidth = width * .78
  ctx.stroke()
  if (!texture) return
  const scale = width / 64
  ctx.fillStyle = texture
  let arc = 0
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i]
    const dx = b.x - a.x, dy = b.y - a.y
    const length = Math.hypot(dx, dy)
    if (length < .25) continue
    ctx.save()
    ctx.translate(a.x, a.y)
    ctx.rotate(Math.atan2(dy, dx))
    ctx.scale(scale, scale)
    const phase = (arc / scale) % 256
    ctx.translate(-phase, -32)
    ctx.fillRect(phase, 0, (length + .32) / scale, 64)
    ctx.restore()
    arc += length
  }
}

export function CottonFilm({ railRef, onFallback, onArrival }: { railRef: RefObject<TypeRail | null>; onFallback: () => void; onArrival: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext("2d")
    if (!ctx) { onFallback(); return }
    const anchor = document.querySelector<HTMLElement>(".spool-origin")!
    const scene = anchor.closest<HTMLElement>(".hero-composition")!
    const shortcut = scene.querySelector<HTMLElement>(".work-shortcut")!
    let shortcutOrigin: CottonPoint | undefined
    const word = anchor.parentElement!
    const jacket = document.querySelector<HTMLElement>("#portrait-stage img")!
    const entry = document.querySelector<HTMLElement>(".landing-entry")!
    const receiver = document.querySelector<HTMLElement>(".process-spool")!
    const spindle = anchor.querySelector<HTMLElement>(".flight-spool")!
    const introduction = scene.querySelector<HTMLElement>(".hero-copy > .t-lead")!
    let dirty: { x:number; y:number; width:number; height:number } | undefined
    const atlas = new Image(), grain = new Image()
    atlas.src = innerWidth <= 640 ? smallSpin : spin
    grain.src = fibre
    let cotton: CanvasPattern | null = null
    void grain.decode().then(() => { if (!disposed) cotton = ctx.createPattern(grain, "repeat-x") }).catch(() => {})
    let raf = 0, elapsed = 0, previous = 0, disposed = false, following = true, touched = false
    let cameraScale = 1, cameraX = 0, cameraY = 0, disengaged = Infinity
    let looseTip: { x: number; y: number; vx: number; vy: number } | undefined
    const stop = () => { following = false; disengaged = Math.min(disengaged, performance.now()) }
    const inputs = ["wheel", "touchstart", "keydown"] as const
    inputs.forEach(event => window.addEventListener(event, stop, { passive: true }))
    const initialScroll = scrollY
    let timing: { rollEnd: number; hit: number; ground: number; finish: number; takeoff: number; returnSpeed: number } | undefined
    function paint(now: number) {
      if (disposed || !ctx) return
      const dt = previous ? Math.min(.064, (now - previous) / 1000) : 0
      elapsed += dt
      previous = now
      const w = innerWidth, h = innerHeight, dpr = Math.min(devicePixelRatio, 2, Math.sqrt(2_100_000 / (w * h)))
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (dirty) ctx.clearRect(dirty.x, dirty.y, dirty.width, dirty.height)
      const sceneBox = scene.getBoundingClientRect()
      const baseX = sceneBox.left - cameraX, baseY = sceneBox.top - cameraY
      if (!shortcutOrigin) {
        const box = shortcut.getBoundingClientRect()
        shortcutOrigin = {x:box.left-baseX,y:box.top-baseY}
      }
      // Physics runs in the unprojected page. DOM scenery and the keyed
      // foreground are then photographed with the same camera transform.
      const worldBox = (el: Element) => {
        const box = el.getBoundingClientRect()
        return {
          left: baseX + (box.left - sceneBox.left) / cameraScale,
          right: baseX + (box.right - sceneBox.left) / cameraScale,
          top: baseY + (box.top - sceneBox.top) / cameraScale,
          width: box.width / cameraScale, height: box.height / cameraScale,
        }
      }
      const scrollBefore = scrollY
      const o = worldBox(anchor), p = worldBox(jacket), e = entry.getBoundingClientRect()
      const width = spindle.offsetWidth
      const size = width * .84
      const railShape = railRef.current
      const run = railShape?.distance ?? worldBox(word).right - o.left
      const pivot = o.left - worldBox(word).left
      const surface = railShape?.heights
      const descent = surface ? surface[surface.length - 1] - surface[0] : 0
      const edgeY = o.top + descent + (pivot + run) * Math.sin(Math.PI / 45)
      // At 21% of the original cutout height the first opaque jacket
      // pixel is 24% across. Use the rim, not the centre, for contact.
      const shoulderX = p.left + p.width * .24 - size * .455
      const shoulderY = p.top + p.height * .21
      if (!timing) {
        const drop = Math.max(4, shoulderY - edgeY)
        const flight = Math.sqrt(2 * drop / gravity)
        const speed = Math.max(12, (shoulderX - o.left - run) / flight)
        const naturalRoll = 2 * run / speed
        // Compress the release and airborne beats by the same ratio:
        // the exit tangent stays continuous on tall and narrow layouts.
        const rollEnd = Math.min(naturalRoll, .72 + Math.min(.17, run / 500))
        const releaseRate = naturalRoll / rollEnd
        const hit = rollEnd + flight / releaseRate
        const takeoff = -Math.min(.19 * gravity * flight * releaseRate, Math.sqrt(2 * gravity * size * .22))
        const returnSpeed = Math.sqrt(takeoff ** 2 + 2 * gravity * Math.max(1, e.top - shoulderY))
        const ground = hit + (returnSpeed - takeoff) / gravity
        const finish = ground + 2 * returnSpeed * .115 * 1.24 / gravity + .14
        timing = { rollEnd, hit, ground, finish, takeoff, returnSpeed }
      }
      const { rollEnd, hit, ground, finish, takeoff, returnSpeed } = timing
      const time = Math.min(finish, elapsed)
      const u = clamp(time / rollEnd), v = clamp((time - rollEnd) / (hit - rollEnd)), t = clamp((time - hit) / (ground - hit))
      const tilt = smooth(u / .82) * (1 - smooth((time - rollEnd) / .54))
      const pressure = Math.sin(Math.PI * smooth(clamp((u - .45) / .55)))
      const afterImpact = Math.max(0, time - ground)
      const landingWidth = parseFloat(getComputedStyle(receiver).width)
      const diameter = lerp(size, landingWidth, smooth(t))
      let x: number, y: number
      if (time <= rollEnd) {
        x = o.left + run * u * u
        const sample = u * u * ((surface?.length ?? 1) - 1)
        const contact = surface ? lerp(surface[Math.floor(sample)], surface[Math.ceil(sample)], sample % 1) - surface[0] : 0
        y = o.top + contact + (pivot + run * u * u) * Math.sin(tilt * Math.PI / 45)
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
      const copyTop = w < 1024 ? worldBox(introduction).top : 0
      word.style.setProperty("--surname-tilt", String(4 * tilt) + "deg")
      word.style.setProperty("--letter-load", String(pressure * Math.min(2.8, size * .033)) + "px")
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
      if (following && time > rollEnd)
        window.scrollTo({ top: lerp(scrollY, followTarget, 1 - Math.exp(-12 * dt)), behavior: "auto" })
      entry.style.setProperty("--contact-shadow", String(smooth(1 - clamp(Math.abs(e.top - y) / size))))
      const offset = scrollBefore - scrollY
      y += offset
      const push = smooth((u - .10) / .72) * (1 - smooth((time - rollEnd * .85) / (hit + .22 - rollEnd * .85)))
        * (1 - smooth((now - disengaged) / 300))
      // On phones the old camera push magnified the surname into the
      // Selected Work button and pulled the biography under the jacket.
      // Keep the real spool / cotton movement, but preserve the legible
      // two-column composition instead of zooming the whole scene.
      const cameraPush = w < 640 ? 0 : push
      cameraScale = 1 + cameraPush * (w < 1024 ? .36 : .72)
      const aimX = lerp(x, shoulderX, .12 * v)
      cameraX = (1-cameraScale) * (aimX-baseX) + (w*.54-aimX) * cameraPush * .32
      cameraY = (1-cameraScale) * (y-baseY-offset) + (h*.40-y) * cameraPush * .32
      if (cameraPush > 0) {
        scene.style.setProperty("--camera-depth", String(push))
        scene.style.transformOrigin = "0 0"
        scene.style.transform = `translate3d(${cameraX}px,${cameraY}px,0) scale(${cameraScale})`
        // Keep the primary navigation target on its page mark during the dolly.
        const tx = ((1-cameraScale)*shortcutOrigin.x-cameraX)/cameraScale
        const ty = ((1-cameraScale)*shortcutOrigin.y-cameraY)/cameraScale
        shortcut.style.transform = `translate3d(${tx}px,${ty}px,0) scale(${1/cameraScale})`
      } else {
        shortcut.style.removeProperty("transform")
        scene.style.removeProperty("--camera-depth")
        scene.style.removeProperty("transform")
        scene.style.removeProperty("transform-origin")
      }
      ctx.translate(baseX+cameraX, baseY+offset+cameraY)
      ctx.scale(cameraScale,cameraScale)
      ctx.translate(-baseX,-baseY-offset)
      const impactTurn = Math.sin(13 * t) * Math.exp(-7 * t) * 14
      const rollAngle = (4 * tilt + 7 * smooth(v) - 13 * Math.sin(Math.PI * t) + impactTurn - 7 * smooth(t) + 5 * Math.sin(afterImpact * 22) * Math.exp(-10 * afterImpact)) * Math.PI / 180
      const tangent = (angle: number) => ({
        x: -.24 * Math.cos(angle) - .20 * Math.sin(angle),
        y: -.24 * Math.sin(angle) + .20 * Math.cos(angle),
      })
      const peel = tangent(rollAngle), graze = tangent(7 * Math.PI / 180)
      const end = { x: x + diameter * peel.x, y: y + diameter * peel.y }
      const feed = smooth(v)
      const tailX = lerp(railShape?.tailX ?? -size * .60, run, feed)
      const supportY = railShape ? crestAt(railShape.crest, tailX) : Infinity
      const tailY = Number.isFinite(supportY) ? supportY : railShape?.tailY ?? size * .24
      const slope = tilt * Math.PI / 45
      const root = { x: o.left - pivot + (pivot + tailX) * Math.cos(slope) - tailY * Math.sin(slope),
        y: o.top + offset + (pivot + tailX) * Math.sin(slope) + tailY * Math.cos(slope) }
      const points: CottonPoint[] = []
      const seam = { x: shoulderX + size * graze.x, y: shoulderY + offset + size * graze.y }
      const firstEnd = time <= hit ? end : seam
      const paidSlack = Math.min(28, Math.abs(firstEnd.x - root.x) * .15)
      cottonSpan(points, root, firstEnd, lerp(size * .038, paidSlack, smooth(u)) * (1 - .54 * v),
        Math.min(11, size * .12), time - hit)
      if (railShape && time <= hit) {
        const cs = Math.cos(slope), sn = Math.sin(slope)
        for (const point of points) {
          const dx = point.x - o.left + pivot, dy = point.y - o.top - offset
          const localX = dx * cs + dy * sn - pivot
          const ceiling = crestAt(railShape.crest, localX)
          const penetration = -dx * sn + dy * cs - ceiling
          if (penetration > 0) { point.x += penetration * sn; point.y -= penetration * cs }
        }
      }
      if (time > hit) {
        const pinned = points.length
        cottonSpan(points, seam, end, Math.min(22, Math.hypot(end.x - seam.x, end.y - seam.y) * .14),
          Math.min(19, size * .24), time - hit)
        // The released cotton trails along the route the bobbin actually
        // took. A straight chord here would cut through the mobile bio.
        if (w < 1024) for (let i = pinned; i < points.length; i++) {
          const q = (i - pinned + 1) / (points.length - pinned)
          points[i].x = lane(points[i].y - offset - diameter * peel.y) + lerp(size * graze.x, diameter * peel.x, q)
        }
        // A soft contact spreads around the jacket seam. As the trailing
        // fibre slips away, a broader radius releases that contact.
        const radius = Math.min(pinned - 1, points.length - pinned, 2 + Math.round(5 * smooth((time-hit)/.34)))
        if (radius > 0) {
          const join = pinned-1, a = points[join-radius], b = points[join+radius], contact = points[join]
          for (let k = 1; k < 2*radius; k++) {
            const q = k / (2*radius), s = 1-q
            points[join-radius+k] = { x:s*s*a.x + 2*s*q*contact.x + q*q*b.x, y:s*s*a.y + 2*s*q*contact.y + q*q*b.y }
          }
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
      if (slip > 0 && tail.length > 1) {
        // After the end leaves the type it carries momentum independently.
        // Work in page coordinates so a camera scroll never kicks the fibre.
        const tip = tail[0], targetY = tip.y + scrollY
        looseTip ??= { x: tip.x, y: targetY, vx: 0, vy: 0 }
        const rate = 15, decay = Math.exp(-rate * dt)
        const dx = looseTip.x - tip.x, dy = looseTip.y - targetY
        const bx = looseTip.vx + rate * dx, by = looseTip.vy + rate * dy
        looseTip.x = tip.x + (dx + bx * dt) * decay
        looseTip.y = targetY + (dy + by * dt) * decay
        looseTip.vx = (looseTip.vx - rate * bx * dt) * decay
        looseTip.vy = (looseTip.vy - rate * by * dt) * decay
        const lagX = Math.max(-14, Math.min(14, looseTip.x - tip.x))
        const lagY = Math.max(-18, Math.min(18, looseTip.y - targetY))
        const curl = Math.min(5, Math.hypot(lagX, lagY) * .26)
        tail.forEach((p, i) => {
          const free = 1 - i / (tail.length - 1)
          p.x += slip * free * (free * lagX + curl * Math.sin(2 * Math.PI * free))
          p.y += slip * free * free * lagY
        })
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
        strand(ctx, cotton, tail, lerp(w < 640 ? 3.1 : 4, landingWidth * .042, smooth(t)))
      }
      // Only the spindle, contact shadow and thread change. Clearing the
      // full 4K viewport makes the compositor repaint empty porcelain.
      const radius = diameter * .75
      let left = x-radius, right = x+radius, top = y-radius, bottom = y+radius
      for (const point of tail) {
        left = Math.min(left,point.x-5); right = Math.max(right,point.x+5)
        top = Math.min(top,point.y-5); bottom = Math.max(bottom,point.y+5)
      }
      const projection = ctx.getTransform()
      dirty = { x:(projection.a*left+projection.e)/dpr-2, y:(projection.d*top+projection.f)/dpr-2,
        width:(right-left)*cameraScale+4, height:(bottom-top)*cameraScale+4 }
      {
        const phase = 47 * clamp(u * u * .48 + v * .22 + t * .30)
        const frame = Math.floor(phase)
        const cellW = atlas.naturalWidth / 8, cellH = atlas.naturalHeight / 6
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(rollAngle)
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
      else {
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
      const settling = [...(figure?.parentElement?.getAnimations({subtree:true}) ?? []), ...word.closest("h1")!.getAnimations()]
      await Promise.all(settling.map(animation => animation.finished.catch(() => {})))
      if (disposed) return
      if (!railRef.current) {
        railRef.current = measureTypeRail(word, anchor, anchor.querySelector<HTMLElement>(".flight-spool")!.offsetWidth * .84)
        if (railRef.current) word.style.setProperty("--rail-top", railRef.current.heights[0] + "px")
      }
      raf = requestAnimationFrame(paint)
    }).catch(() => { if (!disposed) onFallback() })
    return () => {
      disposed = true
      shortcut.style.removeProperty("transform")
      scene.style.removeProperty("--camera-depth")
      scene.style.removeProperty("transform")
      scene.style.removeProperty("transform-origin")
      cancelAnimationFrame(raf)

      inputs.forEach(event => window.removeEventListener(event, stop))
      anchor.classList.remove("film-playing", "flight-landed")
      word.style.removeProperty("--surname-tilt")
      word.style.removeProperty("--letter-load")
      entry.style.removeProperty("--contact-shadow")
    }
  }, [onFallback, onArrival, railRef])
  return createPortal(<canvas ref={ref} aria-hidden="true" className="cotton-film" />, document.body)
}
