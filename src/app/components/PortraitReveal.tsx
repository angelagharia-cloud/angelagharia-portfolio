import { useCallback, useEffect, useRef, useState } from "react"

import { playSway } from "../lib/portraitSound"
import { ArrowRight, Play, Pause, Volume2, VolumeX, X } from "lucide-react"
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
  const [playing, setPlaying] = useState(false)
  const [preparing, setPreparing] = useState(false)
  const [previous, setPrevious] = useState(-1)
  const side = preparing ? 1 : index < 0 ? 0 : index % 2 === 0 ? -1 : 1
  const primary = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(!document.hidden)
  const open = index >= 0

  const [sound, setSound] = useState(true)
  const audio = useRef<AudioContext | null>(null)
  useEffect(() => () => { void audio.current?.close(); audio.current = null }, [])

  const sway = useCallback((to: number) => {
    if (!sound || !window.AudioContext) return
    try {
      const ctx = audio.current ??= new AudioContext()
      if (ctx.state !== "running") void ctx.resume().catch(() => {})
      playSway(ctx, side, to)
    } catch { /* Sound is optional. */ }
  }, [sound, side])

  useEffect(() => {
    if (inFlight) { setPlaying(false); setPreparing(false); setPrevious(-1); setIndex(-1) }
  }, [inFlight])

  useEffect(() => {
    const change = () => setVisible(!document.hidden)
    document.addEventListener("visibilitychange", change)
    return () => document.removeEventListener("visibilitychange", change)
  }, [])

  const show = useCallback((next: number) => {
    setPrevious(index)
    setIndex(next)
    sway(next % 2 === 0 ? -1 : 1)
    if (next === facts.length - 1) setPlaying(false)
  }, [sway, index])

  useEffect(() => {
    if (!playing || !visible || inFlight || index < 0 || index >= facts.length - 1) return
    const words = facts[index].text.split(/\s+/).length
    const timer = window.setTimeout(() => show(index + 1), 2800 + words * 225)
    return () => window.clearTimeout(timer)
  }, [playing, visible, inFlight, index, show])

  useEffect(() => {
    if (!preparing || inFlight || !visible || !playing) return
    const timer = window.setTimeout(() => {
      setPreparing(false)
      show(0)
    }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 440)
    return () => window.clearTimeout(timer)
  }, [preparing, playing, visible, inFlight, show])

  function toggle() {
    if (preparing) { setPlaying(value => !value); return }
    if (!open || index === facts.length - 1) {
      setIndex(-1)
      setPrevious(-1)
      setPreparing(true)
      setPlaying(true)
    } else {
      setPlaying(value => !value)
    }
  }
  function close() {
    setPlaying(false)
    setPreparing(false)
    setPrevious(-1)
    sway(0)
    setIndex(-1)
    primary.current?.focus()
  }

  function note(i: number, outgoing = false) {
    const fact = facts[i]
    if (!fact) return null
    return (
      <div key={i} className="portrait-note" data-reveal={i % 2 === 0 ? "right" : "left"} aria-hidden={outgoing || undefined}>
        <div className="portrait-copy">
          <span className="portrait-count">{String(i + 1).padStart(2, "0")} / {String(facts.length).padStart(2, "0")}</span>
          <p>{fact.text}</p>
          {fact.project && !outgoing && <Link className="mt-3 inline-block text-sm font-medium underline underline-offset-4" to="stammer-halo">View Stammer Halo</Link>}
        </div>
      </div>
    )
  }

  return (
    <>
      <div id="portrait-stage" className="portrait-stage relative aspect-[5/6] sm:aspect-[4/5] lg:aspect-auto lg:h-[clamp(36rem,calc(100svh_-_7rem),48rem)]" data-side={side} data-preparing={preparing} data-open={open || preparing}>
        {note(previous, true)}
        {note(index)}

        <div className="portrait-figure">
          <Img media={portrait} priority alt="Angel Agharia" sizes="(min-width: 1024px) 32rem, (min-width: 640px) 25rem, 88vw" className="h-full w-auto max-w-none portrait-photo" />
        </div>
      </div>

      <div className="portrait-controls">
        <button ref={primary} disabled={inFlight} type="button" aria-controls="portrait-stage" aria-expanded={open || preparing} className={control} onClick={toggle}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {!open && !preparing ? "Start my story" : playing ? "Pause" : index === facts.length - 1 ? "Replay facts" : "Resume"}
        </button>
        {open && index < facts.length - 1 && <button type="button" className={control} aria-label="Next fact" onClick={() => show(index + 1)}><ArrowRight size={15} /></button>}
        <button type="button" className={control} aria-label="Sway sound" aria-pressed={sound} title={sound ? "Mute sway sound" : "Enable sway sound"} onClick={() => { if (sound) void audio.current?.suspend().catch(() => {}); setSound(!sound) }}>
          {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        {(open || preparing) && <button type="button" onClick={close} className={control} aria-label="Close facts"><X size={15} aria-hidden="true" /></button>}
      </div>
      <span className="sr-only" role="status">{open ? facts[index].text : ""}</span>
    </>
  )
}
