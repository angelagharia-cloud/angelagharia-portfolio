import type { ReactNode } from "react"
import { motion } from "motion/react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Link, isPlainClick, useNav } from "../../lib/router"
import { PROJECT_MAP, nextProject, type ProjectId } from "../../lib/projects"
import { DURATION, EASE_OUT } from "../../lib/motion"
import { arrowNudge } from "../../lib/styles"
import { Reveal } from "../system/Reveal"
import { SectionLabel } from "../system/SectionLabel"
import { ProjectCover } from "../covers"

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.intro, ease: EASE_OUT, delay },
})

/* ── Hero ───────────────────────────────────────────────────────────────── */

interface CaseHeroProps {
  id: ProjectId
  title: ReactNode
  tagline: string
  summary: ReactNode
  meta: [string, string][]
  visual: ReactNode
}

export function CaseHero({ id, title, tagline, summary, meta, visual }: CaseHeroProps) {
  const project = PROJECT_MAP[id]
  return (
    <section
      className="relative isolate overflow-hidden pt-16"
      style={{ background: `linear-gradient(180deg, ${project.tint} 0%, #ffffff 92%)` }}
    >
      <div className="shell grid gap-12 pt-12 pb-16 sm:pt-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pt-20 lg:pb-24">
        <div className="lg:col-span-6">
          <motion.div {...enter(0)}>
            <SectionLabel index={project.index} accent={project.accent}>
              {project.category}
            </SectionLabel>
          </motion.div>
          <motion.h1 {...enter(0.06)} className="t-h1 mt-6 text-neutral-950">
            {title}
          </motion.h1>
          <motion.p
            {...enter(0.12)}
            className="mt-4 font-serif text-[clamp(1.375rem,1.12rem+0.95vw,1.875rem)] leading-snug italic"
            style={{ color: project.accent }}
          >
            {tagline}
          </motion.p>
          <motion.p {...enter(0.18)} className="t-lead mt-6 max-w-xl text-neutral-600">
            {summary}
          </motion.p>
          <motion.dl
            {...enter(0.24)}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-neutral-900/10 pt-6 sm:grid-cols-3"
          >
            {meta.map(([term, detail]) => (
              <div key={term}>
                <dt className="t-eyebrow text-neutral-500">{term}</dt>
                <dd className="mt-1.5 text-[0.9375rem] leading-snug font-medium text-neutral-900">
                  {detail}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 }}
          className="lg:col-span-6"
        >
          {visual}
        </motion.div>
      </div>
    </section>
  )
}

/* ── At a glance ────────────────────────────────────────────────────────── */

export function AtAGlance({
  items,
  accent,
}: {
  items: { label: string; body: ReactNode }[]
  accent: string
}) {
  return (
    <section aria-label="At a glance" className="border-y border-neutral-200/80 bg-[#faf9f7]">
      <dl className="shell grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ label, body }, i) => (
          <Reveal
            key={label}
            delay={i * 0.05}
            className="border-b border-neutral-200/80 py-7 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:py-10"
          >
            <dt className="t-eyebrow flex items-center gap-2 text-neutral-500">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
              {label}
            </dt>
            <dd className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-700">{body}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}

/* ── Section ────────────────────────────────────────────────────────────── */

const TONES = {
  white: "bg-white",
  paper: "bg-[#faf9f7]",
  dark: "on-dark bg-[#111114] text-white",
} as const

interface CaseSectionProps {
  id?: string
  index?: string
  label?: string
  title?: ReactNode
  intro?: ReactNode
  accent?: string
  tone?: keyof typeof TONES
  compact?: boolean
  children?: ReactNode
}

export function CaseSection({
  id,
  index,
  label,
  title,
  intro,
  accent,
  tone = "white",
  compact = false,
  children,
}: CaseSectionProps) {
  const dark = tone === "dark"
  return (
    <section id={id} className={`${compact ? "section-y-sm" : "section-y"} ${TONES[tone]}`}>
      <div className="shell">
        {(label || title) && (
          <Reveal className="max-w-3xl">
            {label && (
              <SectionLabel index={index} accent={dark ? undefined : accent} tone={dark ? "dark" : "light"}>
                {label}
              </SectionLabel>
            )}
            {title && (
              <h2 className={`t-h2 mt-5 ${dark ? "text-white" : "text-neutral-950"}`}>{title}</h2>
            )}
            {intro && (
              <p className={`t-lead mt-5 ${dark ? "text-white/70" : "text-neutral-600"}`}>{intro}</p>
            )}
          </Reveal>
        )}
        {children && <div className={label || title ? "mt-12 lg:mt-14" : ""}>{children}</div>}
      </div>
    </section>
  )
}

/* ── Small building blocks ──────────────────────────────────────────────── */

export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-[40rem] space-y-5 text-[1.0625rem] leading-[1.7] text-neutral-700 ${className}`}>
      {children}
    </div>
  )
}

/** Numbered points, used for insights, decisions and learnings. */
export function PointGrid({
  items,
  accent,
  columns = 3,
}: {
  items: { title: string; body: ReactNode; detail?: ReactNode }[]
  accent: string
  columns?: 2 | 3 | 4
}) {
  const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns]
  return (
    <ol className={`grid gap-x-8 gap-y-10 ${cols}`}>
      {items.map(({ title, body, detail }, i) => (
        <li key={title}>
          <Reveal delay={(i % columns) * 0.06} className="h-full border-t border-neutral-900/10 pt-6">
            <span className="tabular text-sm font-medium" style={{ color: accent }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg font-semibold leading-snug text-neutral-950">{title}</h3>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-neutral-600">{body}</p>
            {detail && <div className="mt-4">{detail}</div>}
          </Reveal>
        </li>
      ))}
    </ol>
  )
}

/** Large figures with short labels. Values are always sourced from the project. */
export function StatRow({
  items,
  accent,
  note,
}: {
  items: { value: string; label: string }[]
  accent: string
  note?: ReactNode
}) {
  return (
    <div>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-neutral-900/10 ring-1 ring-neutral-900/10 lg:grid-cols-4">
        {items.map(({ value, label }) => (
          <div key={label} className="flex flex-col-reverse justify-end gap-2 bg-white p-6 sm:p-7">
            <dt className="text-sm leading-snug text-neutral-600">{label}</dt>
            <dd className="tabular font-serif text-[2.25rem] leading-none sm:text-[2.75rem]" style={{ color: accent }}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
      {note && <p className="t-caption mt-4 max-w-2xl text-neutral-500">{note}</p>}
    </div>
  )
}

/** Short, highlighted statement such as a design challenge or key quote. */
export function Statement({ label, children, accent }: { label: string; children: ReactNode; accent: string }) {
  return (
    <figure className="relative border-l-2 pl-6 sm:pl-8" style={{ borderColor: accent }}>
      <figcaption className="t-eyebrow" style={{ color: accent }}>
        {label}
      </figcaption>
      <blockquote className="mt-3 font-serif text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] leading-snug text-neutral-900">
        {children}
      </blockquote>
    </figure>
  )
}

/** Simple chip list for tools and methods. Static, so styled as text rather than buttons. */
export function TagList({ items, label }: { items: string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-x-2 gap-y-2">
      {items.map((item) => (
        <li key={item} className="rounded-md bg-neutral-900/[0.04] px-2.5 py-1 text-sm text-neutral-700">
          {item}
        </li>
      ))}
    </ul>
  )
}

/* ── Next project ───────────────────────────────────────────────────────── */

export function NextProject({ current }: { current: ProjectId }) {
  const next = nextProject(current)
  const { backToWork } = useNav()

  return (
    <section aria-labelledby="next-project" className="border-t border-neutral-200/80 bg-white">
      <div className="shell section-y-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionLabel>
            <span id="next-project">Next project</span>
          </SectionLabel>
          <Link
            to="home"
            section="work"
            onClick={(event) => {
              if (!isPlainClick(event)) return
              event.preventDefault()
              backToWork()
            }}
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:text-neutral-950"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 ease-out-quint group-hover:-translate-x-1"
              strokeWidth={1.75}
            />
            All work
          </Link>
        </div>

        <Reveal>
          <article className="group relative mt-8 grid items-center gap-8 rounded-3xl has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-8 has-[a:focus-visible]:outline-[#2563eb] lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="tabular text-sm font-medium" style={{ color: next.accent }}>
                {next.index} · {next.category}
              </p>
              <h2 className="mt-4 font-serif text-[clamp(2.5rem,1.5rem+4.2vw,5rem)] leading-[1.02] tracking-[-0.02em] text-neutral-950">
                <Link
                  to={next.id}
                  className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit]"
                >
                  {next.title}
                </Link>
              </h2>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-600">{next.summary}</p>
              <span
                aria-hidden="true"
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: next.accent }}
              >
                Read case study <ArrowRight className={`h-4 w-4 ${arrowNudge}`} strokeWidth={1.75} />
              </span>
            </div>
            <div className="lg:col-span-5">
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-neutral-900/10 transition-[transform,box-shadow] duration-500 ease-out-quint group-hover:-translate-y-1 group-hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.35)]"
                style={{ backgroundColor: next.tint }}
              >
                <ProjectCover id={next.id} sizes="(min-width: 1024px) 36vw, 100vw" />
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
