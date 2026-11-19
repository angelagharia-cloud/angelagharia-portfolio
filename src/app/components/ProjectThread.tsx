import { useEffect, useRef, useState } from "react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"
import { CottonStrip } from "./CottonStrip"

const projects = ["creative-key", "gravitad", "stammer-halo"]
type ContinuousSpoolThread = {
  curve: string
  length: number
  processLength: number
  maskHeight: number
}

type RevealSegment = {
  startAt: number
  leadEnd: number
  stitchedEnd: number
  scrollStart: number
  scrollArrival: number
  scrollFinish: number
}

type Catch = {
  id: string
  x: number
  y: number
  inletX: number
  inletY: number
  card: HTMLElement
  path: string
  start: number
  anchorX: number
  swingRoom: number
  finish: number
  arrival: number
}

function CornerCatch({
  shot,
  cursor,
  release,
}: {
  shot: Catch
  release: MotionValue<number>
  cursor: MotionValue<number>
}) {
  const { id, x, y, path, start, arrival } = shot
  const line = useTransform(cursor, [start, arrival], [0, 1])
  const swing = useTransform(() => {
    if (id !== projects[0]) return ""
    const t = release.get()
    // Tilt only the loose span. Fade the swing before the first card takes its weight.
    const slack = Math.max(0, 1 - line.get() * 4)
    const angle = Math.sin(t * Math.PI * 2) * (1 - t) * slack * shot.swingRoom / 100
    const drop = 1 - .75 * (1 - t) * slack
    return `translate(${shot.anchorX} ${start}) matrix(1 0 ${angle} ${drop} 0 0) translate(${-shot.anchorX} ${-start})`
  })
  const frame = useTransform(cursor, [arrival, shot.finish], [0, 47])
  const wrap = useTransform(frame, [4, 43], [0, 1])
  const opacity = useTransform(frame, [0, 4], [0, 1])
  const tension = useTransform(frame, [0, 20, 43, 47], [0, .08, 1, .92])
  // Cotton enters the face, passes behind it, then comes back through a second hole.
  const stitch = useTransform(tension, t =>
    `M ${x-19} ${y+19} Q ${x+16-18*t} ${y+10+10*t} ${x+3-10*t} ${y+21}
     Q ${x-6} ${y+28} ${x-13} ${y+28} M ${x-11} ${y+33} Q ${x-4} ${y+34} ${x+4} ${y+35}`)
  useEffect(() => {
    const card = shot.card
    const w = card.offsetWidth, h = card.offsetHeight
    function squeeze(load: number) {
      if (load <= .001) {
        card.style.removeProperty("clip-path")
        card.style.removeProperty("--cotton-load")
        return
      }
      // Only the upper-right seam gives under tension. A pair of cubic
      // curves forms a shallow waist around the loaded strand.
      const notch = 13 * load
      const edge = "M -100 -100 H " + (w-44) + " V 0 C " +
        [w-24, 0, w-12-notch*.6, 3+notch*.5, w-9-notch*.55, 8+notch*.72].join(" ") +
        " C " + [w-5-notch, 15+notch, w, 22+notch*.55, w, 42].join(" ") +
        " H " + (w+100) + " V " + (h+100) + " H -100 Z"
      card.style.clipPath = 'path("' + edge + '")'
      card.style.setProperty("--cotton-load", String(load))
    }
    squeeze(tension.get())
    const unsubscribe = tension.on("change", squeeze)
    return () => { unsubscribe(); squeeze(0) }
  }, [shot, tension])
  return (
    <>
      <mask
        id={`catch-line-${id}`}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="100%"
        height={y + 100}
      >
        <motion.path
          d={path}
          fill="none"
          stroke="white"
          strokeWidth="9"
          style={{ pathLength: line }}
        />
      </mask>
      <motion.g className="catch-leading-fibre" transform={swing}><g mask={`url(#catch-line-${id})`}>
        <CottonStrip curve={path} width={3.2} step={12} />
      </g></motion.g>
      <motion.g style={{opacity}}>
        {[[shot.inletX, shot.inletY], [x-19,y+19], [x-13,y+28], [x-11,y+33]].map(([cx,cy]) =>
          <ellipse key={cy} cx={cx} cy={cy} rx="2.7" ry="1.7" fill="#574638" stroke="#d5c5ad" strokeWidth=".8" />)}
      </motion.g>
      <mask id={`stitch-${id}`} maskUnits="userSpaceOnUse" x={x-32} y={y} width="56" height="50">
        <motion.path d={stitch} fill="none" stroke="white" strokeWidth="8" style={{pathLength:wrap}} />
      </mask>
      <g mask={`url(#stitch-${id})`}><CottonStrip curve={stitch} width={3.4} step={2} /></g>
    </>
  )
}


