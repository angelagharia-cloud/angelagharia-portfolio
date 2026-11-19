import { useEffect, useRef } from "react"
import landing from "../../imports/opt/process-landing.webp"
import loop from "../../imports/opt/landing-loop.webp"

export function Landing({
  active,
  settled,
  reduced,
  finish,
}: {
  active: boolean
  settled: boolean
  reduced: boolean
  finish: () => void
}) {
  const plate = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!active || settled) return
    if (reduced) {
      finish()
      return
    }
    const image = new Image()
    let cancelled = false,
      raf = 0
    image.src = landing
    image
      .decode()
      .then(() => {
        if (cancelled) return
        const start = performance.now()
        function draw(now: number) {
          const frame = Math.min(44, Math.floor((now - start) / 48))
          if (plate.current)
            plate.current.style.backgroundPosition = `${((frame % 8) * 100) / 7}% ${Math.floor(frame / 8) * 20}%`
          if (frame === 44) finish()
          else raf = requestAnimationFrame(draw)
        }
        draw(start)
      })
      .catch(() => {
        if (!cancelled) finish()
      })
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [active, settled, reduced, finish])
  return (
    <div className="cotton-landing" aria-hidden="true">
      <i className="landing-entry" />
      {active &&
        (settled ? (
          <img src={loop} alt="" />
        ) : (
          <div
            className="landing-take"
            ref={plate}
            style={{ backgroundImage: `url(${landing})` }}
          />
        ))}
    </div>
  )
}
