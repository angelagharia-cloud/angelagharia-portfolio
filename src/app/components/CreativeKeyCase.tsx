import type { ReactNode } from "react"
import { motion } from "motion/react"
import { ArrowDown, ArrowRight, ExternalLink } from "lucide-react"
import { media, type MediaName } from "../lib/media"
import { PROJECT_MAP } from "../lib/projects"
import { DURATION, EASE_OUT } from "../lib/motion"
import { arrowNudge } from "../lib/styles"
import { Figure } from "./system/Figure"
import { Img } from "./system/Img"
import { Reveal } from "./system/Reveal"
import { SectionLabel } from "./system/SectionLabel"
import { NextProject } from "./case/CaseKit"

const project = PROJECT_MAP["creative-key"]
const CYAN = "#22d3ee"
const NAVY = "#0b0f1a"
const FULL_PROJECT_URL = "https://canva.link/bajjalxjz1tl7t5"

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.intro, ease: EASE_OUT, delay },
})

const TAGS = ["UX Research", "Service Design", "Interaction Design", "Physical–Digital UX", "Visual Direction"]

const METHODS = [
  { n: "20", label: "Survey responses" },
  { n: "6", label: "Semi-structured interviews" },
  { n: "3", label: "Participant co-design sessions" },
  { n: "1", label: "Stakeholder session with CFA staff" },
]

const INSIGHTS = [
  {
    heading: "Discovery is socially distributed",
    body: "Students often learn about creative opportunities through friends, staff and informal encounters rather than formal information alone.",
    implication: "Make opportunities visible while showing what people can actually create with them.",
  },
  {
    heading: "Confidence grows through invitation",
    body: "Awareness does not automatically create confidence. Demonstration, reassurance and supported first attempts matter.",
    implication: "Help users move from “What is this?” to “I can try this.”",
  },
  {
    heading: "Access also has operational limits",
    body: "More visibility can create more demand. Equipment safety, staffing, training and responsibility need to be considered alongside accessibility.",
    implication: "Design access as a supported service rather than unlimited self-service.",
  },
]

const TOUCHPOINTS = [
  {
    title: "Wave Rib Kiosk",
    body: "A situated discovery point that helps students explore creative goals, spaces and technologies without requiring immediate sign-in.",
  },
  {
    title: "Creative Key",
    body: "A physical takeaway that captures the suggested creative route and connects the physical experience to mobile.",
  },
  {
    title: "Mobile Companion",
    body: "A private continuation of the journey: guides, saved pathways, learning, booking requests and progress.",
  },
]

const KEYS: { name: MediaName; label: string; accent: string }[] = [
  { name: "ck-key-explore", label: "Explore Key", accent: "#15803d" },
  { name: "ck-key-learning", label: "Learning Key", accent: "#1d4ed8" },
  { name: "ck-key-booking", label: "Booking Key", accent: "#c2410c" },
  { name: "ck-key-residency", label: "Residency Key", accent: "#6d28d9" },
]

const PHONES: { name: MediaName; label: string }[] = [
  { name: "ck-mobile-handoff", label: "QR handoff" },
  { name: "ck-mobile-home", label: "Personalised home" },
  { name: "ck-mobile-booking", label: "Booking details" },
]

const CHANGES = [
  "Clearer relationship between learning and booking",
  "Generic kiosk form replaced by the Wave Rib",
  "Permanent QR handoff rather than optional",
  "Scan-first rather than automatic printing",
  "Print-on-demand Creative Key card",
  "Greater attention to maintenance, reach and servicing",
]

const TENSIONS = [
  ["Discovery", "Operational capacity"],
  ["Independent use", "Human support"],
  ["Readiness", "Gatekeeping"],
  ["Personalisation", "Privacy"],
]