type CottonPoint = { x: number; y: number }
type CottonPart = { command: string; start: number; finish: number }
const clamp01 = (n: number) => Math.max(0, Math.min(1, n))
const easeFall = (v: number) => {
  const t = clamp01(v)
  return t * t * (3 - 2 * t)
}

export function ProjectThread({ active }: { active: boolean }) {
  const svg = useRef<SVGSVGElement>(null)
  const [shots, setShots] = useState<Catch[]>([])
  const [handoff, setHandoff] = useState(false)
  const [ready, setReady] = useState(false)
  const [textured, setTextured] = useState(false)
  const cursor = useMotionValue(0)
  const release = useMotionValue(0)
  const fibre = useMotionValue("M 0 0")
  const reveal = useMotionValue(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!active) return
    const layer = svg.current!
    const canvas = document.querySelector<HTMLElement>(".process-canvas")!
    const cards = projects.map(id =>
      document.querySelector<HTMLAnchorElement>('#work article a[href="#/' + id + '"]')?.closest("article"))
    const sampler = document.createElementNS("http://www.w3.org/2000/svg", "path")
    const segmentSampler = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let source: CottonPoint[] = []
    let pivot: CottonPoint = { x: 0, y: 0 }
    let oldTip: CottonPoint = { x: 0, y: 0 }
    let firstTip: CottonPoint = { x: 0, y: 0 }
    let parts: CottonPart[] = []
    let released = false
    let from = 0
    let travelled = 0
    let priorFibre = ""
    let priorShotLayout = ""
    let lastSample = 0

    function draw() {
      if (!source.length) return
      const t = release.get()
      // The spool is source[0] (Clarity). The thread's real, free end is
      // source[last] (Noise), NOT a new segment beginning at the spool.
      // Gravity draws this same material downward, untying each old loop.
      const moving = source.map((point, i) => {
        const u = i / (source.length - 1)
        const fall = easeFall((t - .17 * (1 - u)) / (1 - .17 * (1 - u)))
        const wave = Math.sin(Math.PI * u)
        // On phones the falling yarn stays within the right edge of the
        // composition instead of sweeping across the highlights numbers.
        const phone = window.matchMedia("(max-width: 640px)").matches
        const suspendedX = pivot.x + (firstTip.x - pivot.x) * u +
          wave * ((phone ? 9 : 34) * Math.sin(3.5 * Math.PI * u) -
                  (phone ? 4 : 16) * Math.sin(7 * Math.PI * u) +
                  (phone ? 11 : 0))
        const suspendedY = pivot.y + (firstTip.y - pivot.y) * u +
          wave * 16 * Math.sin(3 * Math.PI * u)
        return {
          x: point.x + (suspendedX - point.x) * fall,
          y: point.y + (suspendedY - point.y) * fall,
        }
      })
      let d = moving.map((p, i) =>
        (i ? " L " : "M ") + p.x.toFixed(2) + " " + p.y.toFixed(2)).join("")
      segmentSampler.setAttribute("d", d)
      const baseLength = segmentSampler.getTotalLength()
      const lengths = [baseLength]
      for (const part of parts) {
        d += " " + part.command
        sampler.setAttribute("d", d)
        lengths.push(sampler.getTotalLength())
      }
      const total = Math.max(1, lengths[lengths.length - 1])
      let paid = baseLength
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        const progress = clamp01((travelled - part.start) /
          Math.max(1, part.finish - part.start))
        paid += progress * (lengths[i + 1] - lengths[i])
      }
      if (d !== priorFibre) {
        priorFibre = d
        fibre.set(d)
      }
      reveal.set(clamp01(paid / total))
      layer.dataset.gravityProgress = t.toFixed(3)
      layer.dataset.gravityDrop = (moving[moving.length - 1].y - oldTip.y).toFixed(1)
      // While the fibre is physically moving, paint its uninterrupted core
      // as one SVG stroke. Thousands of patterned rectangles can briefly
      // detach from an animated mask; mount that texture ONLY once settled.
      setTextured(t >= .985)
    }

    function update() {
      if (reduced) {
        cursor.set(Number.MAX_SAFE_INTEGER)
        return
      }
      const rect = canvas.getBoundingClientRect()
      const bottom = canvas.parentElement!.getBoundingClientRect().bottom
      const originY = layer.getBoundingClientRect().top
      const exit = canvas.querySelector<HTMLElement>(".process-exit")?.getBoundingClientRect()
      from = (exit?.top ?? (rect.top + rect.height * 198 / 380)) +
        (bottom - rect.bottom) - originY
      const past = innerHeight * .72 - bottom
      const falling = past > 0
      setHandoff(falling && source.length > 0)
      if (falling !== released) {
        released = falling
        release.stop()
        if (falling) animate(release, 1, { duration: 1.3, ease: "easeInOut" })
        else release.set(0)
      }
      if (!falling) {
        travelled = from
      } else {
        const first = cards[0]?.getBoundingClientRect()
        if (!first) return
        const visible = innerHeight * .68 - originY
        const cardLine = first.top - originY - 90
        const remaining = Math.max(0, cardLine - visible)
        travelled = remaining
          ? from + (cardLine - from) * past / (past + remaining)
          : visible
      }
      cursor.set(travelled)
      draw()
    }

    function measure() {
      const layerRect = layer.getBoundingClientRect()
      const canvasRect = canvas.getBoundingClientRect()
      const bottom = canvas.parentElement!.getBoundingClientRect().bottom
      const originalPath = canvas.querySelector<SVGPathElement>("#process-cotton path")
      const ctm = originalPath?.getScreenCTM()
      if (!originalPath || !ctm || !cards[0]) return
      const total = originalPath.getTotalLength()
      const n = Math.min(360, Math.max(80, Math.ceil(total / 9)))
      const samples: CottonPoint[] = []
      for (let i = 0; i <= n; i++) {
        // Reverse the EXISTING tangled strand: Clarity spool -> Noise free end.
        const p = originalPath.getPointAtLength(total * (1 - i / n))
        const transformed = new DOMPoint(p.x, p.y).matrixTransform(ctm)
        samples.push({
          x: transformed.x - layerRect.left,
          y: transformed.y - layerRect.top + bottom - canvasRect.bottom,
        })
      }
      source = samples
      pivot = samples[0]
      oldTip = samples[samples.length - 1]
      const rail = Math.min(layerRect.width - 6, canvasRect.right - layerRect.left + 12)
      const catches: Catch[] = []
      const commands: CottonPart[] = []
      let previousX = 0, previousY = 0
      cards.forEach((card, i) => {
        if (!card) return
        const r = card.getBoundingClientRect()
        const x = r.right - layerRect.left - 5
        const y = r.top - layerRect.top + 6
        const inletX = x - 22
        const inletY = y + 13
        if (i === 0) firstTip = { x: inletX, y: inletY }
        const start = catches[catches.length - 1]?.finish ?? from
        const arrival = Math.max(start + 90, inletY)
        const stitch = "C " + (inletX + 12) + " " + (inletY + 10) + ", " +
          (x - 22) + " " + (y + 28) + ", " + (x + 4) + " " + (y + 35)
        if (i !== 0) {
          const reach = inletY - previousY
          const sharedRow = i === 2 && r.width < canvasRect.width * .75
          const gutterY = y - 22
          const lead = sharedRow
            ? "Q " + rail + " " + (previousY + 10) + " " + rail + " " + (previousY + 30) +
              " L " + rail + " " + (gutterY - 15) +
              " Q " + rail + " " + gutterY + " " + (rail - 24) + " " + gutterY +
              " C " + (rail - 80) + " " + gutterY + " " + (inletX + 32) + " " + (gutterY - 4) +
              " " + inletX + " " + inletY
            : "C " + (previousX + (rail - previousX) * .8) + " " + (previousY + 5) +
              ", " + rail + " " + (previousY + reach * .12) + ", " + rail + " " +
              (previousY + reach * .35) + " S " + (rail + 3) + " " + (inletY - 44) +
              ", " + inletX + " " + inletY
          commands.push({ command: lead, start, finish: arrival })
        }
        commands.push({ command: stitch, start: arrival - 15, finish: arrival + 48 })
        catches.push({
          id: projects[i], card, x, y, inletX, inletY,
          path: "M " + (i ? previousX : firstTip.x) + " " +
            (i ? previousY : firstTip.y) + " " + stitch,
          start, arrival, finish: arrival + 48, anchorX: pivot.x,
          swingRoom: Math.min(32, Math.max(0, layerRect.width - rail - 3)),
        })
        previousX = x + 4
        previousY = y + 35
      })
      if (!catches.length) return
      parts = commands
      const signature = catches.map(shot => shot.id + ":" +
        shot.x.toFixed(1) + ":" + shot.y.toFixed(1) + ":" +
        shot.arrival.toFixed(1)).join("|")
      if (signature !== priorShotLayout) {
        priorShotLayout = signature
        setShots(catches)
      }
      setReady(true)
      update()
      draw()
    }

    const unsubscribe = release.on("change", draw)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    cards.forEach(c => c && observer.observe(c))
    const originalGroup = canvas.querySelector(".process-path > g")
    const gravity = new MutationObserver(() => {
      if (!released || performance.now() - lastSample < 40) return
      lastSample = performance.now()
      measure()
    })
    if (originalGroup) gravity.observe(originalGroup, {
      attributes: true, attributeFilter: ["transform"],
    })
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", measure)
    return () => {
      gravity.disconnect()
      unsubscribe()
      release.stop()
      observer.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", measure)
    }
  }, [active, reduced, cursor, release, fibre, reveal])

  return (
    <svg ref={svg} aria-hidden="true" className="project-thread"
      data-continuation="original-noise-cotton-falls"
      data-handoff={handoff && ready}>
      {active && ready && (
        <>
          <mask id="single-cotton-reveal" maskUnits="userSpaceOnUse"
            x="-100" y="0" width="3000" height="14000">
            <motion.path d={fibre} fill="none" stroke="#fff" strokeWidth="12"
              style={{ pathLength: reveal }} />
          </mask>
          <g className="continuous-cotton-fibre" fill="none"
            strokeLinecap="round" strokeLinejoin="round">
            <motion.path d={fibre} stroke="#65543f" strokeWidth="4.6"
              strokeOpacity=".27" style={{ pathLength: reveal }} />
            <motion.path d={fibre} stroke="#bcae9b" strokeWidth="3.25"
              style={{ pathLength: reveal }} />
            <motion.path d={fibre} stroke="#e3d7c6" strokeWidth=".72"
              strokeOpacity=".8" style={{ pathLength: reveal }} />
            {textured && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: .38, ease: "easeOut" }}
                mask="url(#single-cotton-reveal)">
                <CottonStrip curve={fibre} width={3.45} step={12} />
              </motion.g>
            )}
          </g>
        </>
      )}
      {active && shots.map(shot => (
        <CornerCatch key={shot.id} shot={shot} cursor={cursor} release={release} />
      ))}
    </svg>
  )
}
