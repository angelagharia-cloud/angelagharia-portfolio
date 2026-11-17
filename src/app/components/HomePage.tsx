import type { ReactNode } from "react"
import { motion } from "motion/react"
import { ArrowDown, ArrowRight } from "lucide-react"
import { Link } from "../lib/router"
import { PROJECT_MAP, type ProjectId } from "../lib/projects"
import { media } from "../lib/media"
import { DURATION, EASE_OUT } from "../lib/motion"
import { arrowNudge, btn } from "../lib/styles"
import { Img } from "./system/Img"
import { Reveal } from "./system/Reveal"
import { SectionLabel } from "./system/SectionLabel"
import { ProjectCover } from "./covers"

import { PortraitReveal } from "./PortraitReveal"
import { SeasonalHeroAccents } from "./SeasonalHeroAccents"

const CREDENTIALS = [
  ["BSc Product Design", "Maynooth University"],
  ["MSc Human–Computer Interaction", "University College Dublin"],
  ["UX/UI consultancy", "Gravitad · client work"],
]

const HIGHLIGHTS = [
  { value: "6", label: "case studies, from client work to HCI research" },
  { value: "64", label: "participants in a controlled HCI experiment" },
  { value: "180+", label: "students engaged face to face at a campus stall" },
  { value: "400+", label: "survey responses on commuter belonging" },
]

const EXPERIENCE = [
  {
    org: "Gravitad",
    role: "UX/UI Designer · Freelance consultancy",
    body: "UX audits and recommendations across AI-assisted content journeys.",
  },
  {
    org: "Creative for You / Emplio",
    role: "UX/UI Intern",
    body: "Research, wireframing and usability-focused interface design.",
  },
  {
    org: "Shamrock Beats",
    role: "UX/UI & experience design",
    body: "Independent creative work spanning visual direction and digital production.",
  },
]

const SKILLS = [
  {
    category: "Design & Prototyping",
    items: ["Figma", "Adobe XD", "Wireframing", "Prototyping", "Design systems", "Accessibility (WCAG)"],
  },
  {
    category: "Research & Strategy",
    items: ["User interviews", "Personas", "Journey mapping", "Competitive analysis", "Survey design", "A/B testing"],
  },
  {
    category: "HCI & Analytics",
    items: ["Experimental design", "Statistical analysis", "SPSS", "Quantitative research", "Data visualisation"],
  },
  {
    category: "Development",
    items: ["HTML / CSS", "React", "JavaScript", "Tailwind CSS", "Responsive design", "Git"],
  },
]

export function HomePage() {
  return (
    <>
      <Hero />
      <Highlights />
      <SelectedWork />
      <About />
      <Toolkit />
    </>
  )
}

/* ── Hero ───────────────────────────────────────────────────────────────── */

const intro = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.intro, ease: EASE_OUT, delay },
})

