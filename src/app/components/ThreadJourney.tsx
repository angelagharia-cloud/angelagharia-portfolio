import studioRoll from "../../assets/cotton-studio-small.webp"
import studioLarge from "../../assets/cotton-studio.webp"
import { measureTypeRail, type TypeRail } from "./typeRail"
import { CottonFilm } from "./CottonFilm"
import { CottonStrip } from "./CottonStrip"
import { restingCotton } from "./cottonSpan"
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { animate, type MotionValue, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react"
import { Link } from "../lib/router"
import "./thread-journey.css"

import spoolPoster from "../../imports/opt/hero-spool-detail.webp"



const frameCount = 48
const columns = 8

function SpoolIllustration({ turns, active }: { turns: MotionValue<number>; active: boolean }) {
  const element = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const target = element.current
    if (!active || !target) return
    const image = new Image()
    let cancelled = false
    let unsubscribe: (() => void) | undefined
    function draw(turn: number) {
      target!.style.setProperty("--poster-opacity", String(Math.max(0, 1 - turn * 8)))
      const index = Math.floor(((turn % 1 + 1) % 1) * frameCount)
      const col = index % columns
      const row = Math.floor(index / columns)
      target!.style.backgroundPosition = `${col * 100 / (columns - 1)}% ${row * 100 / (frameCount / columns - 1)}%`
    }
    const frames = innerWidth <= 640 ? studioRoll : studioLarge
    image.src = frames
    image.decode().then(() => {
      if (cancelled) return
      target.style.backgroundImage = `url("${frames}")`
      target.style.backgroundSize = "800% 600%"
      draw(turns.get())
      unsubscribe = turns.on("change", draw)
    }).catch(() => { /* The matching first-frame poster stays visible. */ })
    return () => {
      cancelled = true
      unsubscribe?.()
      target.style.backgroundImage = ""
      target.style.backgroundSize = ""
      target.style.backgroundPosition = ""
    }
  }, [turns, active])
  return <span ref={element} className="spool-frames"><img src={spoolPoster} className="spool-poster" alt="" draggable={false} /></span>
}
type FlightRoute = { d: string; release: number; radius: number; contact: number; rebound: number }

/**
 * The line and the photographed spool share ONE motion value so the cotton
 * never draws ahead of, or behind, the moving object.
 */
