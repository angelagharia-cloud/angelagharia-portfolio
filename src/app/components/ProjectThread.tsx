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
  const opacity = useTransform(frame, (n) => Math.min(1, n))
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
        <CottonStrip curve={path} step={16} />
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
      <g mask={`url(#behind-edge-${id})`}>
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
      </g>
    </>
  )
}

export function ProjectThread({ active }: { active: boolean }) {
  const svg = useRef<SVGSVGElement>(null)
  const [shots, setShots] = useState<Catch[]>([])
  const cursor = useMotionValue(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!active) return
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
      const from = box.top + (box.height * 198) / 380 - origin
      const distancePastClarity = innerHeight * 0.26 - box.bottom
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
        py = box.top - origin.top + (box.height * 198) / 380
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
        const path = `M ${px} ${py}
          C ${px + (rail - px) * .8} ${py + 5}, ${rail} ${py + reach * .12}, ${rail} ${py + reach * .35}
          S ${rail + 3} ${inletY - 44}, ${inletX} ${inletY}`
        result.push({
          id: projects[i],
          x,
          y,
          width,
          angle,
          path,
          start: py,
          arrival: inletY,
        })
        px = x + 5
        py = y + 16
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
  }, [active, reduced, cursor])
  return (
    <svg ref={svg} aria-hidden="true" className="project-thread">
      {active &&
        shots.map((shot) => (
          <CornerCatch key={shot.id} shot={shot} cursor={cursor} />
        ))}
    </svg>
  )
}
