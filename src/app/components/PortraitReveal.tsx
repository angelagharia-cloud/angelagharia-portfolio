import { useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { media } from "../lib/media"
import { Link } from "../lib/router"
import { Img } from "./system/Img"
import "./portrait-reveal.css"

const facts = [
  { text: "I’ve danced on stage with A$AP Rocky and Leon Thomas." },
  { text: "I played varsity men’s basketball." },
  { text: "I have a stammer. That’s what inspired me to design Stammer Halo.", project: true },
]
const portrait = media("portrait")
const control = "inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 hover:bg-neutral-100"

export function PortraitReveal() {
  const [index, setIndex] = useState(-1)
  const [previous, setPrevious] = useState(-1)
  const [side, setSide] = useState(0)
  const primary = useRef<HTMLButtonElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const open = index >= 0

  function advance() {
    if (open && stage.current?.getAnimations().some(animation => animation.playState === "running")) return
    setPrevious(index)
    setIndex((index + 1) % facts.length)
    setSide(side === 1 ? -1 : 1)
  }

  function close() {
    setPrevious(-1)
    setIndex(-1)
    setSide(0)
    primary.current?.focus()
  }

  function note(i: number, direction: number, outgoing = false) {
    if (i < 0) return null
    const fact = facts[i]
    return (
      <div className="portrait-note" data-direction={direction} aria-hidden={outgoing || undefined}>
        <div className="portrait-copy">
          <p>{fact.text}</p>
          {fact.project && !outgoing && <Link className="mt-3 inline-block text-sm font-medium underline underline-offset-4" to="stammer-halo">View Stammer Halo</Link>}
        </div>
      </div>
    )
  }

  return (
    <>
      <div ref={stage} id="portrait-stage" className="portrait-stage relative aspect-[5/6] lg:aspect-auto lg:h-[clamp(22rem,calc(100svh_-_11rem),40rem)]" data-side={side}>
        <div aria-hidden="true" className="absolute inset-x-[7%] top-[3%] bottom-0 rounded-t-full bg-gradient-to-b from-[#e9eefc] via-[#f1ecfb] to-[#fbf0f6] ring-1 ring-inset ring-neutral-900/[0.04]" />
        {note(previous, -side, true)}
        {note(index, side)}
        <div className="portrait-figure">
          <Img media={portrait} priority alt="Angel Agharia" sizes="(min-width: 1024px) 18rem, 11rem" className="h-full w-auto max-w-none drop-shadow-[0_24px_30px_rgba(15,23,42,0.18)]" />
        </div>
      </div>
      <div className="flex min-h-14 items-center justify-center gap-1">
        {open && <span className="text-xs text-neutral-600">{index + 1} of {facts.length}</span>}
        <button ref={primary} type="button" aria-controls="portrait-stage" aria-expanded={open} className={control} onClick={advance}>
          {open ? "Next" : "A little about me"} <ArrowRight size={15} aria-hidden="true" />
        </button>
        {open && <button type="button" onClick={close} className={control}>Close</button>}
      </div>
      <span className="sr-only" role="status">{open ? facts[index].text : ""}</span>
    </>
  )
}
