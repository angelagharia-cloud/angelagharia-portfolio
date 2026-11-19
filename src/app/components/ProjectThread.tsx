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

export function ProjectThread({ active }: { active: boolean }) {
  const svg = useRef<SVGSVGElement>(null)
  const [shots, setShots] = useState<Catch[]>([])
  const cursor = useMotionValue(0)
  const release = useMotionValue(0)
  // One material strand crosses the entire process AND all work cards.
  // At the Clarity handoff it replaces the process-only rendering atomically:
  // the existing fibre continues falling, rather than a second fibre appearing.
  const [cotton, setCotton] = useState<ContinuousSpoolThread | null>(null)
  const [handoff, setHandoff] = useState(false)
  const drawn = useMotionValue(0)
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
    let released = false
    let target = 0
    let from = 0
    let arrival = 0
    let geometry: ContinuousSpoolThread | null = null
    let segments: RevealSegment[] = []
    const progressOf = (n: number) => Math.max(0, Math.min(1, n))
    function draw() {
      // Gravity releases the original fibre after Clarity, even if the user
      // momentarily stops scrolling. Scrolling then draws the same yarn
      // through each card.
      const slack = Math.min(110, Math.max(0, arrival - target))
      const travelled = Math.min(arrival, from + slack * release.get()) + (target - from)
      cursor.set(travelled)
      if (geometry) {
        let paidLength = geometry.processLength
        for (const segment of segments) {
          const lead = progressOf((travelled - segment.scrollStart) /
            Math.max(1, segment.scrollArrival - segment.scrollStart))
          const stitch = progressOf((travelled - segment.scrollArrival) /
            Math.max(1, segment.scrollFinish - segment.scrollArrival))
          paidLength = Math.max(paidLength,
            segment.startAt + lead * (segment.leadEnd - segment.startAt) +
              stitch * (segment.stitchedEnd - segment.leadEnd))
        }
        drawn.set(Math.min(1, paidLength / Math.max(1, geometry.length)))
      }
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
      from = (exit?.top ?? (box.top + box.height * 198 / 380)) +
        (trackBottom - box.bottom) - origin
      const distancePastClarity = innerHeight * 0.72 - trackBottom
      const nextReleased = distancePastClarity > 0
      setHandoff(nextReleased && Boolean(geometry))
      if (released !== nextReleased) {
        released = nextReleased
        if (released) {
          animate(release, 1, { duration: .95, ease: "easeInOut" })
        } else {
          // Scrolling back above Clarity must rewind the paid-out fibre
          // completely; do not leave the previous separate leading mask
          // hanging in the whitespace next to the spool.
          release.stop()
          release.set(0)
        }
      }
      if (!released) {
        target = from
        draw()
        return
      }
      const visible = innerHeight * 0.68 - origin
      const first = cards[0]!.getBoundingClientRect().top - origin - 90
      // Meet the first catch at the reading line, after clarity is complete.
      const remaining = Math.max(0, first - visible)
      target = remaining
          ? from +
              ((first - from) * distancePastClarity) /
                (distancePastClarity + remaining)
          : visible
      draw()
    }
    function measure() {
      const origin = layer.getBoundingClientRect(),
        box = canvas.getBoundingClientRect()
      const rail = Math.min(origin.width - 6, box.right - origin.left + 12)
      const exit = canvas.querySelector<HTMLElement>(".process-exit")?.getBoundingClientRect()
      const trackBottom = canvas.parentElement!.getBoundingClientRect().bottom
      // The process line ends at x=1170,y=198 on its SVG. Read its exact
      // responsive DOM anchor instead of conjuring a new string nearby.
      // The same endpoint is used for the connector's first SVG command.
      let px = (exit?.left ?? box.left + box.width * .975) - origin.left,
        py = (exit?.top ?? box.top + box.height * 198 / 380) +
          (trackBottom - box.bottom) - origin.top
      // Capture the process's ACTUAL rendered fibre in the global SVG
      // coordinate system. This includes the mobile squashing and the small
      // end-of-process sag, rather than duplicating a generic new string.
      const processPath = canvas.querySelector<SVGPathElement>("#process-cotton path")
      const matrix = processPath?.getScreenCTM()
      const measured = document.createElementNS("http://www.w3.org/2000/svg", "path")
      const overlayRect = layer.getBoundingClientRect()
      let whole = ""
      if (processPath && matrix) {
        const length = processPath.getTotalLength()
        const count = Math.max(40, Math.ceil(length / 8))
        for (let i = 0; i <= count; i++) {
          const p = processPath.getPointAtLength(length * i / count)
          const at = new DOMPoint(p.x, p.y).matrixTransform(matrix)
          const x = at.x - overlayRect.left
          // The process artwork is sticky until the end of its track.
          // Move its FULL fibre to the final released position, just as
          // the endpoint calculation already does. Otherwise a duplicate
          // squiggle is rendered ~500px above/below the original when the
          // continuous falling path takes over.
          const y = at.y - overlayRect.top + (trackBottom - box.bottom)
          whole += (i === 0 ? "M " : " L ") + x.toFixed(2) + " " + y.toFixed(2)
          if (i === count) { px = x; py = y }
        }
      }
      measured.setAttribute("d", whole || `M ${px} ${py}`)
      const processLength = measured.getTotalLength()
      const boundaries: RevealSegment[] = []
      const result: Catch[] = []
      cards.forEach((card, i) => {
        if (!card) return
        const r = card.getBoundingClientRect()
        const x = r.right - origin.left - 5,
          y = r.top - origin.top + 6
        const inletX = x - 22, inletY = y + 13
        // Let the long free span hang under tension and approach each loop
        // with a tangent. The outer margin keeps it clear of case-study copy.
        const reach = inletY - py
        const sharedRow = i === 2 && r.width < box.width * .75
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
        // The same uninterrupted path starts in Noise & Uncertainty, goes
        // past the anchored Clarity spool, then drops under gravity before
        // sewing through the project cards. No second "M" can start a fibre.
        const lead = path.replace(/^\s*M\s*[-+\d.eE]+[\s,]+[-+\d.eE]+/, "")
        const startAt = measured.getTotalLength()
        whole += " " + lead
        measured.setAttribute("d", whole)
        const leadEnd = measured.getTotalLength()
        whole += ` C ${inletX+12} ${inletY+10}, ${x-22} ${y+28}, ${x+4} ${y+35}`
        measured.setAttribute("d", whole)
        boundaries.push({ startAt, leadEnd, stitchedEnd: measured.getTotalLength(),
          scrollStart:start, scrollArrival:arrival, scrollFinish:arrival+48 })
        result.push({
          inletX,
          inletY,
          card,
          id: projects[i],
          x,
          y,
          path,
          anchorX: px, swingRoom: Math.min(32, Math.max(0, origin.width - rail - 3)),
          start, arrival, finish: arrival + 48,
        })
        px = x + 4
        py = y + 35
      })
      arrival = result[0]?.arrival ?? 0
      geometry = { curve: whole, length: measured.getTotalLength(),
        processLength, maskHeight: Math.max(py, ...result.map(item => item.y)) + 400 }
      segments = boundaries
      setCotton(geometry)
      setShots(result)
      update()
    }
    const unsubscribe = release.on("change", draw)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    cards.forEach((c) => c && ro.observe(c))
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", measure)
    return () => {
      setHandoff(false)
      unsubscribe()
      release.stop()
      release.set(0)
      ro.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", measure)
    }
  }, [active, reduced, cursor, release, drawn])
  return (
    <svg ref={svg} aria-hidden="true" className="project-thread"
      data-continuation="clarity-to-selected-work"
      data-handoff={handoff && Boolean(cotton)}>
      {active && cotton && (
        <>
          <mask id="single-cotton-reveal" maskUnits="userSpaceOnUse"
            x="-100" y="0" width="3000" height={cotton.maskHeight}>
            <motion.path d={cotton.curve} fill="none" stroke="#fff"
              strokeWidth="12" style={{ pathLength: drawn }} />
          </mask>
          <g className="continuous-cotton-fibre" mask="url(#single-cotton-reveal)">
            <CottonStrip curve={cotton.curve} width={3.45} step={10} />
          </g>
        </>
      )}
      {active && shots.map((shot) => (
        <CornerCatch key={shot.id} shot={shot} cursor={cursor} release={release} />
      ))}
    </svg>
  )
}
