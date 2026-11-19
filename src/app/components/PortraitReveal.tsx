import { useEffect, useRef, useState } from "react"

import { playSway } from "../lib/portraitSound"
import { ArrowRight, Volume2, VolumeX, X } from "lucide-react"
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

export function PortraitReveal({ inFlight = false }: { inFlight?: boolean }) {
  const [index, setIndex] = useState(-1)
  const side = index < 0 ? 0 : 1
  const primary = useRef<HTMLButtonElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (inFlight) setIndex(-1)
  }, [inFlight])

  function advance() {
    if (inFlight) return
    sway(index % 2 === 0 ? -1 : 1)
    setIndex((index + 1) % facts.length)
    if (open && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      portraitRef.current?.animate(
        [{ rotate: "0deg" }, { rotate: ".55deg", offset: .34 }, { rotate: "0deg" }],
        { duration: 460, easing: "cubic-bezier(.2,.7,.2,1)" },
      )
    }
  }

  function close() {
    sway(0)
    setIndex(-1)
    primary.current?.focus()
  }

  const fact = facts[index]
  function note() {
    if (!fact) return null
    return (
      <div className="portrait-copy" key={index}>
        <span className="portrait-count">{String(index + 1).padStart(2, "0")} / {String(facts.length).padStart(2, "0")}</span>
        <p>{fact.text}</p>
        {fact.project && <Link className="mt-3 inline-block text-sm font-medium underline underline-offset-4" to="stammer-halo">View Stammer Halo</Link>}
      </div>
    )
  }

  return (
    <>
      <div id="portrait-stage" className="portrait-stage relative aspect-[5/6] sm:aspect-[4/5] lg:aspect-auto lg:h-[clamp(36rem,calc(100svh_-_7rem),48rem)]" data-side={side}>
        <div className="portrait-note">{note()}</div>

        <div className="portrait-figure" ref={portraitRef}>
          <Img media={portrait} priority alt="Angel Agharia" sizes="(min-width: 1024px) 32rem, (min-width: 640px) 25rem, 88vw" className="h-full w-auto max-w-none portrait-photo" />
        </div>
      </div>
      <div id="portrait-mobile-facts" className="portrait-mobile-note" data-open={open}><div>{note()}</div></div>
      <div className="portrait-controls">
        <button ref={primary} disabled={inFlight} type="button" aria-controls="portrait-stage portrait-mobile-facts" aria-expanded={open} className={control} onClick={advance}>
          {open ? "Next fact" : "A little about me"} <ArrowRight size={15} aria-hidden="true" />
        </button>
        <button type="button" className={control} aria-label="Sway sound" aria-pressed={sound} title={sound ? "Mute sway sound" : "Enable sway sound"} onClick={() => { if (sound) void audio.current?.suspend().catch(() => {}); setSound(!sound) }}>
          {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        {open && <button type="button" onClick={close} className={control} aria-label="Close facts"><X size={15} aria-hidden="true" /></button>}
      </div>
      <span className="sr-only" role="status">{open ? facts[index].text : ""}</span>
    </>
  )
}
