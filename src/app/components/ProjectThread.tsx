import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"
import { CottonStrip } from "./CottonStrip"
import tieAtlas from "../../imports/opt/card-tie.webp"

const projects = ["creative-key", "gravitad", "stammer-halo"]
type Catch = {
  id: string
  x: number
  y: number
  width: number
  inletX: number
  inletY: number
  card: HTMLElement
  angle: number
  path: string
  start: number
  arrival: number
}

function CornerCatch({
  shot,
  cursor,
}: {
  shot: Catch
  cursor: MotionValue<number>
}) {
  const { id, x, y, width, path, start, arrival } = shot
  const line = useTransform(cursor, [start, arrival], [0, 1])
  const frame = useTransform(cursor, [arrival, y + 48], [0, 47])
  const position = useTransform(frame, (n) => {
    const i = Math.round(n)
    return `${((i % 8) * 100) / 7}% ${Math.floor(i / 8) * 20}%`
  })
  const wrap = useTransform(frame, [22, 44], [0, 1])
  const opacity = useTransform(frame, (n) => Math.min(1, n))
  const tension = useTransform(frame, [0, 12, 33, 42, 47], [0, 0, .76, 1, .87])
  const pullX = useTransform(tension, n => -6 * n)
  const pullY = useTransform(tension, n => 5 * n)
  const radians = shot.angle * Math.PI / 180
  const wrapPath = useTransform(tension, load => {
    // The filmed loop returns to pixel (198,86) of its 384 × 288 cell.
    // Lead the same fibre around the fold and out along the right edge.
    const knotX = x + width * (-.004 * Math.cos(radians) + .076 * Math.sin(radians)) - 6 * load
    const knotY = y + width * (-.004 * Math.sin(radians) - .076 * Math.cos(radians)) + 5 * load
    return `M ${knotX} ${knotY} C ${knotX-2} ${knotY+8}, ${x+1-8*load} ${y+14}, ${x+4} ${y+35}`
  })
  const tipX = useTransform(pullX, dx => shot.inletX + dx)
  const tipY = useTransform(pullY, dy => shot.inletY + dy)
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
      <g mask={`url(#catch-line-${id})`}>
        <CottonStrip curve={path} width={3.2} step={12} />
      </g>
      <mask
        id={`behind-edge-${id}`}
        maskUnits="userSpaceOnUse"
        x={x - width}
        y={y - width}
        width={width * 2}
        height={width * 2}
      >
        <rect
          x={x - width}
          y={y - width}
          width={width * 2}
          height={width * 2}
          fill="white"
        />
        <ellipse cx={x - 2} cy={y + 2} rx="3" ry="1.75" fill="black" />
      </mask>
      <mask id={`corner-wrap-${id}`} maskUnits="userSpaceOnUse" x={x-50} y={y-50} width="110" height="110">
        <motion.path d={wrapPath} fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" style={{ pathLength: wrap }} />
      </mask>
      <motion.g mask={`url(#corner-wrap-${id})`} style={{ opacity:wrap }}>
        <CottonStrip curve={wrapPath} width={3.2} step={3} />
      </motion.g>
      <motion.line x1={shot.inletX} y1={shot.inletY} x2={tipX} y2={tipY} stroke="#ac987c" strokeWidth="1.5" strokeLinecap="round" style={{ opacity }} />
      <motion.g style={{ x: pullX, y: pullY }} mask={`url(#behind-edge-${id})`}>
        <g transform={`translate(${x} ${y}) rotate(${shot.angle})`}>
          <foreignObject
            x={-width * 0.52}
            y={-width * 0.75 * 0.4}
            width={width}
            height={width * 0.75}
          >
            <motion.div
              className="corner-take"
              data-project={id}
              style={{
                opacity,
                backgroundImage: `url(${tieAtlas})`,
                backgroundPosition: position,
              }}
            />
          </foreignObject>
        </g>
      </motion.g>
    </>
  )
}

