import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react"
import "./thread-journey.css"

/**
 * An original illustration, not a pre-rendered video: the spool and the string
 * move together in response to scrolling. Motion is progressive enhancement.
 */
export function SpoolIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 105" role="img" aria-label="A roll of natural cotton string">
      <defs>
        <linearGradient id="cottonBody" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f7ead3" />
          <stop offset=".32" stopColor="#d8c3a3" />
          <stop offset=".68" stopColor="#c1a581" />
          <stop offset="1" stopColor="#9d805f" />
        </linearGradient>
        <radialGradient id="cottonFace">
          <stop stopColor="#f4e9d5" />
          <stop offset=".72" stopColor="#d7bd9a" />
          <stop offset="1" stopColor="#987858" />
        </radialGradient>
        <filter id="spoolShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <ellipse cx="62" cy="93" rx="43" ry="7" fill="#67513d" opacity=".14" filter="url(#spoolShadow)" />
      <g transform="rotate(-18 60 48)">
        <path d="M28 25 Q58 15 95 27 L95 75 Q58 85 28 75 Z" fill="url(#cottonBody)" stroke="#ad9271" strokeWidth="1.4" />
        {Array.from({ length: 18 }, (_, index) => {
          const y = 26 + index * 2.75
          return <path key={index} d={`M29 ${y} Q60 ${y - 9} 94 ${y}`} fill="none" stroke={index % 3 === 0 ? "#ad906e" : "#f7ecd9"} strokeWidth={index % 3 === 0 ? 1.2 : .85} opacity=".86" />
        })}
        <ellipse cx="28" cy="50" rx="14" ry="27" fill="#d1b794" stroke="#a88965" strokeWidth="1.5" />
        <ellipse cx="95" cy="51" rx="15" ry="27" fill="url(#cottonFace)" stroke="#9d805e" strokeWidth="1.7" />
        <ellipse cx="95" cy="51" rx="6" ry="12" fill="#756048" stroke="#d6bd9b" strokeWidth="2" />
        <ellipse cx="96" cy="50" rx="2.4" ry="6" fill="#493b30" />
        <path d="M22 29 Q16 50 22 70" fill="none" stroke="#f7ebda" strokeWidth="2" opacity=".6" />
      </g>
    </svg>
  )
}

export function HeroSpool({ active }: { active: boolean }) {
  const reducedMotion = useReducedMotion()
  return (
    <div className="hero-spool" aria-hidden="true">
      <svg className="hero-thread-tail" viewBox="0 0 210 270" preserveAspectRatio="none">
        <motion.path
          d="M27 4 C12 48 112 61 70 110 S18 162 83 180 S135 209 117 241"
          fill="none" stroke="#a99072" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 1.1, ease: "easeInOut" }}
        />
      </svg>
      <motion.div
        className="hero-spool-object"
        initial={false}
        animate={active && !reducedMotion
          ? { x: [0, 15, 56, 90], y: [0, 52, 118, 237], rotate: [0, 95, 270, 650], scale: [1, 1.05, .95, .9], opacity: [1, 1, 1, 0] }
          : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 1.15, times: [0, .28, .64, 1], ease: "easeInOut" }}
      >
        <SpoolIllustration />
      </motion.div>
    </div>
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
  const section = useRef<HTMLElement>(null)
  const path = useRef<SVGPathElement>(null)
  const reduced = useReducedMotion()
  const [point, setPoint] = useState({ x: 32, y: 195, angle: 0 })
  const progress = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ["start 86%", "end 38%"] })

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progress.set(reduced ? 1 : active ? value : 0)
    const node = path.current
    if (!node) return
    const total = node.getTotalLength()
    const pos = node.getPointAtLength(total * Math.min(1, Math.max(0, reduced ? 1 : active ? value : 0)))
    setPoint({ x: pos.x, y: pos.y, angle: (active ? value : 0) * 960 })
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
            style={{ left: `${point.x / 1200 * 100}%`, top: `${point.y / 380 * 100}%`, transform: `translate(-50%, -50%) rotate(${point.angle}deg)` }}>
            <SpoolIllustration />
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
