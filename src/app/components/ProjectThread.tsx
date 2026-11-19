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
import spoolAtlas from "../../assets/cotton-studio.webp"
import smallSpoolAtlas from "../../assets/cotton-studio-small.webp"

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
  finish: number
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
  const frame = useTransform(cursor, [arrival, shot.finish], [0, 47])
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
  const traveller = useRef<SVGForeignObjectElement>(null)
  const [shots, setShots] = useState<Catch[]>([])
  const shotRef = useRef<Catch[]>([])
  const [spoolSize, setSpoolSize] = useState(88)
  const cursor = useMotionValue(0)
  const spoolX = useMotionValue(0)
  const spoolY = useMotionValue(0)
  const spoolOpacity = useMotionValue(0)
  const spoolFrame = useMotionValue("100% 100%")
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
    const spool = canvas.querySelector<HTMLElement>(".process-spool")!
    const moving = traveller.current!
    const sprite = moving.firstElementChild as HTMLElement
    let spans: { shot: Catch, guide: SVGPathElement, length: number }[] = []
    function follow() {
      const value = cursor.get()
      const away = !reduced && spans.length > 0 && value > spans[0].shot.start
      moving.style.visibility = away ? "visible" : "hidden"
      spool.style.visibility = away ? "hidden" : ""
      if (!away) return
      const span = spans.find(({shot}) => value < shot.finish) ?? spans[spans.length - 1]
      const {shot, guide, length} = span
      const fraction = Math.max(0, Math.min(1, (value - shot.start) / (shot.arrival - shot.start)))
      const tip = guide.getPointAtLength(length * fraction)
      const wrap = Math.max(0, Math.min(1, (value - shot.arrival) / (shot.finish - shot.arrival)))
      const x = tip.x + (shot.x + 4 - tip.x) * wrap
      const y = tip.y + (shot.y + 35 - tip.y) * wrap
      moving.setAttribute("x", String(x - spool.offsetWidth / 2))
      moving.setAttribute("y", String(y - spool.offsetHeight / 2))
      sprite.style.backgroundPosition = getComputedStyle(spool).backgroundPosition
      sprite.style.transform = "rotate(" + Math.min(value - spans[0].shot.start, 90) * .4 + "deg)"
    }
    function update() {
      if (reduced) {
        cursor.set(Number.MAX_SAFE_INTEGER)
        return
      }
      const origin = layer.getBoundingClientRect().top
      const box = canvas.getBoundingClientRect()
      const trackBottom = canvas.parentElement!.getBoundingClientRect().bottom
      const exit = canvas.querySelector<HTMLElement>(".process-exit")?.getBoundingClientRect()
      // When the process canvas is sticky, project its endpoint to the
      // *released* position at the end of the scroll track, not today's frame.
      const from = (exit?.top ?? (box.top + box.height * 198 / 380)) +
        (trackBottom - box.bottom) - origin
      const distancePastClarity = innerHeight * 0.72 - trackBottom
      if (distancePastClarity <= 0) {
        cursor.set(spans[0]?.shot.start ?? from)
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
      const rail = Math.min(origin.width - spool.offsetWidth / 2, box.right - origin.left + 12)
      const exit = canvas.querySelector<HTMLElement>(".process-exit")?.getBoundingClientRect()
      const trackBottom = canvas.parentElement!.getBoundingClientRect().bottom
      // The process line ends at x=1170,y=198 on its SVG. Read its exact
      // responsive DOM anchor instead of conjuring a new string nearby.
      // The same endpoint is used for the connector's first SVG command.
      let px = (exit?.left ?? box.left + box.width * .975) - origin.left,
        py = (exit?.top ?? box.top + box.height * 198 / 380) +
          (trackBottom - box.bottom) - origin.top
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
        const path = i === 0
          // One continuous falling strand, beginning exactly where Clarity
          // finishes. It first carries the horizontal tangent of the final
          // process segment, then gravity takes the string down into the
          // first card. No separate string enters from the page gutter.
          ? `M ${px} ${py}
             C ${px + Math.min(46, Math.max(8, (rail - px) * .55))} ${py},
               ${rail} ${py + Math.min(28, reach * .09)},
               ${rail} ${py + Math.min(90, reach * .2)}
             C ${rail} ${py + reach * .53},
               ${rail} ${inletY - Math.min(56, reach * .12)},
               ${inletX} ${inletY}`
          : sharedRow
          ? `M ${px} ${py} Q ${rail} ${py+10} ${rail} ${py+30} L ${rail} ${gutterY-15}
             Q ${rail} ${gutterY} ${rail-24} ${gutterY} C ${rail-80} ${gutterY} ${inletX+32} ${gutterY-4} ${inletX} ${inletY}`
          : `M ${px} ${py}
          C ${px + (rail - px) * .8} ${py + 5}, ${rail} ${py + reach * .12}, ${rail} ${py + reach * .35}
          S ${rail + 3} ${inletY - 44}, ${inletX} ${inletY}`
        const start = result[result.length - 1]?.finish ?? py
        const arrival = Math.max(start + 90, inletY)
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
          start, arrival, finish: arrival + 48,
        })
        px = x + 4
        py = y + 35
      })
      moving.setAttribute("width", String(spool.offsetWidth))
      moving.setAttribute("height", String(spool.offsetHeight))
      sprite.style.backgroundImage = getComputedStyle(spool).backgroundImage
      spans = result.map(shot => {
        const guide = document.createElementNS("http://www.w3.org/2000/svg", "path")
        guide.setAttribute("d", shot.path)
        return {shot, guide, length: guide.getTotalLength()}
      })
      setShots(result)
      update()
    }
    const unsubscribe = cursor.on("change", follow)
    measure()
    follow()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    cards.forEach((c) => c && ro.observe(c))
    window.addEventListener("scroll", update, { passive: true })
    return () => {
      unsubscribe()
      spool.style.visibility = ""
      moving.style.visibility = "hidden"
      ro.disconnect()
      window.removeEventListener("scroll", update)
    }
  }, [active, reduced, cursor, spoolX, spoolY, spoolOpacity, spoolFrame])
  return (
    <svg ref={svg} aria-hidden="true" className="project-thread" data-continuation="clarity-to-selected-work">
      {active &&
        shots.map((shot) => (
          <CornerCatch key={shot.id} shot={shot} cursor={cursor} />
        ))}
      <foreignObject ref={traveller} className="work-spool"><div /></foreignObject>
    </svg>
  )
}
