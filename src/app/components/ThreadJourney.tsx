import { CottonStrip } from "./CottonStrip"
import { useEffect, useRef, useState } from "react"
import { animate, type MotionValue, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react"
import { Link } from "../lib/router"
import "./thread-journey.css"

import spoolPoster from "../../assets/cotton-poster.webp"
import spoolFrames from "../../assets/cotton-turntable.webp"

import processPoster from "../../assets/process-bobbin.webp"
import processFrames from "../../assets/process-turn.webp"

const frameCount = 48
const columns = 8

function SpoolIllustration({ turns, active, process = false }: { turns: MotionValue<number>; active: boolean; process?: boolean }) {
  const element = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const target = element.current
    if (!active || !target) return
    const image = new Image()
    let cancelled = false
    let unsubscribe: (() => void) | undefined
    function draw(turn: number) {
      const index = Math.floor(((turn % 1 + 1) % 1) * frameCount)
      const col = index % columns
      const row = Math.floor(index / columns)
      target!.style.backgroundPosition = `${col * 100 / (columns - 1)}% ${row * 100 / (frameCount / columns - 1)}%`
    }
    const frames = process ? processFrames : spoolFrames
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
  }, [turns, active, process])
  return <span ref={element} className="spool-frames"><img src={process ? processPoster : spoolPoster} className="spool-poster" alt="" draggable={false} /></span>
}
type FlightRoute = { d: string; contact: number; rebound: number }

/**
 * The line and the photographed spool share ONE motion value so the cotton
 * never draws ahead of, or behind, the moving object.
 */
export function HeroSpool({ active }: { active: boolean }) {
  const anchor = useRef<HTMLSpanElement>(null)
  const [route, setRoute] = useState<FlightRoute | null>(null)
  const flight = useMotionValue(0)
  const laid = useMotionValue(0)
  const looseEnd = useMotionValue("M0 0")
  const distance = useTransform(flight, value => `${value * 100}%`)
  const turns = useTransform(flight, value => value * 2.6)
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
      const ex = end.left + end.width * 32 / 1200 - a.left
      const ey = end.top + end.height * 195 / 380 - a.top

      // Three connected beats: roll off the type → soft shoulder contact
      // → a damped rebound → falling into the research-process canvas.
      const stacked = window.matchMedia("(max-width: 1023px)").matches
      const rail = document.documentElement.clientWidth - a.left - 13
      const approach = stacked
        ? `M 0 0 C 18 -6 ${rail} 2 ${rail} 90 C ${rail} ${y * .68} ${rail} ${y - p.height * .34} ${x - 52} ${y - 62} Q ${x - 43} ${y - 32} ${x} ${y}`
        : `M 0 0 C 14 -11 46 0 51 13 C ${x * .42} 7 ${x - 36} ${y - 40} ${x} ${y}`
      const bounce = ` C ${x - 9} ${y - 15} ${x - 29} ${y - 24} ${x - 35} ${y - 15}`
      const gutter = end.left * .38 - a.left
      const entry = end.top - a.top
      const seam = process!.closest("section")!.getBoundingClientRect().top - a.top
      const fall = ` C ${x - 58} ${y + 64} ${gutter} ${seam - 130} ${gutter} ${seam} L ${gutter} ${entry} Q ${gutter} ${ey - 12} ${ex} ${ey}`
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
      path.setAttribute("d", approach + bounce + fall)
      const total = path.getTotalLength()
      path.setAttribute("d", approach)
      const contact = path.getTotalLength() / total
      path.setAttribute("d", approach + bounce)
      const rebound = path.getTotalLength() / total
      if (Number.isFinite(total) && total > 0) {
        setRoute({ d: approach + bounce + fall, contact, rebound })
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
    if (!active || !route || reduced) return
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
      if (value >= 1) anchor.current?.classList.add("flight-landed")
      if (!following) return
      const target = Math.max(startScroll, originY + point.y - innerHeight * .61)
      window.scrollTo({ top: target, behavior: "instant" })
    })
    const controls = animate(
      flight,
      [0, route.contact, route.rebound, 1],
      {
        times: [0, .49, .66, 1],
        duration: 1.9,
        ease: ["easeIn", "easeOut", "easeIn"],
      },
    )
    return () => {
      controls.stop()
      unsubscribe()
      inputs.forEach(event => window.removeEventListener(event, release))
    }
  }, [active, route?.d, reduced, flight])

  return (
    <span ref={anchor} className="spool-origin" aria-hidden="true">
      {route && active && !reduced && (
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
        animate={active && !reduced
          ? { opacity: [1, 1, 1, 1], rotate: [0, 9, -15, -7], scale: [1, 1.02, .94, .84] }
          : { opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: reduced ? 0 : 1.9, times: [0, .49, .66, 1], ease: "easeInOut" }}
      >
        <SpoolIllustration turns={turns} active={!reduced && Boolean(route)} />
      </motion.span>
    </span>
  )
}

/** The continuous thread hooks around the corners of three real case studies. */
export function ProjectThread({ active }: { active: boolean }) {
  const svg = useRef<SVGSVGElement>(null)
  const [route, setRoute] = useState("")
  const progress = useMotionValue(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const layer = svg.current
    const canvas = document.querySelector(".process-canvas")
    const cards = Array.from(document.querySelectorAll<HTMLElement>("#work article")).slice(0, 3)
    if (!layer || !canvas || cards.length < 3) return
    let raf = 0
    function update() {
      const start = canvas!.getBoundingClientRect().bottom
      const end = cards[2].getBoundingClientRect().top + 52
      const distance = Math.max(1, end - start)
      progress.set(reduced ? 1 : Math.max(0, Math.min(1, (innerHeight * .78 - start) / distance)))
    }
    function measure() {
      const origin = layer!.getBoundingClientRect()
      const start = canvas!.getBoundingClientRect()
      const x = start.left - origin.left + start.width * .975
      const y = start.top - origin.top + start.height * 198 / 380
      const rail = Math.min(origin.width - 10, start.right - origin.left + 12)
      let d = `M ${x} ${y} Q ${rail} ${y} ${rail} ${y + 35}`
      for (const card of cards) {
        const rect = card.getBoundingClientRect()
        const edge = rect.right - origin.left
        const top = rect.top - origin.top + 49
        // A small outside-corner loop, not a line through the project image.
        d += ` L ${rail} ${top - 27} C ${rail - 5} ${top - 7} ${edge + 12} ${top - 11} ${edge} ${top} C ${edge + 12} ${top + 12} ${rail - 6} ${top + 12} ${rail} ${top + 40}`
      }
      setRoute(d)
      update()
    }
    function schedule() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    measure()
    const observer = new ResizeObserver(schedule)
    observer.observe(document.body)
    cards.forEach(card => observer.observe(card))
    window.addEventListener("resize", schedule)
    window.addEventListener("scroll", update, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener("resize", schedule)
      window.removeEventListener("scroll", update)
    }
  }, [progress, reduced])

  return (
    <svg ref={svg} aria-hidden="true" className="project-thread">
      {active && route && <>
        <mask id="project-cotton" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="20000">
          <motion.path d={route} fill="none" stroke="white" strokeWidth="9" style={{ pathLength: progress }} />
        </mask>
        <g mask="url(#project-cotton)"><CottonStrip curve={route} /></g>
      </>}
    </svg>
  )
}
const processPath = "M32 195 C42 105 98 245 60 235 S16 85 96 96 S32 300 142 276 S115 105 195 118 S129 291 238 234 S221 123 284 175 S286 253 338 204 S348 158 389 192 S415 217 447 199 S466 175 496 196 C540 204 566 202 595 200 S675 194 745 198 S838 200 918 198 S1045 198 1170 198"
const words = [
  { title: "Noise & uncertainty", sub: "Start with questions", x: "1.5%" },
  { title: "Patterns", sub: "Research & synthesis", x: "27%" },
  { title: "Insights", sub: "Concept & prototype", x: "51%" },
  { title: "Clarity & focus", sub: "Design", x: "79%" },
]

