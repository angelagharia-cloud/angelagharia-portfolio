import { useId, useLayoutEffect, useRef } from "react"
import type { MotionValue } from "motion/react"
import cotton from "../../imports/opt/cotton-fibre.webp"

const ns = "http://www.w3.org/2000/svg"

export function CottonStrip({ curve, width = 4, step = 6, screenWidth = false }: { curve: string | MotionValue<string>; width?: number; step?: number; screenWidth?: boolean }) {
  const group = useRef<SVGGElement>(null)
  const pattern = useId()
  useLayoutEffect(() => {
    const layer = group.current!
    const path = document.createElementNS(ns, "path")
    function paint(d: string) {
      path.setAttribute("d", d || "M0 0")
      const length = path.getTotalLength()
      const matrix = screenWidth ? layer.getScreenCTM() : null
      const count = Math.ceil(length / step)
      let a = path.getPointAtLength(0)
      let arc = 0
      for (let i = 0; i < count; i++) {
        const b = path.getPointAtLength(Math.min(length, (i + 1) * step))
        const dx = b.x - a.x, dy = b.y - a.y
        const chord = Math.hypot(dx, dy)
        const along = matrix && chord ? Math.hypot(matrix.a*dx + matrix.c*dy, matrix.b*dx + matrix.d*dy) / chord : 1
        const across = matrix ? Math.abs(matrix.a*matrix.d - matrix.b*matrix.c) / along : 1
        if (!along || !across) continue
        const sx = width / (64 * along), sy = width / (64 * across)
        let tile = layer.children[i] as SVGRectElement | undefined
        if (!tile) {
          tile = document.createElementNS(ns, "rect")
          tile.setAttribute("height", "64")
          layer.appendChild(tile)
        }
        // Keep the material coordinate continuous across the curved strip.
        const phase = (arc * 64 / width) % 256
        tile.setAttribute("x", String(phase))
        tile.setAttribute("width", String((chord + .32 / along) / sx))
        tile.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${Math.atan2(dy, dx) * 180 / Math.PI}) scale(${sx} ${sy}) translate(${-phase} -32)`)
        arc += chord * along
        a = b
      }
      while (layer.children.length > count) layer.lastChild!.remove()
    }
    const repaint = () => paint(typeof curve === "string" ? curve : curve.get())
    repaint()
    const unsubscribe = typeof curve === "string" ? undefined : curve.on("change", paint)
    const observer = screenWidth ? new ResizeObserver(repaint) : null
    if (observer && layer.ownerSVGElement) observer.observe(layer.ownerSVGElement)
    return () => { observer?.disconnect(); unsubscribe?.() }
  }, [curve, width, step, screenWidth])
  return <g aria-hidden="true">
    <defs><pattern id={pattern} patternUnits="userSpaceOnUse" width="256" height="64">
      <image href={cotton} width="256" height="64" />
    </pattern></defs>
    <g ref={group} fill={`url(#${pattern})`} />
  </g>
}
