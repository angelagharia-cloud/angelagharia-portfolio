import { useState, type ReactNode } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Maximize2, X } from "lucide-react"
import type { Media } from "../../lib/media"
import { Img } from "./Img"

interface FigureProps {
  media: Media
  alt: string
  caption?: ReactNode
  sizes?: string
  /** Open the image in an accessible lightbox. On by default for detailed work. */
  zoom?: boolean
  priority?: boolean
  className?: string
  frameClassName?: string
  imgClassName?: string
  captionClassName?: string
}

export function Figure({
  media,
  alt,
  caption,
  sizes,
  zoom = true,
  priority,
  className = "",
  frameClassName = "",
  imgClassName = "block h-auto w-full",
  captionClassName = "text-neutral-500",
}: FigureProps) {
  const image = (
    <Img
      media={media}
      alt={alt}
      sizes={sizes}
      priority={priority}
      className={imgClassName}
    />
  )

  return (
    <figure className={className}>
      <div className={`relative overflow-hidden ${frameClassName}`}>
        {zoom ? (
          <Lightbox media={media} alt={alt} caption={caption}>
            <button
              type="button"
              className="group/zoom block w-full cursor-zoom-in text-left"
              aria-label={`Enlarge image: ${alt}`}
            >
              {image}
              <span
                aria-hidden="true"
                className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/90 text-neutral-800 shadow-sm backdrop-blur transition-[transform,background-color] duration-200 ease-out-quint group-hover/zoom:scale-105 group-hover/zoom:bg-white group-focus-visible/zoom:scale-105"
              >
                <Maximize2 className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </button>
          </Lightbox>
        ) : (
          image
        )}
      </div>
      {caption && (
        <figcaption className={`t-caption mt-3 ${captionClassName}`}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

interface LightboxProps {
  media: Media
  alt: string
  caption?: ReactNode
  children: ReactNode
}

export function Lightbox({ media, alt, caption, children }: LightboxProps) {
  const [open, setOpen] = useState(false)
  const tall = media.height / media.width > 2

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-neutral-950/88 backdrop-blur-sm duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="on-dark fixed inset-0 z-[90] overflow-y-auto outline-none duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-98"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <div
            className={`flex min-h-full flex-col items-center px-4 py-16 sm:px-10 ${
              tall ? "justify-start" : "justify-center"
            }`}
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false)
            }}
          >
            <img
              src={media.src}
              srcSet={media.srcSet}
              sizes="100vw"
              width={media.width}
              height={media.height}
              alt={alt}
              className={`h-auto rounded-lg bg-white shadow-2xl ${
                tall
                  ? "w-full max-w-[44rem]"
                  : "max-h-[82vh] w-auto max-w-full object-contain"
              }`}
            />
            {caption && (
              <Dialog.Description className="t-caption mt-4 max-w-2xl text-center text-white/70">
                {caption}
              </Dialog.Description>
            )}
          </div>
          <Dialog.Close
            className="fixed top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
            aria-label="Close enlarged image"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
