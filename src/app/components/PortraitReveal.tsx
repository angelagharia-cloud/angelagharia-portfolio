import { useEffect, useRef, useState } from "react"

import { playSway } from "../lib/portraitSound"
import { ArrowRight, Volume2, VolumeX } from "lucide-react"
import { media } from "../lib/media"
import { Link } from "../lib/router"
import { Img } from "./system/Img"
import "./portrait-reveal.css"

const facts = [
  { text: "I’ve danced on stage with A$AP Rocky and Leon Thomas." },
  { text: "I pay attention to the first screen of an app. Can I tell what to do next without hunting through menus?" },
  { text: "I played varsity men’s basketball." },
  { text: "I’ve learned to let go of a design I like when someone using it shows me a better way." },
  { text: "I have a stammer. That’s what inspired me to design Stammer Halo.", project: true },
]
const portrait = media("portrait-hero")
const control = "inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 hover:bg-neutral-100"

export function PortraitReveal({ threadImpact = false }: { threadImpact?: boolean }) {
  const [index, setIndex] = useState(-1)
  const [previous, setPrevious] = useState(-1)
  const [side, setSide] = useState(0)
  const primary = useRef<HTMLButtonElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const open = index >= 0

  const [sound, setSound] = useState(true)
  const audio = useRef<AudioContext | null>(null)
  useEffect(() => () => { void audio.current?.close(); audio.current = null }, [])

  function sway(to: number) {
    if (!sound || !window.AudioContext) return
    try {
      const ctx = audio.current ??= new AudioContext()
      if (ctx.state !== "running") void ctx.resume().catch(() => {})
      playSway(ctx, side, to)
    } catch { /* Audio may be unavailable on this device. */ }
  }

  function advance() {
    if (open && stage.current?.getAnimations().some(animation => animation.playState === "running")) return
    sway(side === 1 ? -1 : 1)
    setPrevious(index)
    setIndex((index + 1) % facts.length)
    setSide(side === 1 ? -1 : 1)
  }

  function close() {
    sway(0)
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
      <div ref={stage} id="portrait-stage" className="portrait-stage relative aspect-[5/6] sm:aspect-[4/5] lg:aspect-auto lg:h-[clamp(36rem,calc(100svh_-_7rem),48rem)]" data-side={side}>
        {note(previous, -side, true)}
        {note(index, side)}

        <div className="portrait-figure" data-impact={threadImpact}>
          <Img media={portrait} priority alt="Angel Agharia" sizes="(min-width: 1024px) 32rem, (min-width: 640px) 25rem, 88vw" className="h-full w-auto max-w-none portrait-photo" />
        </div>
      </div>
      <div className="flex min-h-14 items-center justify-center gap-1">
        {open && <span className="text-xs text-neutral-600">{index + 1} of {facts.length}</span>}
        <button ref={primary} type="button" aria-controls="portrait-stage" aria-expanded={open} className={control} onClick={advance}>
          {open ? "Next" : "A little about me"} <ArrowRight size={15} aria-hidden="true" />
        </button>
        <button type="button" className={control} aria-label="Sway sound" aria-pressed={sound} title={sound ? "Mute sway sound" : "Enable sway sound"} onClick={() => { if (sound) void audio.current?.suspend().catch(() => {}); setSound(!sound) }}>
          {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        {open && <button type="button" onClick={close} className={control}>Close</button>}
      </div>
      <span className="sr-only" role="status">{open ? facts[index].text : ""}</span>
    </>
  )
}
