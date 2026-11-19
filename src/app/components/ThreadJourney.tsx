import { useEffect, useRef, useState } from "react"
import { animate, type MotionValue, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react"
import "./thread-journey.css"

import spoolPoster from "../../assets/cotton-poster.webp"
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
      const index = Math.floor(((turn % 1 + 1) % 1) * frameCount)
      const col = index % columns
      const row = Math.floor(index / columns)
      target!.style.backgroundPosition = `${col * 100 / (columns - 1)}% ${row * 100 / (frameCount / columns - 1)}%`
    }
    image.src = spoolFrames
    image.decode().then(() => {
      if (cancelled) return
      target.style.backgroundImage = `url("${spoolFrames}")`
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
export function HeroSpool({ active }: { active: boolean }) {
  const anchor = useRef<HTMLSpanElement>(null)
  const [route, setRoute] = useState("")
  const turns = useMotionValue(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!active || reduced) return
    const controls = animate(turns, 1, { duration: 1.65, ease: "linear" })
    return () => controls.stop()
  }, [active, reduced, turns])
  useEffect(() => {
    const origin = anchor.current
    const portrait = document.querySelector("#portrait-stage img")
    const process = document.querySelector(".process-canvas")
    if (!origin || !portrait || !process) return
    function measure() {
      const a = origin!.getBoundingClientRect()
      const p = portrait!.getBoundingClientRect()
      const end = process!.getBoundingClientRect()
      const x = p.left + p.width * .29 - a.left
      const y = p.top + p.height * .38 - a.top
      const ex = end.left + end.width * 32 / 1200 - a.left
      const ey = end.top + end.height * 195 / 380 - a.top
      setRoute(`M 0 0 Q 18 -2 32 4 Q ${(32+x)/2} 7 ${x} ${y} Q ${x+22} ${y-54} ${x+38} ${y-17} C ${x+74} ${y+85} ${ex} ${ey-108} ${ex} ${ey}`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(portrait)
    observer.observe(process)
    observer.observe(document.body)
    return () => observer.disconnect()
  }, [])
  return <span ref={anchor} className="spool-origin" aria-hidden="true">
    {route && active && <svg className="flight-thread"><motion.path d={route} fill="none" stroke="#ab9272" strokeWidth="1.5" initial={{pathLength: reduced ? 1 : 0}} animate={{pathLength:1}} transition={{duration:reduced ? 0 : 1.65, ease:"linear"}} /></svg>}
    <motion.span className="flight-spool" style={{offsetPath: route ? `path("${route}")` : undefined, offsetRotate:"0deg"}} initial={false}
      animate={{offsetDistance:active && !reduced ? "100%" : "0%", opacity:active ? [1,1,0] : 1}}
      transition={{offsetDistance:{duration:1.65,ease:"linear"},opacity:{duration:reduced ? 0 : 1.65,times:[0,.98,1]}}}>
      <SpoolIllustration turns={turns} active={!reduced && Boolean(route)} />
    </motion.span>
  </span>
}

export function ProjectThread({active}:{active:boolean}) {
  const svg = useRef<SVGSVGElement>(null)
  const [route,setRoute] = useState("")
  const work = useRef<HTMLElement | null>(null)
  const progress = useMotionValue(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    const layer = svg.current
    const canvas = document.querySelector(".process-canvas")
    work.current = document.getElementById("work")
    const cards = work.current?.querySelectorAll("article")
    if (!layer || !canvas || !cards?.length) return
    function measure() {
      const origin = layer!.getBoundingClientRect()
      const start = canvas!.getBoundingClientRect()
      const x = start.left-origin.left+start.width*.975
      const y = start.top-origin.top+start.height*198/380
      const rail = Math.min(origin.width-5,start.right-origin.left+12)
      let d = `M${x} ${y} Q${rail} ${y} ${rail} ${y+35}`
      for (const card of Array.from(cards!).slice(0,2)) {
        const rect = card.getBoundingClientRect()
        const edge = rect.right-origin.left
        const top = rect.top-origin.top+42
        d += ` V${top-12} Q${rail} ${top} ${edge} ${top} Q${rail} ${top} ${rail} ${top+12}`
      }
      setRoute(d)
      update()
    }
    function update() {
      const a=canvas!.getBoundingClientRect().bottom
      const b=cards![1].getBoundingClientRect().top+54
      progress.set(reduced ? 1 : Math.max(0,Math.min(1,(innerHeight*.8-a)/Math.max(1,b-a))))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    window.addEventListener("scroll",update,{passive:true})
    return () => { observer.disconnect(); window.removeEventListener("scroll",update) }
  },[progress,reduced])
  return <svg ref={svg} aria-hidden="true" className="project-thread">{active && <motion.path d={route} fill="none" stroke="#766955" strokeWidth="1.5" style={{pathLength:progress}}/>}</svg>
}
const processPath = "M32 195 C42 105 98 245 60 235 S16 85 96 96 S32 300 142 276 S115 105 195 118 S129 291 238 234 S221 123 284 175 S286 253 338 204 S348 158 389 192 S415 217 447 199 S466 175 496 196 C540 204 566 202 595 200 S675 194 745 198 S838 200 918 198 S1045 198 1170 198"
const words = [
  { title: "Noise & uncertainty", sub: "Start with questions", x: "1.5%" },
  { title: "Patterns", sub: "Research & synthesis", x: "27%" },
  { title: "Insights", sub: "Concept & prototype", x: "51%" },
  { title: "Clarity & focus", sub: "Design", x: "79%" },
]

export function ThreadProcess({ active }: { active: boolean }) {
  const section = useRef<HTMLElement>(null)
  const path = useRef<SVGPathElement>(null)
  const reduced = useReducedMotion()
  const [point, setPoint] = useState({ x: 32, y: 195 })
  const progress = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ["start 86%", "end 38%"] })

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progress.set(reduced ? 1 : active ? value : 0)
    const node = path.current
    if (!node) return
    const total = node.getTotalLength()
    const pos = node.getPointAtLength(total * Math.min(1, Math.max(0, reduced ? 1 : active ? value : 0)))
    setPoint({ x: pos.x, y: pos.y })
  })

  useEffect(() => {
    progress.set(reduced ? 1 : active ? scrollYProgress.get() : 0)
  }, [active, reduced, progress, scrollYProgress])

  return (
    <section ref={section} id="design-process" aria-labelledby="process-heading" className="thread-process">
      <div className="shell">
        <div className="process-topline">
          <span className="t-eyebrow text-neutral-500">The thread of reason / How I design</span>
          <span className="t-eyebrow text-neutral-500">From complexity to clarity</span>
        </div>
        <div className="process-intro">
          <h2 id="process-heading" className="t-h2 text-neutral-950">Making sense of the <em>mess.</em></h2>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-600">Design rarely starts with a straight line. I explore, connect and refine until the right solution becomes clear.</p>
        </div>
        <div className="process-canvas" aria-label="An illustration showing a tangled thread gradually becoming a straight line">
          <svg viewBox="0 0 1200 380" preserveAspectRatio="none" className="process-path">
            <path d={processPath} fill="none" stroke="#e7ddd1" strokeWidth="3.8" strokeLinecap="round"/>
            <motion.path ref={path} d={processPath} fill="none" stroke="#9a8065" strokeWidth="3.4"
              strokeLinecap="round" style={{ pathLength: progress }} />
          </svg>
          <div className="process-spool" aria-hidden="true"
            style={{ left: `${point.x / 1200 * 100}%`, top: `${point.y / 380 * 100}%`, transform: "translate(-50%, -50%)" }}>
            <SpoolIllustration turns={progress} active={active && !reduced} />
          </div>
          {words.map((word, i) => <div key={word.title} className="process-word" style={{ left: word.x }}>
            <span className="process-number">0{i + 1}</span>
            <strong>{word.title}</strong>
            <small>{word.sub}</small>
          </div>)}
        </div>
        <div className="process-footer"><span>Exploration is part of the process.</span><a href="#work">See where it leads <span aria-hidden="true">↘</span></a></div>
      </div>
    </section>
  )
}