function MaskLine({
  children,
  delay,
  className = "",
}: {
  children: ReactNode
  delay: number
  className?: string
}) {
  return (
    <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em] pr-[0.06em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "108%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(56rem_36rem_at_12%_42%,rgba(59,130,246,0.06),transparent_62%),radial-gradient(46rem_34rem_at_88%_18%,rgba(168,85,247,0.06),transparent_60%)]"
      />
      <SeasonalHeroAccents />
      <div className="relative z-10 shell grid items-end gap-x-10 gap-y-14 pt-14 sm:pt-20 lg:min-h-[calc(100svh_-_4rem)] lg:grid-cols-12 lg:pt-12">
        <div className="lg:col-span-7 lg:self-center lg:pb-12">
          <motion.p {...intro(0)} className="t-eyebrow text-neutral-500">
            UX/UI &amp; Product Designer
          </motion.p>

          <h1 className="t-display mt-6 text-neutral-950">
            <MaskLine delay={0.08}>Angel</MaskLine>
            <MaskLine delay={0.18} className="italic text-[#85858d]">
              Agharia
            </MaskLine>
          </h1>

          <motion.p
            {...intro(0.38)}
            className="t-lead mt-8 max-w-[33rem] text-neutral-600"
          >
            I design clear, considered digital products, using research to
            frame the problem and prototyping to get the details right.
          </motion.p>

          <motion.dl
            {...intro(0.48)}
            className="mt-9 grid max-w-[40rem] border-t border-neutral-200 sm:grid-cols-3"
          >
            {CREDENTIALS.map(([title, detail], i) => (
              <div
                key={title}
                className={`border-b border-neutral-200 py-4 sm:border-b-0 sm:pr-5 ${
                  i > 0 ? "sm:border-l sm:pl-5" : ""
                }`}
              >
                <dt className="text-sm font-medium leading-snug text-neutral-900">
                  {title}
                </dt>
                <dd className="mt-1 text-sm text-neutral-500">{detail}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div
            {...intro(0.58)}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link to="home" section="work" className={btn.primary}>
              View selected work
              <ArrowDown
                className="h-4 w-4 transition-transform duration-300 ease-out-quint group-hover:translate-y-0.5"
                strokeWidth={1.75}
              />
            </Link>
            <Link to="home" section="contact" className={btn.secondary}>
              Get in touch
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.12 }}
          className="relative mx-auto w-full max-w-[19rem] sm:max-w-[23rem] lg:col-span-5 lg:max-w-none"
        >
          <PortraitReveal />
        </motion.div>
      </div>
    </section>
  )
}

/* ── Highlights ─────────────────────────────────────────────────────────── */

function Highlights() {
  return (
    <section
      aria-label="Highlights"
      className="border-y border-neutral-200/80 bg-[#faf9f7]"
    >
      <dl className="shell grid grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map(({ value, label }, i) => (
          <Reveal
            key={label}
            delay={i * 0.06}
            className={`flex flex-col-reverse justify-end gap-2 border-neutral-200/80 py-8 lg:py-10 ${
              i % 2 === 0 ? "pr-5 lg:pr-8" : "border-l pl-5 lg:pl-8"
            } ${i < 2 ? "border-b lg:border-b-0" : ""} ${
              i === 2 ? "lg:border-l lg:pl-8" : ""
            }`}
          >
            <dt className="max-w-[15rem] text-sm leading-snug text-neutral-600">
              {label}
            </dt>
            <dd className="tabular font-serif text-[2.5rem] leading-none text-neutral-950 lg:text-5xl">
              {value}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}

/* ── Selected work ──────────────────────────────────────────────────────── */

const focusRing =
  "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-[#2563eb]"

function CardLink({ id, children, className = "" }: { id: ProjectId; children: ReactNode; className?: string }) {
  return (
    <Link
      to={id}
      className={`outline-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] ${className}`}
    >
      {children}
    </Link>
  )
}

function SelectedWork() {
  return (
    <section id="work" className="section-y">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="01">Portfolio</SectionLabel>
            <h2 className="t-h2 mt-6 text-neutral-950">Selected work</h2>
          </div>
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-neutral-600 lg:col-span-5 lg:justify-self-end lg:text-right">
            Professional consultancy and end-to-end case studies across
            digital products, services and HCI research.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:mt-16 lg:gap-8">
          <Reveal>
            <CreativeKeyFeature />
          </Reveal>
          <Reveal>
            <GravitadFeature />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            <ProjectCard id="stammer-halo" delay={0} />
            <ProjectCard id="smartmeal" delay={0.08} />
            <ProjectCard id="interruption-study" delay={0} />
            <ProjectCard id="ucd-campus" delay={0.08} />
          </div>
        </div>
      </div>
    </section>
  )
}

const KEYS = [
  { label: "Explore", tone: "text-emerald-300 border-emerald-400/25 bg-emerald-400/[0.08]" },
  { label: "Learn", tone: "text-sky-300 border-sky-400/25 bg-sky-400/[0.08]" },
  { label: "Book", tone: "text-orange-300 border-orange-400/25 bg-orange-400/[0.08]" },
  { label: "Residency", tone: "text-violet-300 border-violet-400/25 bg-violet-400/[0.08]" },
]

function CreativeKeyFeature() {
  const project = PROJECT_MAP["creative-key"]
  return (
    <article
      className={`on-dark group relative grid overflow-hidden rounded-3xl bg-[#0b0f1a] text-white ring-1 ring-white/[0.06] transition-[transform,box-shadow] duration-500 ease-out-quint hover:-translate-y-1 hover:shadow-[0_32px_80px_-32px_rgba(8,145,178,0.55)] lg:grid-cols-12 ${focusRing}`}
    >
      <div className="flex flex-col p-7 sm:p-10 lg:col-span-5 lg:p-12 xl:p-14">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="tabular text-xs font-medium text-cyan-300">{project.index}</span>
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/[0.08] px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-cyan-300">
            Featured project
          </span>
          <span className="text-xs text-white/60">MSc HCI · 2026</span>
        </div>
        <p className="t-eyebrow mt-8 text-white/60">
          Service design · Interaction design · Physical–digital
        </p>
        <h3 className="mt-4 font-serif text-[clamp(2.25rem,1.7rem+2vw,3.25rem)] leading-[1.04] tracking-[-0.015em]">
          <CardLink id="creative-key">
            Creative Key
            <br />
            <em className="text-cyan-300">Ecosystem</em>
          </CardLink>
        </h3>
        <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-white/70">
          A kiosk, printed keys and a mobile guide help students explore creative technology at UCD Creative Futures Academy.
        </p>
        <ul aria-label="Creative Key routes" className="mt-7 flex flex-wrap gap-2">
          {KEYS.map(({ label, tone }) => (
            <li key={label} className={`rounded-full border px-3 py-1 text-xs font-medium ${tone}`}>
              {label} Key
            </li>
          ))}
        </ul>
        <span aria-hidden="true" className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 lg:mt-auto lg:pt-10">
          View case study <ArrowRight className={`h-4 w-4 ${arrowNudge}`} strokeWidth={1.75} />
        </span>
      </div>

      <div className="relative min-h-[20rem] overflow-hidden bg-[#0f1624] sm:min-h-[24rem] lg:col-span-7 lg:min-h-[34rem]">
        <Img
          media={media("ck-kiosk")}
          alt="Cardboard Creative Key kiosk prototype in the Creative Futures Academy studio"
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="absolute inset-0 h-full w-full object-cover object-[38%_center] opacity-80 transition-transform duration-[900ms] ease-out-quint group-hover:scale-[1.03]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/10 to-transparent" />
        <div aria-hidden="true" className="absolute inset-0 hidden bg-gradient-to-r from-[#0b0f1a]/70 via-transparent via-25% to-transparent lg:block" />
        <div className="absolute bottom-6 right-[22%] w-[30%] max-w-[11rem] -rotate-3 overflow-hidden rounded-xl bg-white shadow-[0_24px_50px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/20 transition-transform duration-500 ease-out-quint group-hover:-translate-y-1.5 group-hover:-rotate-1">
          <Img media={media("ck-tickets")} alt="The four printed Creative Key route tickets" sizes="11rem" className="block h-auto w-full" />
        </div>
        <div className="absolute bottom-9 right-6 w-[19%] max-w-[7.5rem] rotate-[4deg] overflow-hidden rounded-[1.1rem] bg-[#07111f] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/20 transition-transform duration-500 ease-out-quint group-hover:-translate-y-2 group-hover:rotate-2">
          <Img media={media("ck-mobile-handoff")} alt="Creative Key mobile handoff screen" sizes="7.5rem" className="block h-auto w-full" />
        </div>
        <p className="absolute top-5 left-5 rounded-full border border-white/15 bg-[#0b0f1a]/70 px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
          Kiosk → key → mobile
        </p>
      </div>
    </article>
  )
}

function GravitadFeature() {
  const project = PROJECT_MAP.gravitad
  return (
    <article
      className={`group relative grid overflow-hidden rounded-3xl bg-[#eaf3ff] ring-1 ring-[#c9ddf6] transition-[transform,box-shadow] duration-500 ease-out-quint hover:-translate-y-1 hover:shadow-[0_32px_80px_-36px_rgba(5,92,191,0.45)] lg:grid-cols-12 ${focusRing}`}
    >
      <div className="flex flex-col p-7 sm:p-10 lg:col-span-5 lg:p-12 xl:p-14">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="tabular text-xs font-medium text-[#055cbf]">{project.index}</span>
          <span className="rounded-full border border-[#9ec3ee] bg-white/70 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#055cbf]">
            Professional client work
          </span>
          <span className="text-xs text-[#33506f]">Freelance consultancy</span>
        </div>
        <p className="t-eyebrow mt-8 text-[#33506f]">
          UX audit · Information architecture · Accessibility
        </p>
        <h3 className="mt-4 font-serif text-[clamp(2rem,1.6rem+1.6vw,2.875rem)] leading-[1.08] tracking-[-0.015em] text-neutral-950">
          <CardLink id="gravitad">
            Making an AI platform feel{" "}
            <em className="text-[#055cbf]">clear and human</em>
          </CardLink>
        </h3>
        <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-neutral-700">
          I audited content creation, sentiment feedback and analytics, then
          turned the highest-signal issues into practical recommendations.
        </p>
        <span aria-hidden="true" className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-[#055cbf] lg:mt-auto lg:pt-10">
          View case study <ArrowRight className={`h-4 w-4 ${arrowNudge}`} strokeWidth={1.75} />
        </span>
      </div>
      <div className="relative flex items-center overflow-hidden bg-[#dcebfd] p-5 sm:p-8 lg:col-span-7 lg:p-12">
        <div className="w-full overflow-hidden rounded-xl bg-white shadow-[0_30px_60px_-30px_rgba(5,40,90,0.45)] ring-1 ring-[#b9d3f2] transition-transform duration-700 ease-out-quint group-hover:-translate-y-1 group-hover:scale-[1.015]">
          <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <Img
            media={media("gv-dashboard")}
            alt="Gravitad content platform dashboard reviewed during the UX audit"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="block h-auto w-full"
          />
        </div>
      </div>
    </article>
  )
}

function ProjectCard({ id, delay }: { id: ProjectId; delay: number }) {
  const project = PROJECT_MAP[id]
  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-200/90 transition-[transform,box-shadow] duration-500 ease-out-quint hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.3)] hover:ring-neutral-300 ${focusRing}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: project.tint }}>
          <ProjectCover id={id} />
        </div>
        <div className="flex flex-1 flex-col p-7 sm:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <p className="t-eyebrow text-neutral-500">{project.category}</p>
            <span className="tabular text-xs font-medium" style={{ color: project.accent }}>
              {project.index}
            </span>
          </div>
          <h3 className="t-h3 mt-4 text-neutral-950">
            <CardLink id={id}>{project.title}</CardLink>
          </h3>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-600">{project.summary}</p>
          <span
            aria-hidden="true"
            className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-medium"
            style={{ color: project.accent }}
          >
            View case study <ArrowRight className={`h-4 w-4 ${arrowNudge}`} strokeWidth={1.75} />
          </span>
        </div>
      </article>
    </Reveal>
  )
}