const CONTRIBUTION = [
  {
    tier: "Primary responsibility",
    color: CYAN,
    items: ["Portfolio visual direction", "Visual storytelling", "Systems visualisation", "Physical–digital experience continuity", "Wave Rib form refinement", "Final concept expression"],
  },
  {
    tier: "Strong involvement",
    color: "#c4b5fd",
    items: ["Research synthesis", "Ideation", "Concept convergence", "Interaction flows", "Prototype development"],
  },
  {
    tier: "Shared team responsibility",
    color: "#a3a3a3",
    items: ["Research planning", "Research interpretation", "Workshops", "Concept evaluation", "Final service decisions"],
  },
]

const LESSONS = [
  ["From interfaces to ecosystems", "I became more conscious of how experiences move across places, devices and people."],
  ["Evidence before attachment", "I learned to let concepts change when research or implementation challenged their original form."],
  ["Implementation is UX", "Maintenance, staffing, privacy and physical constraints cannot be treated as concerns for later."],
  ["Visual design can support reasoning", "Strong visual storytelling is most useful when it clarifies evidence and decision-making rather than simply decorating it."],
]

function Label({
  index,
  children,
  dark = false,
  className,
}: {
  index: string
  children: ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <SectionLabel index={index} tone={dark ? "dark" : "light"} accent={dark ? CYAN : project.accent} className={className}>
      {children}
    </SectionLabel>
  )
}

