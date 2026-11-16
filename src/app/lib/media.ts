import dims from "../../imports/opt/manifest.json"

/** Responsive image source with intrinsic dimensions (prevents layout shift). */
export interface Media {
  src: string
  srcSet?: string
  width: number
  height: number
}

export type MediaName = keyof typeof dims

const files = import.meta.glob<string>("../../imports/opt/*.webp", {
  eager: true,
  import: "default",
})

const table = dims as Record<MediaName, number[][]>

const url = (name: string, width: number) => {
  const value = files[`../../imports/opt/${name}-${width}.webp`]
  if (!value) console.warn(`Missing optimised image: ${name}-${width}.webp`)
  return value ?? ""
}

export function media(name: MediaName): Media {
  const sizes = table[name]
  const [width, height] = sizes[sizes.length - 1]
  return {
    src: url(name, width),
    srcSet:
      sizes.length > 1
        ? sizes.map(([w]) => `${url(name, w)} ${w}w`).join(", ")
        : undefined,
    width,
    height,
  }
}
