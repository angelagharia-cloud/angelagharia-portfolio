import { Landing } from "./Landing"
import studioRoll from "../../assets/cotton-studio-small.webp"
import restingBobbin from "../../imports/opt/landing-bobbin.webp"
import { CottonFilm } from "./CottonFilm"
import { CottonStrip } from "./CottonStrip"
import { useCallback, useEffect, useRef, useState } from "react"
import { animate, type MotionValue, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react"
import { Link } from "../lib/router"
import "./thread-journey.css"

import spoolPoster from "../../imports/opt/hero-spool-detail.webp"
import spoolFrames from "../../assets/cotton-turntable.webp"


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
    const frames = spoolFrames
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
  const [filmFailed, setFilmFailed] = useState(false)
  const fallback = useCallback(() => setFilmFailed(true), [])
  const [route, setRoute] = useState<FlightRoute | null>(null)
  const flight = useMotionValue(0)
  const laid = useMotionValue(0)
  const looseEnd = useMotionValue("M0 0")
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
      const stacked = window.matchMedia("(max-width: 1023px)").matches
      const rail = document.documentElement.clientWidth - a.left - 13
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
      const approach = roll + (stacked
        ? ` C ${rx + lead} ${ry + lead * Math.tan(angle)} ${rail} ${ry + 45} ${rail} ${ry + 110} C ${rail} ${y * .68} ${rail} ${y - p.height * .34} ${x - 52} ${y - 62} Q ${x - 43} ${y - 32} ${x} ${y}`
        : ` C ${rx + lead} ${ry + lead * Math.tan(angle)} ${x - lead} ${Math.max(ry, y - 36)} ${x} ${y}`)
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
    const observer = new ResizeObserver(schedule)
    observer.observe(portrait)
    observer.observe(process)
    observer.observe(document.body)
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
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
      window.scrollTo({ top: target, behavior: "instant" })
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
      {active && !reduced && !filmFailed && <CottonFilm onFallback={fallback} onArrival={onArrival} />}
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
const processPath = "M260 195 C210 180 105 260 62 224 C12 184 39 82 89 94 C145 107 57 282 124 278 C199 274 219 104 164 112 C115 120 155 257 214 241 C268 227 305 142 267 141 C234 140 259 225 306 220 C348 216 349 165 376 172 C397 178 393 209 420 205 C448 201 449 184 473 189 C497 194 519 204 554 201 S639 193 702 197 S812 200 918 198 S1050 198 1170 198"
const words = [
  { title: "Noise & uncertainty", sub: "Start with questions", question: "What gets in the way?", x: "1.5%" },
  { title: "Patterns", sub: "Research & synthesis", question: "What keeps coming up?", x: "27%" },
  { title: "Insights", sub: "Concept & prototype", question: "Which idea is worth testing?", x: "51%" },
  { title: "Clarity & focus", sub: "Design", question: "What can we simplify?", x: "79%" },
]

export function ThreadProcess({ active }: { active: boolean }) {
  const track = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const reduced = useReducedMotion()
  const [stage, setStage] = useState(0)
  const [settled, setSettled] = useState(false)
  const finish = useCallback(() => setSettled(true), [])
  const positionX = useMotionValue("21.667%")
  const positionY = useMotionValue("51.316%")
  const progress = useMotionValue(0)
  const rollFrame = useMotionValue("0% 0%")
  const spinOpacity = useTransform(progress, [0, .035], [0, 1])
  const loopOpacity = useTransform(progress, [0, .045], [1, 0])
  const restOpacity = useTransform(spinOpacity, opacity => reduced ? 1 : 1 - opacity)
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 28%", "end 72%"] })

  const easedScroll = useSpring(scrollYProgress, { stiffness: 320, damping: 36, mass: .48, restDelta: .0001 })

  useEffect(() => {
    const node = path.current!
    const total = node.getTotalLength()
    // The tangle is much longer than the straight portion. Map the same
    // scroll distance to each chapter so the last two stages remain legible.
    const stops = [0, ...[324, 612, 948].map(x => {
      let lo = 0, hi = total
      for (let i = 0; i < 20; i++) {
        const mid = (lo + hi) / 2
        if (node.getPointAtLength(mid).x < x) lo = mid
        else hi = mid
      }
      return hi
    }), total]
    function draw(value: number) {
      const phase = settled ? (reduced ? 4 : Math.max(0, Math.min(4, value * 4))) : 0
      const chapter = Math.min(3, Math.floor(phase))
      const distance = stops[chapter] + (phase - chapter) * (stops[chapter + 1] - stops[chapter])
      const pos = node.getPointAtLength(distance)
      setStage(chapter)
      positionX.set(String(pos.x / 12) + "%")
      positionY.set(`calc(52.1053% + ${(pos.y - 198) / 3.8}% * var(--loop-depth, 1))`)
      progress.set(distance / total)
      // Rock through the studio take in both directions without a cut
      // between its stationary first and last frames.
      const cycle = distance / 210
      const frame = Math.round(47 * (.5 - .5 * Math.cos(Math.PI * cycle)))
      rollFrame.set(String((frame % 8) * 100 / 7) + "% " + String(Math.floor(frame / 8) * 20) + "%")
    }
    const source = reduced ? scrollYProgress : easedScroll
    draw(source.get())
    return source.on("change", draw)
  }, [settled, reduced, scrollYProgress, easedScroll, positionX, positionY, progress, rollFrame])

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
        <div className="process-canvas" aria-label="An illustration showing a tangled thread gradually becoming a straight line">
          <div className="process-question" key={stage}>
            <p>{words[stage].question}</p>
          </div>
          <svg viewBox="0 0 1200 380" preserveAspectRatio="none" className="process-path">
            <mask id="process-cotton" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="380">
              <motion.path ref={path} d={processPath} fill="none" stroke="white" strokeWidth="12" style={{ pathLength: progress }} />
            </mask>
            <g mask="url(#process-cotton)"><CottonStrip curve={processPath} width={4.4} step={8} /></g></svg>
          <motion.div className="landing-layer" style={{ opacity: loopOpacity }}><Landing active={active} settled={settled} reduced={!!reduced} finish={finish} /></motion.div>
          <motion.div hidden={!settled} className="process-spool" aria-hidden="true"
            style={{ left: positionX, top: positionY, transform: "translate(-50%, -50%)" }}>
            <motion.img src={restingBobbin} alt="" className="resting-bobbin" style={{ opacity: restOpacity }} />
            {settled && !reduced && <motion.div className="process-rolling" style={{ backgroundImage: `url(${studioRoll})`, backgroundPosition: rollFrame, opacity: spinOpacity }} />}
          </motion.div>
          {words.map((word, i) => <div key={word.title} className="process-word" data-current={settled && stage === i} style={{ left: word.x }}>
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