export function CreativeKeyCase() {
  const scrollToBody = () =>
    document.getElementById("ck-challenge")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    })

  return (
    <div className="bg-white">
      {/* ══ Hero ══════════════════════════════════════════════════════ */}
      <section className="on-dark relative isolate overflow-hidden pt-16 text-white" style={{ background: NAVY }}>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_0%,rgba(34,211,238,0.10),transparent_55%),radial-gradient(ellipse_at_85%_75%,rgba(124,58,237,0.12),transparent_50%)]" />
        <div className="shell grid items-center gap-14 pt-12 pb-20 sm:pt-16 lg:min-h-[calc(100svh_-_4rem)] lg:grid-cols-12 lg:gap-12 lg:pb-24">
          <div className="lg:col-span-5">
            <motion.div {...enter(0)}>
              <SectionLabel index={project.index} tone="dark" accent={CYAN}>
                Featured project · MSc HCI
              </SectionLabel>
            </motion.div>
            <motion.h1 {...enter(0.06)} className="t-h1 mt-6">
              Creative Key
              <br />
              <em style={{ color: CYAN }}>Ecosystem</em>
            </motion.h1>
            <motion.p {...enter(0.14)} className="t-lead mt-7 max-w-xl text-white/70">
              Designing a clearer path into creative technology: a physical–digital service
              ecosystem helping students discover creative spaces, understand unfamiliar
              technologies and build the confidence to begin creating.
            </motion.p>
            <motion.dl {...enter(0.2)} className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6">
              {[
                ["Context", "MSc HCI · UCD Creative Futures Academy"],
                ["Year · Team", "2026 · Team of 4"],
                ["My role", "Product / UX Designer + Visual Direction"],
                ["Focus", "Research, service and interaction design"],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt className="t-eyebrow text-white/55">{term}</dt>
                  <dd className="mt-1.5 text-[0.9375rem] leading-snug text-white/90">{detail}</dd>
                </div>
              ))}
            </motion.dl>
            <motion.div {...enter(0.26)} className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToBody}
                className="group inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold text-[#0b0f1a] transition-[filter,transform] duration-200 ease-out-quint hover:brightness-110 active:scale-[0.98]"
                style={{ background: CYAN }}
              >
                Explore the case study
                <ArrowDown className="h-4 w-4 transition-transform duration-300 ease-out-quint group-hover:translate-y-0.5" strokeWidth={2} />
              </button>
              <a
                href={FULL_PROJECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-cyan-300/40 px-6 text-sm font-semibold text-cyan-200 transition-[background-color,border-color] duration-200 hover:border-cyan-300/70 hover:bg-white/5"
              >
                Full HCI project on Canva
                <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </motion.div>
          </div>

          <figure className="relative min-h-[26rem] sm:min-h-[34rem] lg:col-span-7 lg:min-h-[40rem]">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.1 }}
              className="absolute inset-x-0 top-3 bottom-12 overflow-hidden rounded-[2rem] ring-1 ring-white/10"
            >
              <Img
                media={media("ck-kiosk")}
                alt="Cardboard Creative Key kiosk prototype being evaluated in the Creative Futures Academy studio"
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="h-full w-full object-cover object-[34%_center] opacity-85"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/10 to-transparent" />
            </motion.div>
            <motion.p {...enter(0.3)} className="absolute top-0 left-5 rounded-full border border-white/15 bg-[#0b0f1a]/80 px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
              Prototype to connected service
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.45 }}
              className="absolute right-[20%] bottom-0 w-[32%] max-w-[13rem] overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/20"
            >
              <Img media={media("ck-tickets")} alt="Four printed Creative Key route tickets" sizes="13rem" className="block h-auto w-full" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: 8 }}
              animate={{ opacity: 1, y: 0, rotate: 4 }}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.58 }}
              className="absolute right-0 bottom-6 w-[21%] max-w-[8.5rem] overflow-hidden rounded-[1.4rem] bg-[#07111f] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/20"
            >
              <Img media={media("ck-mobile-handoff")} alt="Creative Key mobile QR handoff screen" sizes="8.5rem" className="block h-auto w-full" />
            </motion.div>
            <figcaption className="absolute bottom-5 left-5 max-w-[12rem] text-xs leading-relaxed text-white/70 sm:max-w-[14rem]">
              One journey across a public kiosk, a printed key and a private mobile companion.
            </figcaption>
          </figure>
        </div>
        <div className="shell pb-10">
          <ul aria-label="Disciplines" className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <li key={tag} className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.05] px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-cyan-200/90">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 01 Challenge ══════════════════════════════════════════════ */}
      <section id="ck-challenge" className="section-y scroll-mt-16">
        <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <Label index="01">The challenge</Label>
            <h2 className="t-h2 mt-6 text-neutral-950">
              Creative opportunities existed. Finding a confident way in was harder.
            </h2>
            <div className="mt-7 max-w-[38rem] space-y-5 text-[1.0625rem] leading-[1.7] text-neutral-700">
              <p>
                The Creative Futures Academy gives students access to specialist creative spaces,
                technologies and expertise. Our research showed that the challenge was not simply
                whether these opportunities existed.
              </p>
              <p>
                Students could know that a space was there while still being unsure what happened
                inside, whether the technology was relevant to them, how to begin, or whether they
                were experienced enough to participate.
              </p>
            </div>
            <figure className="mt-10 border-l-2 pl-6" style={{ borderColor: CYAN }}>
              <figcaption className="t-eyebrow text-cyan-800">Design challenge</figcaption>
              <blockquote className="mt-3 font-serif text-[1.375rem] leading-snug text-neutral-900 sm:text-2xl">
                “How might we support creative students in confidently discovering, understanding
                and integrating creative technologies into their creative practice?”
              </blockquote>
            </figure>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6">
            <Figure
              media={media("ck-workshop")}
              alt="Portfolio page summarising what the co-design workshops taught the team"
              caption="Workshop learnings from the academic portfolio."
              sizes="(min-width: 1024px) 560px, 100vw"
              frameClassName="rounded-2xl ring-1 ring-black/5 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.5)]"
            />
          </Reveal>
        </div>
      </section>

      {/* ══ 02 Research ═══════════════════════════════════════════════ */}
      <section className="section-y bg-[#faf9f7]">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Label index="02">Research</Label>
              <h2 className="t-h2 mt-6 text-neutral-950">
                Understanding the gap between discovery and participation
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-7 lg:pt-12">
              <p className="max-w-[40rem] text-[1.0625rem] leading-[1.7] text-neutral-700">
                Rather than treating access as a navigation problem alone, we explored awareness,
                confidence, existing creative practice, social support, onboarding and the
                practical realities of running specialist spaces, combining methods to understand
                the problem from several angles.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-12">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-neutral-900/10 ring-1 ring-neutral-900/10 lg:grid-cols-4">
              {METHODS.map(({ n, label }) => (
                <div key={label} className="flex flex-col-reverse justify-end gap-2 bg-white p-6 sm:p-7">
                  <dt className="text-sm leading-snug text-neutral-600">{label}</dt>
                  <dd className="tabular font-serif text-[2.75rem] leading-none text-neutral-950">{n}</dd>
                </div>
              ))}
            </dl>
            <p className="t-caption mt-4 text-neutral-600">
              Also: direct observation in studio spaces and autoethnographic exploration.
            </p>
          </Reveal>

          <Reveal className="mt-10 flex max-w-3xl gap-5 rounded-2xl bg-white p-6 ring-1 ring-neutral-900/10 sm:p-7">
            <span aria-hidden="true" className="w-1 shrink-0 rounded-full" style={{ background: CYAN }} />
            <div>
              <p className="t-eyebrow text-neutral-500">My contribution</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-neutral-700">
                I was heavily involved in translating the research into visual structures,
                opportunity areas and design implications that the team could use during ideation,
                turning messy, multi-source data into shared meaning.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 03 Insights ═══════════════════════════════════════════════ */}
      <section className="on-dark section-y text-white" style={{ background: NAVY }}>
        <div className="shell">
          <Reveal>
            <Label index="03" dark>Key insights</Label>
            <h2 className="t-h2 mt-6">Three patterns shaped the direction</h2>
          </Reveal>
          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {INSIGHTS.map(({ heading, body, implication }, i) => (
              <li key={heading}>
                <Reveal delay={i * 0.08} className="flex h-full flex-col rounded-2xl bg-white/[0.04] p-7 ring-1 ring-white/10 sm:p-8">
                  <span className="tabular font-serif text-5xl leading-none text-cyan-300/40">0{i + 1}</span>
                  <h3 className="mt-6 font-serif text-2xl leading-snug">{heading}</h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/70">{body}</p>
                  <div className="mt-6 border-t border-white/10 pt-5 lg:mt-auto">
                    <p className="t-eyebrow text-cyan-300/90">Design implication</p>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-cyan-100">{implication}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ 04 Concepts ═══════════════════════════════════════════════ */}
      <section className="section-y">
        <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="order-2 lg:order-1 lg:col-span-6">
            <Figure
              media={media("ck-ideation")}
              alt="Ideation overview: dozens of idea fragments converging into opportunity areas"
              caption="From early fragments to opportunity areas."
              sizes="(min-width: 1024px) 560px, 100vw"
              frameClassName="rounded-2xl ring-1 ring-black/5 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.5)]"
            />
          </Reveal>
          <Reveal delay={0.08} className="order-1 lg:order-2 lg:col-span-6">
            <Label index="04">From research to concepts</Label>
            <h2 className="t-h2 mt-6 text-neutral-950">Opening the design space before converging</h2>
            <p className="mt-6 max-w-[38rem] text-[1.0625rem] leading-[1.7] text-neutral-700">
              Across two rounds of ideation, the team explored dozens of directions around
              discovery, learning, confidence, access and creative community. These converged into
              five concept families before landing on three core service layers.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <ol className="space-y-2.5">
                {["Creative Toolkit Ecosystem", "Creative Companion", "Creative Skills Passport", "Guided Learning Programme", "Residency Programme"].map((concept, i) => (
                  <li key={concept} className="flex items-baseline gap-3 text-[0.9375rem] text-neutral-700">
                    <span className="tabular w-5 shrink-0 text-xs text-neutral-500">0{i + 1}</span>
                    {concept}
                  </li>
                ))}
              </ol>
              <ArrowRight aria-hidden="true" className="hidden h-5 w-5 text-neutral-400 sm:block" strokeWidth={1.5} />
              <ul aria-label="Three service layers" className="grid gap-2.5">
                {["Access & Guidance", "Learning & Trust", "Opportunity & Community"].map((layer) => (
                  <li key={layer} className="rounded-xl bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-950 ring-1 ring-cyan-900/10">
                    {layer}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 rounded-xl bg-[#faf9f7] p-5 ring-1 ring-neutral-900/[0.06]">
              <p className="t-eyebrow text-neutral-500">My role</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-neutral-700">
                As the project developed, I increasingly took a synthesis role, comparing what each
                direction was actually solving and helping translate several different concepts
                into a coherent experience.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 05 Solution ═══════════════════════════════════════════════ */}
      <section className="section-y bg-[#faf9f7]">
        <div className="shell">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Label index="05" className="justify-center">
              The solution
            </Label>
            <h2 className="t-h2 mt-6 text-neutral-950">
              One ecosystem.
              <br />
              <em className="text-cyan-800">Three connected touchpoints.</em>
            </h2>
          </Reveal>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <ol className="space-y-8 lg:col-span-7">
              {TOUCHPOINTS.map(({ title, body }, i) => (
                <li key={title}>
                  <Reveal delay={i * 0.06} className="grid gap-2 border-t border-neutral-900/10 pt-6 sm:grid-cols-[4rem_1fr]">
                    <span className="tabular font-serif text-3xl leading-none text-cyan-800">0{i + 1}</span>
                    <div>
                      <h3 className="font-serif text-2xl leading-snug text-neutral-950">{title}</h3>
                      <p className="mt-2 max-w-[34rem] text-[0.9375rem] leading-relaxed text-neutral-600">{body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Reveal delay={0.1} className="mx-auto w-full max-w-[22rem] lg:col-span-5">
              <Figure
                media={media("ck-tickets")}
                alt="Export-ready family of four Creative Key tickets with QR codes"
                caption="The printed key family: four routes, one handoff to mobile."
                sizes="22rem"
                frameClassName="rounded-2xl bg-white p-4 ring-1 ring-neutral-900/10 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)]"
              />
            </Reveal>
          </div>

          <ul className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {KEYS.map(({ name, label, accent }, i) => (
              <li key={name}>
                <Reveal delay={i * 0.06} className="overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-900/10">
                  <Figure media={media(name)} alt={`${label} ticket design`} sizes="(min-width: 1024px) 280px, 45vw" />
                  <p className="border-t border-neutral-900/[0.06] px-4 py-3 text-sm font-semibold" style={{ color: accent }}>
                    {label}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 06 Wave Rib ═══════════════════════════════════════════════ */}
      <section className="on-dark section-y text-white" style={{ background: NAVY }}>
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <Label index="06" dark>The Wave Rib</Label>
            <h2 className="t-h2 mt-6">Making creative technology visible in the physical environment</h2>
            <div className="mt-7 max-w-[38rem] space-y-5 text-[1.0625rem] leading-[1.7] text-white/70">
              <p>
                The kiosk evolved from a generic information terminal into a more distinctive piece
                of the creative environment. Its ribbed wave form references sound, movement and
                performance while creating a recognisable physical landmark.
              </p>
              <p>
                During development I weighed screen placement, QR visibility, Creative Key output,
                reach, maintenance access, ventilation, paper refill, wall mounting, lighting and
                fabrication. Each constraint changed the form rather than being added to it.
              </p>
            </div>
            <ul className="mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-2.5">
              {["Screen placement", "QR visibility", "Card/ticket output", "Maintenance access", "Ventilation", "Paper refill", "Wall mounting", "Lighting"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-white/75">
                  <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full" style={{ background: CYAN }} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[38rem] rounded-xl bg-white/[0.04] p-5 text-sm leading-relaxed text-white/65 ring-1 ring-white/10">
              AI-assisted visual studies were used as divergent prompts during early form
              exploration. Final selection, refinement and implementation decisions were made
              through human design judgement.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6">
            <Figure
              media={media("ck-waverib")}
              alt="Refining the Wave Rib: kiosk form studies and implementation constraints"
              caption="Refining the Wave Rib form against real implementation constraints."
              captionClassName="text-white/60"
              sizes="(min-width: 1024px) 560px, 100vw"
              frameClassName="rounded-2xl ring-1 ring-white/10"
            />
          </Reveal>
        </div>
      </section>

      {/* ══ 07 Cross-device journey ═══════════════════════════════════ */}
      <section className="section-y">
        <div className="shell">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-6">
              <Label index="07">Cross-device journey</Label>
              <h2 className="t-h2 mt-6 text-neutral-950">The experience should continue, not restart.</h2>
              <div className="mt-7 max-w-[38rem] space-y-5 text-[1.0625rem] leading-[1.7] text-neutral-700">
                <p>
                  I treated the kiosk, Creative Key and mobile companion as one service journey
                  rather than three separate products. The kiosk supports public discovery, the
                  Creative Key provides continuity, and the mobile companion handles longer,
                  personalised and private interactions.
                </p>
                <p>
                  This also reduced the need to enter personal information on a public kiosk, a
                  privacy and safety consideration that shaped the architecture of the whole
                  system.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-6">
              <ul className="flex items-end justify-center gap-[4%]">
                {PHONES.map(({ name, label }, i) => (
                  <li key={name} className={`w-[30%] max-w-[11.5rem] ${i === 1 ? "" : "mb-8"}`}>
                    <div className="overflow-hidden rounded-[1.6rem] bg-[#07111f] shadow-[0_30px_60px_-24px_rgba(15,23,42,0.55)] ring-1 ring-neutral-900/10">
                      <Img media={media(name)} alt={`Creative Key mobile companion: ${label.toLowerCase()}`} sizes="(min-width: 1024px) 184px, 30vw" className="block h-auto w-full" />
                    </div>
                    <p className="t-caption mt-3 text-center text-neutral-600">{label}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="mt-16 lg:mt-20">
            <Figure
              media={media("ck-storyboard")}
              alt="Ten-screen mobile journey storyboard, end to end"
              caption="Ten-screen mobile journey, end to end. Select the image to view it larger."
              sizes="(min-width: 1280px) 1200px, 100vw"
              frameClassName="rounded-2xl ring-1 ring-neutral-900/10"
            />
          </Reveal>
        </div>
      </section>

      {/* ══ 08 Prototyping ════════════════════════════════════════════ */}
      <section className="section-y bg-[#faf9f7]">
        <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <Figure
              media={media("ck-kiosk-detail")}
              alt="Close-up of the lo-fi cardboard kiosk: a hand-drawn ‘Choose your next step’ screen, card slot and QR code"
              caption="Lo-fi kiosk: hand-drawn screen, Creative Key card slot and QR handoff."
              sizes="(min-width: 1024px) 460px, 90vw"
              frameClassName="rounded-2xl ring-1 ring-black/5 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.5)]"
            />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-7">
            <Label index="08">Prototyping &amp; iteration</Label>
            <h2 className="t-h2 mt-6 text-neutral-950">The physical concept changed once implementation became real</h2>
            <p className="mt-6 max-w-[38rem] text-[1.0625rem] leading-[1.7] text-neutral-700">
              A formative review with MakerSpace staff exposed questions that polished visuals
              could not answer. Key changes shaped the final design:
            </p>
            <ul className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {CHANGES.map((change) => (
                <li key={change} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-neutral-700">
                  <ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-cyan-700" strokeWidth={1.75} />
                  {change}
                </li>
              ))}
            </ul>
            <figure className="mt-9 border-l-2 border-neutral-300 pl-6">
              <figcaption className="t-eyebrow text-neutral-500">Reflection</figcaption>
              <blockquote className="mt-2 font-serif text-xl leading-snug text-neutral-800">
                One of my biggest lessons was that implementation is not separate from UX.
                Maintenance, staffing and physical constraints are part of the user experience.
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ══ 09 Ethics ═════════════════════════════════════════════════ */}
      <section className="section-y">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Label index="09">Ethical design</Label>
              <h2 className="t-h2 mt-6 text-neutral-950">Access without creating another gate</h2>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-7 lg:pt-12">
              <p className="max-w-[40rem] text-[1.0625rem] leading-[1.7] text-neutral-700">
                The project changed how I understood access. Making something available is not the
                same as making participation feel possible. Confidence, permission, safety, staff
                capacity and belonging all influence whether someone can actually engage.
              </p>
            </Reveal>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TENSIONS.map(([a, b], i) => (
              <li key={a}>
                <Reveal delay={i * 0.06} className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-[#faf9f7] px-6 py-8 text-center ring-1 ring-neutral-900/[0.06]">
                  <p className="font-serif text-xl text-neutral-950">{a}</p>
                  <p className="t-eyebrow flex items-center gap-3 text-neutral-500">
                    <span aria-hidden="true" className="h-px w-6 bg-neutral-300" />
                    in tension with
                    <span aria-hidden="true" className="h-px w-6 bg-neutral-300" />
                  </p>
                  <p className="font-serif text-xl text-neutral-950">{b}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 10 Contribution ═══════════════════════════════════════════ */}
      <section className="on-dark section-y text-white" style={{ background: NAVY }}>
        <div className="shell">
          <Reveal className="max-w-3xl">
            <Label index="10" dark>Contribution</Label>
            <h2 className="t-h2 mt-6">My role in the project</h2>
            <p className="t-lead mt-6 text-white/70">
              My strongest contribution was often making complexity visible: translating research,
              concepts and implementation constraints into diagrams, journeys and visual systems
              that helped the team move toward a coherent final experience.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {CONTRIBUTION.map(({ tier, color, items }, i) => (
              <Reveal key={tier} delay={i * 0.08} className="rounded-2xl bg-white/[0.04] p-7 ring-1 ring-white/10">
                <h3 className="t-eyebrow flex items-center gap-2.5" style={{ color }}>
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: color }} />
                  {tier}
                </h3>
                <ul className="mt-6 space-y-3">
                  {items.map((item) => (
                    <li key={item} className="text-[0.9375rem] leading-snug text-white/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 11 Reflections ════════════════════════════════════════════ */}
      <section className="section-y">
        <div className="shell">
          <Reveal>
            <Label index="11">Reflections</Label>
            <h2 className="t-h2 mt-6 max-w-3xl text-neutral-950">What this project changed in my practice</h2>
          </Reveal>
          <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {LESSONS.map(([title, body], i) => (
              <li key={title}>
                <Reveal delay={(i % 2) * 0.06} className="border-t border-neutral-900/10 pt-6">
                  <span className="tabular text-sm font-medium text-cyan-800">0{i + 1}</span>
                  <h3 className="mt-3 font-serif text-2xl leading-snug text-neutral-950">{title}</h3>
                  <p className="mt-2.5 max-w-[34rem] text-[0.9375rem] leading-relaxed text-neutral-600">{body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ Full project CTA ══════════════════════════════════════════ */}
      <section className="on-dark relative isolate overflow-hidden text-white" style={{ background: NAVY }}>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,211,238,0.10),transparent_60%)]" />
        <div className="shell section-y-sm">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="t-h2">Want to see the complete process?</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              The full academic portfolio documents the research, ideation, co-design, prototyping
              and implementation process in greater depth.
            </p>
            <a
              href={FULL_PROJECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-9 inline-flex min-h-12 items-center gap-2.5 rounded-full px-7 text-sm font-semibold text-[#0b0f1a] transition-[filter,transform] duration-200 ease-out-quint hover:brightness-110 active:scale-[0.98]"
              style={{ background: CYAN }}
            >
              View the full HCI project on Canva
              <ExternalLink className={`h-4 w-4 ${arrowNudge}`} strokeWidth={2} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Reveal>
        </div>
      </section>

      <NextProject current="creative-key" />
    </div>
  )
}
