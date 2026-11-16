import type { ImgHTMLAttributes } from "react"
import type { Media } from "../../lib/media"

interface ImgProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "src" | "srcSet" | "width" | "height"
  > {
  media: Media
  alt: string
  /** Above-the-fold images load eagerly with high fetch priority. */
  priority?: boolean
}

export function Img({
  media,
  alt,
  sizes = "100vw",
  priority = false,
  ...rest
}: ImgProps) {
  return (
    <img
      src={media.src}
      srcSet={media.srcSet}
      sizes={media.srcSet ? sizes : undefined}
      width={media.width}
      height={media.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "auto" : "async"}
      {...(priority ? { fetchpriority: "high" } : {})}
      {...rest}
    />
  )
}