/* ── About ──────────────────────────────────────────────────────────────── */

function About() {
  return (
    <section id="about" className="section-y border-t border-neutral-200/80 bg-[#faf9f7]">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <SectionLabel index="02">About</SectionLabel>
          <h2 className="t-h2 mt-6 text-neutral-950">
            Research-led thinking,
            <br />
            <em className="text-neutral-500">made practical.</em>
          </h2>
        </Reveal>
        <div className="lg:col-span-7">
          <Reveal delay={0.06}>
            <p className="t-lead text-neutral-800">
              I’m a UX/UI and Product Designer with a BSc in Product Design from
              Maynooth University and an MSc in Human–Computer Interaction from
              UCD. I turn research into clear journeys, interfaces and
              recommendations that teams can use.
            </p>
            <p className="mt-5 max-w-[38rem] leading-relaxed text-neutral-600">
              A product design background means I prototype in cardboard and 3D
              prints as readily as in Figma, which keeps the focus on how
              things are actually used.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="t-eyebrow mt-12 text-neutral-500">Experience</h3>
            <ul className="mt-4 border-t border-neutral-200">
              {EXPERIENCE.map(({ org, role, body }) => (
                <li key={org} className="grid gap-1.5 border-b border-neutral-200 py-5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8">
                  <div>
                    <p className="font-medium text-neutral-950">{org}</p>
                    <p className="mt-0.5 text-sm text-neutral-500">{role}</p>
                  </div>
                  <p className="text-[0.9375rem] leading-relaxed text-neutral-600 sm:pt-px">{body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Toolkit ────────────────────────────────────────────────────────────── */

function Toolkit() {
  return (
    <section id="toolkit" className="section-y-sm border-t border-neutral-200/80">
      <div className="shell">
        <Reveal>
          <SectionLabel index="03">Toolkit</SectionLabel>
          <h2 className="t-h2 mt-6 text-neutral-950">Skills &amp; tools</h2>
        </Reveal>
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map(({ category, items }, i) => (
            <Reveal key={category} delay={i * 0.06}>
              <h3 className="border-b border-neutral-200 pb-3 text-sm font-semibold text-neutral-950">
                {category}
              </h3>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-neutral-600">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
