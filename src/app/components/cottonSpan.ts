export type CottonPoint = { x: number; y: number }

// An under-tension strand hangs between two contacts. Both the gravity
// bow and the travelling transverse displacement vanish at the contacts.
export function cottonSpan(points: CottonPoint[], from: CottonPoint, to: CottonPoint, sag: number, impulse = 0, age = 0) {
  const dx = to.x - from.x, dy = to.y - from.y
  const length = Math.max(.01, Math.hypot(dx, dy))
  const count = Math.max(8, Math.ceil(length / 5))
  for (let i = points.length ? 1 : 0; i <= count; i++) {
    const q = i / count
    const delay = age - (1 - q) * .22
    const wave = delay > 0 ? impulse * Math.exp(-6 * delay) * Math.sin(16 * delay) * Math.sin(Math.PI * q) : 0
    points.push({ x: from.x + q * dx - dy / length * wave, y: from.y + q * dy + 4 * q * (1 - q) * sag + dx / length * wave })
  }
}

export function restingCotton(tailX: number, tailY: number, diameter: number) {
  const points: CottonPoint[] = []
  cottonSpan(points, { x:tailX, y:tailY }, { x:-.24 * diameter, y:.20 * diameter }, diameter * .038)
  return points.map(({x,y}, i) => (i ? "L" : "M") + x + " " + y).join(" ")
}