export function ThreadProcess({ active }: { active: boolean }) {
  const canvas = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const reduced = useReducedMotion()
  const positionX = useMotionValue("2.667%")
  const positionY = useMotionValue("51.316%")
  const progress = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: canvas, offset: ["center 61%", "end 26%"] })

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progress.set(reduced ? 1 : active ? value : 0)
    const node = path.current
    if (!node) return
    const total = node.getTotalLength()
    const pos = node.getPointAtLength(total * Math.min(1, Math.max(0, reduced ? 1 : active ? value : 0)))
    positionX.set(`${pos.x / 12}%`)
    positionY.set(`${pos.y / 3.8}%`)
  })

  useEffect(() => {
    const value = reduced ? 1 : active ? scrollYProgress.get() : 0
    progress.set(value)
    const node = path.current
    if (node) {
      const pos = node.getPointAtLength(node.getTotalLength() * value)
      positionX.set(`${pos.x / 12}%`)
      positionY.set(`${pos.y / 3.8}%`)
    }
  }, [active, reduced, progress, scrollYProgress, positionX, positionY])

  return (
    <section id="design-process" aria-labelledby="process-heading" className="thread-process">
      <div className="shell">
        <div className="process-topline">
          <span className="t-eyebrow text-neutral-500">The thread of reason / How I design</span>
          <span className="t-eyebrow text-neutral-500">From complexity to clarity</span>
        </div>
        <div className="process-intro">
          <h2 id="process-heading" className="t-h2 text-neutral-950">Making sense of the <em>mess.</em></h2>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-600">Design rarely starts with a straight line. I explore, connect and refine until the right solution becomes clear.</p>
        </div>
        <div ref={canvas} className="process-canvas" aria-label="An illustration showing a tangled thread gradually becoming a straight line">
          <svg viewBox="0 0 1200 380" preserveAspectRatio="none" className="process-path">
            <path d={processPath} fill="none" stroke="#e7ddd1" strokeWidth="3.8" strokeLinecap="round"/>
            <mask id="process-cotton" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="380">
              <motion.path ref={path} d={processPath} fill="none" stroke="white" strokeWidth="12" style={{ pathLength: progress }} />
            </mask>
            <g mask="url(#process-cotton)"><CottonStrip curve={processPath} width={6} /></g></svg>
          <motion.div className="process-spool" aria-hidden="true"
            style={{ left: positionX, top: positionY, transform: "translate(-50%, -50%)" }}>
            <SpoolIllustration process turns={progress} active={active && !reduced} />
          </motion.div>
          {words.map((word, i) => <div key={word.title} className="process-word" style={{ left: word.x }}>
            <span className="process-number">0{i + 1}</span>
            <strong>{word.title}</strong>
            <small>{word.sub}</small>
          </div>)}
        </div>
        <div className="process-footer"><span>Exploration is part of the process.</span><Link to="home" section="work">See where it leads <span aria-hidden="true">↘</span></Link></div>
      </div>
    </section>
  )
}