export function HeroSpool({ active, onArrival }: { active: boolean; onArrival: () => void }) {
  const anchor = useRef<HTMLSpanElement>(null)
  const railRef = useRef<TypeRail | null>(null)
  const [filmFailed, setFilmFailed] = useState(false)
  const fallback = useCallback(() => setFilmFailed(true), [])
  const [route, setRoute] = useState<FlightRoute | null>(null)
  const flight = useMotionValue(0)
  const laid = useMotionValue(0)
  const looseEnd = useMotionValue("M0 0")
  const restEnd = useMotionValue("M0 0")
  const distance = useTransform(flight, value => `${value * 100}%`)
  const turns = useMotionValue(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const origin = anchor.current
    const portrait = document.querySelector("#portrait-stage img")
    const process = document.querySelector(".process-canvas")
    if (!origin || !portrait || !process) return
    let raf = 0
    function measure() {
      if (origin!.classList.contains("film-playing")) return
      // Compose the release relative to the real shoulder. A short downhill
      // run cannot throw a sewing spool across several hundred pixels.
      const title = origin!.closest("h1")!
      if (getComputedStyle(title).transform !== "none") return
      const label = origin!.parentElement!
      const portraitRect = portrait!.getBoundingClientRect()
      const bodyWidth = origin!.querySelector<HTMLElement>(".flight-spool")!.offsetWidth * .84
      const titleLeft = title.getBoundingClientRect().left
      const span = label.getBoundingClientRect().right - titleLeft
      const target = portraitRect.left + portraitRect.width * .24 - bodyWidth * .455
      const reach = Math.max(18, Math.min(46, innerWidth * .035))
      const currentSize = parseFloat(getComputedStyle(title).fontSize)
      const nextSize = Math.max(32, Math.min(150, currentSize * (target - reach - titleLeft) / span))
      if (portrait!.closest(".portrait-stage")?.getAttribute("data-side") === "0" && span > 0 && Math.abs(nextSize - currentSize) > .2) title.style.fontSize = nextSize.toFixed(2) + "px"
      const railGeometry = measureTypeRail(label, origin!, bodyWidth)
      if (railGeometry) {
        railRef.current = railGeometry
        label.style.setProperty("--rail-top", railGeometry.heights[0] + "px")
        restEnd.set(restingCotton(railGeometry.tailX, railGeometry.tailY, bodyWidth))
      }
      const a = origin!.getBoundingClientRect()
      const p = portrait!.getBoundingClientRect()
      const end = process!.getBoundingClientRect()
      // Near the outer jacket/shoulder, NEVER the face or facts controls.
      const diameter = origin!.querySelector<HTMLElement>(".flight-spool")!.offsetWidth
      // Measured from the alpha silhouette at 21% of the portrait height.
      const x = p.left + p.width * .24 - diameter * .39 - a.left
      const y = p.top + p.height * .21 - diameter * .10 - a.top
      const arrival = process!.querySelector(".landing-entry")!.getBoundingClientRect()
      const ex = arrival.left - a.left
      const ey = arrival.top - a.top

      // Three connected beats: roll off the type → soft shoulder contact
      // → a damped rebound → falling into the research-process canvas.
      const word = origin!.parentElement!.getBoundingClientRect()
      const run = word.right - a.left - diameter * .05
      const pivot = a.left - word.left
      const angle = Math.PI / 45
      let roll = "M 0 0"
      let rx = 0, ry = 0
      for (let i = 1; i <= 24; i++) {
        const t = i / 24
        const ease = Math.min(1, t / (.55 / .85))
        const tilt = angle * ease * ease * (3 - 2 * ease)
        const along = pivot + run * t * t
        rx = along * Math.cos(tilt) - pivot
        ry = along * Math.sin(tilt)
        roll += ` L ${rx} ${ry}`
      }
      const lead = Math.max(12, Math.min(130, (x - rx) * .32))
      // The SVG fallback follows the same direct physical approach as
      // the filmed spool on phones and desktops: no edge-hugging detour.
      const approach = roll +
        ` C ${rx + lead} ${ry + lead * Math.tan(angle)} ${x - lead} ${Math.max(ry, y - 36)} ${x} ${y}`
      const bounce = ` C ${x - 9} ${y - 15} ${x - 29} ${y - 24} ${x - 35} ${y - 15}`
      const gutter = end.left * .38 - a.left
      const entry = end.top - a.top
      const seam = process!.closest("section")!.getBoundingClientRect().top - a.top
      const fall = ` C ${x - 58} ${y + 64} ${gutter} ${seam - 130} ${gutter} ${seam} L ${gutter} ${entry} Q ${gutter} ${ey - 12} ${ex} ${ey}`
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
      path.setAttribute("d", approach + bounce + fall)
      const total = path.getTotalLength()
      path.setAttribute("d", roll)
      const release = path.getTotalLength() / total
      path.setAttribute("d", approach)
      const contact = path.getTotalLength() / total
      path.setAttribute("d", approach + bounce)
      const rebound = path.getTotalLength() / total
      if (Number.isFinite(total) && total > 0) {
        setRoute({ d: approach + bounce + fall, release, radius: diameter * .34, contact, rebound })
      }
    }
    function schedule() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    measure()
    void document.fonts.ready.then(() => { if (origin.isConnected) schedule() })
    const observer = new ResizeObserver(schedule)
    observer.observe(portrait)
    observer.observe(process)
    observer.observe(document.body)
    const title = origin.closest("h1")!
    title.addEventListener("transitionend", schedule)
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      title.removeEventListener("transitionend", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  useEffect(() => {
    if (!filmFailed || !active || !route || reduced) return
    anchor.current?.classList.remove("flight-landed")
    flight.set(0)
    const guide = document.createElementNS("http://www.w3.org/2000/svg", "path")
    guide.setAttribute("d", route.d)
    const length = guide.getTotalLength()
    const originY = anchor.current!.getBoundingClientRect().top + window.scrollY
    const startScroll = window.scrollY
    let following = true
    const release = () => { following = false }
    const inputs = ["wheel", "touchstart", "keydown"] as const
    inputs.forEach(event => window.addEventListener(event, release, { passive: true }))
    const radius = (anchor.current!.querySelector<HTMLElement>(".flight-spool")!.offsetWidth * .33)
    const unsubscribe = flight.on("change", value => {
      const travelled = length * value
      const point = guide.getPointAtLength(travelled)
      const paidOut = Math.max(0, travelled - radius * 2.9)
      const seam = guide.getPointAtLength(paidOut)
      const emergence = Math.min(1, travelled / (radius * 2), (length - travelled) / radius)
      const tipX = point.x - radius * .72 * emergence
      const tipY = point.y + radius * .54 * emergence
      const impact = Math.exp(-Math.pow((value - route.contact) / .055, 2))
      const slack = emergence * radius * (.38 + impact * .58)
      laid.set(paidOut / length)
      const tangent = guide.getPointAtLength(Math.min(length, paidOut + 1))
      const handle = Math.min(radius * .75, travelled / 4)
      looseEnd.set(`M ${seam.x} ${seam.y} C ${seam.x + (tangent.x - seam.x) * handle} ${seam.y + (tangent.y - seam.y) * handle} ${tipX - handle} ${tipY + slack} ${tipX} ${tipY}`)
      if (value >= 1) { anchor.current?.classList.add("flight-landed"); onArrival() }
      if (!following) return
      const target = Math.max(startScroll, originY + point.y - innerHeight * .61)
      window.scrollTo({ top: target, behavior: "auto" })
    })
    const word = anchor.current!.parentElement!
    const controls = animate(
      0, 2.4, {
        duration: 2.4, ease: "linear",
        onUpdate(time) {
          const smooth = (v: number) => v * v * (3 - 2 * v)
          const u = Math.min(1, time / .85)
          const tilt = time <= .85 ? smooth(Math.min(1, time / .55)) : 1 - smooth(Math.min(1, (time - .85) / .55))
          word.style.setProperty("--surname-tilt", `${4 * tilt}deg`)
          word.style.setProperty("--rim-shadow", String(1 - Math.min(1, Math.max(0, (time - .83) / .08))))
          let pos = route.release * u * u
          if (time > .85 && time <= 1.55) {
            const t = (time - .85) / .70
            const startSpeed = Math.min(1, 2 * route.release * .70 / (.85 * (route.contact - route.release)))
            pos = route.release + (route.contact - route.release) * (startSpeed * t + (1 - startSpeed) * t * t)
          } else if (time > 1.55 && time <= 1.76) {
            const t = (time - 1.55) / .21
            pos = route.contact + (route.rebound - route.contact) * (1 - (1 - t) ** 2)
          } else if (time > 1.76) {
            pos = route.rebound + (1 - route.rebound) * ((time - 1.76) / .64) ** 1.6
          }
          turns.set(Math.min(pos, route.release) * length / (2 * Math.PI * route.radius) + Math.max(0, time - .85) * .95)
          flight.set(time >= 2.4 ? 1 : Math.min(1, pos))
        },
      },
    )
    return () => {
      controls.stop()
      word.style.removeProperty("--surname-tilt")
      word.style.removeProperty("--rim-shadow")
      unsubscribe()
      inputs.forEach(event => window.removeEventListener(event, release))
    }
  }, [filmFailed, active, route?.d, reduced, flight])

  return (
    <span ref={anchor} className="spool-origin" aria-hidden="true">
      {!filmFailed && !(active && reduced) && <svg className="flight-thread resting-cotton">
        <CottonStrip curve={restEnd} width={innerWidth < 640 ? 3.1 : 4} step={3} />
      </svg>}
      {active && !reduced && !filmFailed && <CottonFilm railRef={railRef} onFallback={fallback} onArrival={onArrival} />}
      {filmFailed && route && active && !reduced && (
        <svg className="flight-thread" fill="none" strokeLinecap="round">
          <defs>
            <mask id="laid-cotton" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="10000" height="20000">
              <motion.path d={route.d} stroke="white" strokeWidth="9" style={{ pathLength: laid }} />
            </mask>
          </defs>
          <g mask="url(#laid-cotton)">
            <CottonStrip curve={route.d} />
          </g>
          <CottonStrip curve={looseEnd} />
        </svg>
      )}
      <motion.span
        className="flight-spool"
        style={{
          offsetPath: route ? `path("${route.d}")` : undefined,
          offsetDistance: distance,
          offsetRotate: "0deg",
        }}
        initial={false}
        animate={filmFailed && active && !reduced
          ? { opacity: [1, 1, 1, 1], rotate: [0, 0, -12, -7], scale: [1, 1.02, .94, .84] }
          : { opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: reduced ? 0 : 2.4, times: [0, .646, .733, 1], ease: "easeInOut" }}
      >
        <SpoolIllustration turns={turns} active={filmFailed && !reduced && Boolean(route)} />
      </motion.span>
    </span>
  )
}

export { ProjectThread } from "./ProjectThread"
// A single continuous cotton path. The first chapter should read like a real,
// irregular knot of uncertainty; each subsequent chapter lets the thread relax.
// Keep each chapter's end point continuous with the next one's start so the
// moving bobbin, its texture and the scroll-progress mask stay synchronized.
const chapters = [
  // Noise — tight overlapping loops, reversals and uneven radii (ends at 321,222).
  "C111 137 75 155 102 218 C130 302 233 292 214 221 C190 155 97 108 103 173 C97 230 185 277 234 238 C289 192 250 111 206 129 C157 147 157 230 215 240 C263 251 308 212 280 176 C263 148 234 161 254 203 C275 251 303 244 321 222",
  // Patterns — a few wider, purposeful loops (ends at 606,202).
  "C374 208 366 151 401 157 S427 232 469 216 S503 168 533 181 S561 219 606 202",
  // Insights — the line begins to settle (ends at 918,198).
  "C686 173 714 155 769 174 S842 200 918 198",
  // Clarity — quiet, nearly straight cotton (ends at 1170,198).
  "C990 196 1060 198 1170 198",
]
// Same tangent and settled slack shape as the last flight frame, in
// hundredths of the spool width. It stays on the page as more cotton pays out.
const settledTail = Array.from({ length: 25 }, (_, i) => {
  const q = 1 - i / 24
  return (i ? "L" : "M") + (-24 - 72 * q) + " " + (20 + 17 * q + 6 * Math.sin(2 * Math.PI * q))
}).join(" ")
const words = [
  { title: "Noise & uncertainty", sub: "Start with questions", question: "What gets in the way?", x: "1.5%" },
  { title: "Patterns", sub: "Research & synthesis", question: "What keeps coming up?", x: "27%" },
  { title: "Insights", sub: "Concept & prototype", question: "Which idea is worth testing?", x: "51%" },
  { title: "Clarity & focus", sub: "Design", question: "What can we simplify?", x: "79%" },
]

export function ThreadProcess({ active, fromHero }: { active: boolean; fromHero: boolean }) {
  const track = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const reduced = useReducedMotion()
  const [stage, setStage] = useState(0)
  // Land inside chapter ONE (Noise & uncertainty), with enough space
  // for the complete bobbin even on a narrow phone. The earlier desktop
  // entrance at x=672 inadvertently dropped the spool onto chapter three.
  // Keep the marker, physical thread and initial bobbin at one shared point.
  const startX = 120 // 10% of the 1200-unit process canvas; safely in step 1
  const entryCurve = `M${startX} 195`
  const curve = entryCurve + " " + chapters.join(" ")
  const slack = useMotionValue(0)
  const hangingCurve = useTransform(slack, t => {
    if (!t) return curve
    // Both endpoints stay pinned as slack travels through the original loops.
    return curve.replace(/(-?\d+) (-?\d+)/g, (_, sx, sy) => {
      const x = Number(sx), y = Number(sy)
      const along = Math.max(0, Math.min(1, (x - 120) / 1050))
      const sag = Math.sin(Math.PI * along)
      const wave = Math.sin(2 * Math.PI * (along - t))
      return (x + t * sag * 64) + " " + (y + t * sag * (92 + 26 * wave))
    })
  })
  const positionX = useMotionValue(`${startX / 12}%`)
  const positionY = useMotionValue("51.316%")
  const progress = useMotionValue(0)
  const groundShadow = useTransform(progress, [0, .026], [1, 0])
  const tailScale = useTransform(progress, [0, .032], [1, 0])
  const rollFrame = useMotionValue("100% 100%")


  useEffect(() => {
    const node = path.current!
    const total = node.getTotalLength()
    // The tangle is much longer than the straight portion. Map the same
    // scroll distance to each chapter so the last two stages remain legible.
    const measure = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let prefix = entryCurve
    const stops = [0, ...chapters.map(segment => {
      prefix += " " + segment
      measure.setAttribute("d", prefix)
      return measure.getTotalLength()
    })]
    // The camera may have moved the sticky stage during the fall. Start
    // its scroll travel at the exact frame where the landing settled.
    const travelAtScroll = () => {
      const box = track.current!.getBoundingClientRect()
      return Math.max(0, Math.min(1, (innerHeight * .28 - box.top) / Math.max(1, box.height - innerHeight * .44)))
    }
    const arrival = active && fromHero && !reduced ? travelAtScroll() : 0
    function draw(value: number) {
      const travel = (value - arrival) / Math.max(.001, 1 - arrival)
      const phase = active ? (reduced ? 4 : Math.max(0, Math.min(4, travel * 4))) : 0
      const chapter = Math.min(3, Math.floor(phase))
      const distance = stops[chapter] + (phase - chapter) * (stops[chapter + 1] - stops[chapter])
      const pos = measure.getPointAtLength(distance)
      setStage(chapter)
      positionX.set(String(pos.x / 12) + "%")
      // Match the visual SVG squash on narrow screens in JS rather than
      // relying on CSS calc(percent * variable), which is less portable.
      const depth = window.matchMedia("(max-width: 640px)").matches ? .66 : 1
      positionY.set(`${52.1053 + ((pos.y - 198) / 3.8) * depth}%`)
      progress.set(distance / total)
      // Rock through the studio take in both directions without a cut
      // between its stationary first and last frames.
      const cycle = distance / 210
      const frame = Math.round(47 * (.5 + .5 * Math.cos(Math.PI * cycle)))
      rollFrame.set(String((frame % 8) * 100 / 7) + "% " + String(Math.floor(frame / 8) * 20) + "%")
    }
    let released = false
    const update = () => {
      draw(travelAtScroll())
      const loose = active && !reduced && track.current!.getBoundingClientRect().bottom < innerHeight * .72
      if (released !== loose) {
        released = loose
        animate(slack, loose ? 1 : 0, {duration: loose ? 1.15 : .36, ease:"easeInOut"})
      }
    }
    update()
    window.addEventListener("scroll", update, { passive:true })
    window.addEventListener("resize", update)
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update) }
  }, [active, fromHero, entryCurve, reduced, positionX, positionY, progress, rollFrame])

  return (
    <section id="design-process" aria-labelledby="process-heading" className="thread-process">
      <div className="shell">
        <div className="process-topline">
          <span className="t-eyebrow text-neutral-500">The thread of reason / How I design</span>
        </div>
        <div className="process-intro">
          <h2 id="process-heading" className="t-h2 text-neutral-950">Making sense of the <em>mess.</em></h2>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-600">Design rarely starts with a straight line. I explore, connect and refine until the right solution becomes clear.</p>
        </div>
        <div className="process-track" ref={track}>
        <div className="process-canvas" aria-label="A single continuous cotton thread moving from tangled uncertainty to clarity">
          <div className="process-question" key={stage}>
            <p>{words[stage].question}</p>
          </div>
          <svg viewBox="0 0 1200 380" preserveAspectRatio="none" className="process-path">
            <mask id="process-cotton" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="380">
              <motion.path ref={path} d={hangingCurve} fill="none" stroke="white" strokeWidth="18" style={{ pathLength: progress }} />
            </mask>
            <g mask="url(#process-cotton)"><CottonStrip curve={hangingCurve} width={3.45} step={8} screenWidth /></g></svg>
          {/* Exact end of Clarity & focus. The falling portfolio cotton begins at this same physical point. */}
          <span className="process-exit" aria-hidden="true" />
          <div aria-hidden="true" className="landing-entry" data-settled={active} style={{ left: String(startX / 12) + "%" }}>
            <motion.span className="ground-shadow" style={{ opacity: groundShadow }} />
          </div>
          <motion.div hidden={!active} className="process-spool resting-bobbin" aria-hidden="true"
            style={{ ...({ "--spool-wide": `url("${studioLarge}")`, "--spool-small": `url("${studioRoll}")` } as CSSProperties),
              left: positionX, top: positionY, backgroundPosition: rollFrame }}>
            {active && <svg className="settled-tail" viewBox="-50 -42.1875 100 84.375">
              <motion.g style={{scale:tailScale, transformOrigin:"-24px 20px"}}>
                <CottonStrip curve={settledTail} width={4.2} step={4} />
              </motion.g>
            </svg>}
          </motion.div>
          {words.map((word, i) => <div key={word.title} className="process-word" data-current={active && stage === i} style={{ left: word.x }}>
            <span className="process-number">0{i + 1}</span>
            <strong>{word.title}</strong>
            <small>{word.sub}</small>
          </div>)}
        </div>
        </div>
        <div className="process-footer"><Link to="home" section="work">Explore selected work <span aria-hidden="true">↘</span></Link></div>
      </div>
    </section>
  )
}
