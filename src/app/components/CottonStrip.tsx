import { useLayoutEffect, useRef } from "react"
import type { MotionValue } from "motion/react"
import cotton from "../../imports/opt/cotton-fibre.webp"

const ns = "http://www.w3.org/2000/svg"

// Turn the photographed material with the local tangent of the cotton.
export function CottonStrip({ curve, width = 4, step = 6 }: { curve: string | MotionValue<string>; width?: number; step?: number }) {
  const group = useRef<SVGGElement>(null)
  useLayoutEffect(() => {
    const layer = group.current!
    const path = document.createElementNS(ns, "path")
    function paint(d: string) {
      path.setAttribute("d", d || "M0 0")
      const length = path.getTotalLength()
      const count = Math.ceil(length / step)
      let a = path.getPointAtLength(0)
      for (let i = 0; i < count; i++) {
        const b = path.getPointAtLength(Math.min(length, (i + 1) * step))
        let tile = layer.children[i] as SVGSVGElement | undefined
        if (!tile) {
          tile = document.createElementNS(ns, "svg")
          const image = document.createElementNS(ns, "image")
          image.setAttribute("width", "256")
          image.setAttribute("height", "64")
          tile.appendChild(image)
          tile.setAttribute("viewBox", `${i % 4 * 64} 0 64 64`)
          image.setAttribute("href", cotton)
          tile.setAttribute("preserveAspectRatio", "none")
          tile.setAttribute("height", String(width))
          tile.setAttribute("y", String(-width / 2))
          layer.appendChild(tile)
        }
        const dx = b.x - a.x, dy = b.y - a.y
        tile.setAttribute("width", String(Math.hypot(dx, dy) + .45))
        tile.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${Math.atan2(dy, dx) * 180 / Math.PI})`)
        a = b
      }
      while (layer.children.length > count) layer.lastChild!.remove()
    }
    paint(typeof curve === "string" ? curve : curve.get())
    if (typeof curve !== "string") return curve.on("change", paint)
  }, [curve, width, step])
  return <g ref={group} aria-hidden="true" />
}