export function ProjectThread({ active }: { active: boolean }) {
  const svg = useRef<SVGSVGElement>(null)
  const [shots, setShots] = useState<Catch[]>([])
  const [nearWork, setNearWork] = useState(false)
  const cursor = useMotionValue(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!active || nearWork) return
    const work = document.getElementById("work")
    if (!work) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setNearWork(true)
    }, {rootMargin:"100% 0px"})
    observer.observe(work)
    return () => observer.disconnect()
  }, [active, nearWork])
  useEffect(() => {
    if (!active || !nearWork) return
    const canvas = document.querySelector<HTMLElement>(".process-canvas")!
    const cards = projects.map((id) =>
      document
        .querySelector(`#work article a[href="#/${id}"]`)
        ?.closest("article"),
    )
    const layer = svg.current!
    function update() {
      if (reduced) {
        cursor.set(Number.MAX_SAFE_INTEGER)
        return
      }
      const origin = layer.getBoundingClientRect().top
      const box = canvas.getBoundingClientRect()
      const trackBottom = canvas.parentElement!.getBoundingClientRect().bottom
      const from = trackBottom - box.height + (box.height * 198) / 380 - origin
      const distancePastClarity = innerHeight * 0.72 - trackBottom
      if (distancePastClarity <= 0) {
        cursor.set(from)
        return
      }
      const visible = innerHeight * 0.68 - origin
      const first = cards[0]!.getBoundingClientRect().top - origin - 90
      // Meet the first catch at the reading line, after clarity is complete.
      const remaining = Math.max(0, first - visible)
      cursor.set(
        remaining
          ? from +
              ((first - from) * distancePastClarity) /
                (distancePastClarity + remaining)
          : visible,
      )
    }
    function measure() {
      const origin = layer.getBoundingClientRect(),
        box = canvas.getBoundingClientRect()
      const rail = Math.min(origin.width - 6, box.right - origin.left + 12)
      let px = box.left - origin.left + box.width * 0.975,
        py = canvas.parentElement!.getBoundingClientRect().bottom - box.height - origin.top + (box.height * 198) / 380
      const result: Catch[] = []
      cards.forEach((card, i) => {
        if (!card) return
        const r = card.getBoundingClientRect(),
          width = Math.min(170, origin.width * 0.3)
        const x = r.right - origin.left - 5,
          y = r.top - origin.top + 6
        const angle = i === 2 && r.width < box.width * 0.75 ? 30 : -90
        const radians = (angle * Math.PI) / 180
        const inletX =
            x + width * (0.38 * Math.cos(radians) + 0.3 * Math.sin(radians)),
          inletY =
            y + width * (0.38 * Math.sin(radians) - 0.3 * Math.cos(radians))
        // Let the long free span hang under tension and approach each loop
        // with a tangent. The outer margin keeps it clear of case-study copy.
        const reach = inletY - py
        const sharedRow = angle === 30
        const gutterY = y - 22
        const path = sharedRow
          ? `M ${px} ${py} Q ${rail} ${py+10} ${rail} ${py+30} L ${rail} ${gutterY-15}
             Q ${rail} ${gutterY} ${rail-24} ${gutterY} C ${rail-80} ${gutterY} ${inletX+32} ${gutterY-4} ${inletX} ${inletY}`
          : `M ${px} ${py}
          C ${px + (rail - px) * .8} ${py + 5}, ${rail} ${py + reach * .12}, ${rail} ${py + reach * .35}
          S ${rail + 3} ${inletY - 44}, ${inletX} ${inletY}`
        result.push({
          inletX,
          inletY,
          card,
          id: projects[i],
          x,
          y,
          width,
          angle,
          path,
          start: py,
          arrival: inletY,
        })
        px = x + 4
        py = y + 35
      })
      setShots(result)
      update()
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    cards.forEach((c) => c && ro.observe(c))
    window.addEventListener("scroll", update, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", update)
    }
  }, [active, nearWork, reduced, cursor])
  return (
    <svg ref={svg} aria-hidden="true" className="project-thread">
      {active &&
        shots.map((shot) => (
          <CornerCatch key={shot.id} shot={shot} cursor={cursor} />
        ))}
    </svg>
  )
}
