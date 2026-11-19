export type TypeRail = { heights: number[]; distance: number }

// Lower silhouette sampled at seventeen columns of the keyed Seedance spool.
// Heights and offsets are fractions of the displayed spindle width.
const bottom = [.172,.275,.341,.366,.366,.353,.338,.319,.303,.287,.272,.256,.241,.225,.209,.194,.172]

export function measureTypeRail(word: HTMLElement, origin: HTMLElement, diameter: number): TypeRail | null {
  const text = word.querySelector<HTMLElement>(".italic")
  const marker = text?.querySelector(".type-baseline")
  if (!text || !marker) return null
  const box = text.getBoundingClientRect()
  const style = getComputedStyle(text)
  const canvas = document.createElement("canvas")
  canvas.width = Math.ceil(box.width + diameter)
  canvas.height = Math.ceil(box.height * 1.5)
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return null
  const baseline = marker.getBoundingClientRect().top - box.top
  ctx.font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(" ")
  // Browser ranges include the actual kerning, italic bearings and tracking.
  const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  while (walker.nextNode()) {
    const node = walker.currentNode
    const value = node.textContent ?? ""
    for (let i = 0; i < value.length; i++) {
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      ctx.fillText(value[i], range.getBoundingClientRect().left - box.left, baseline)
    }
  }
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const ink = new Float32Array(canvas.width).fill(Infinity)
  let lip = 0
  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      if (data[(y * canvas.width + x) * 4 + 3] < 80) continue
      ink[x] = y
      lip = x
      break
    }
  }
  const start = origin.getBoundingClientRect().left - box.left
  const distance = lip - start
  if (distance < 2) return null
  const heights: number[] = []
  for (let i = 0; i <= 48; i++) {
    const centre = start + distance * i / 48
    let contact = Infinity
    for (let j = 0; j < bottom.length; j++) {
      const x = Math.round(centre + (j - 8) * 17 / 320 * diameter)
      contact = Math.min(contact, (ink[x] ?? Infinity) - bottom[j] * diameter)
    }
    heights.push(Number.isFinite(contact) ? contact : heights[i-1] ?? 0)
  }
  return { heights, distance }
}
