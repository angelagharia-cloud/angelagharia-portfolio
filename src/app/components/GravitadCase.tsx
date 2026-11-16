import { motion } from "motion/react"
import { Check, Eye, Layers3, Route } from "lucide-react"
import { media, type MediaName } from "../lib/media"
import { PROJECT_MAP } from "../lib/projects"
import { DURATION, EASE_OUT } from "../lib/motion"
import { Figure } from "./system/Figure"
import { BrowserFrame } from "./system/BrowserFrame"
import { Reveal } from "./system/Reveal"
import { SectionLabel } from "./system/SectionLabel"
import { NextProject } from "./case/CaseKit"

const project = PROJECT_MAP.gravitad
const BLUE = project.accent

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.intro, ease: EASE_OUT, delay },
})

const reviewed = [
  {
    title: "Content creation",
    body: "The path from a broad dashboard choice to content type, channel settings and a usable result.",
  },
  {
    title: "System feedback",
    body: "How generated content, status and follow-up actions are explained without adding more uncertainty.",
  },
  {
    title: "History & reuse",
    body: "How people find earlier work, understand its state and return to the right next action.",
  },
]

const process = [
  ["Map the product", "I reviewed the brief, intended audiences, technical context and the key user and admin journeys."],
  ["Trace the tasks", "I followed creation from entry point to result and checked where labels, hierarchy or state changed unexpectedly."],
  ["Prioritise risk", "I separated immediate usability fixes from deeper structural improvements so the feedback could be acted on."],
  ["Make it usable", "I translated the findings into concise recommendations for discussion with technical stakeholders."],
]

const screens: { name: MediaName; title: string; caption: string }[] = [
  {
    name: "gv-generate",
    title: "Choose a content type",
    caption: "The journey asks people to classify the output before the product has established a clear task sequence.",
  },
  {
    name: "gv-parameters",
    title: "Configure the essentials",
    caption: "Message and channel settings add useful control, but increase decision load before value is visible.",
  },
  {
    name: "gv-result",
    title: "Review the generated result",
    caption: "The output needs a clearer relationship between generated content, evaluation and the next action.",
  },
  {
    name: "gv-history",
    title: "Return to previous work",
    caption: "History closes the loop only when people can quickly understand state, recency and available actions.",
  },
]

const findings = [
  {
    icon: Route,
    observation: "The journey asks people to make several disconnected decisions before they see the value of the output.",
    risk: "New or non-technical users can lose confidence before generation begins.",
    response: "Use one visible sequence with essentials first and advanced controls revealed only when needed.",
  },
  {
    icon: Eye,
    observation: "Navigation, content settings and result actions compete at similar visual weights.",
    risk: "The interface makes scanning harder and weakens the primary action on each screen.",
    response: "Give every stage one dominant task, then group supporting controls by intent.",
  },
  {
    icon: Layers3,
    observation: "Creation, evaluation and history are connected in the system but not consistently in the mental model.",
    risk: "People have to remember where work lives and what to do after generation.",
    response: "Connect create → review → refine → save, with a stable status and next action throughout.",
  },
]

const recommendations = [
  ["Reframe the content journey", "Make the sequence explicit: choose → configure → generate → review → refine → save or export."],
  ["Reduce early decisions", "Keep advanced parameters available, but move them behind progressive disclosure until they are relevant."],
  ["Separate creation from evaluation", "Keep analysis adjacent to the output while visually distinguishing it from the writing workspace."],
  ["Design the states, not only the screens", "Include focus, errors, loading, empty states and readable system feedback in the interaction model."],
  ["Validate the language", "Test whether labels, AI terminology and recommendations are understandable without specialist knowledge."],
]

const values = [
  ["Systems thinking", "I connected navigation, task flow, feedback, history and accessibility rather than treating each screen as an isolated UI.", "bg-[#e8f3e8]"],
  ["Technical collaboration", "The recommendations were grounded in a real React, Tailwind and Zustand product context.", "bg-[#e5f0fc]"],
  ["Evidence discipline", "The case study distinguishes the supplied interface, my audit work and the later portfolio reconstruction.", "bg-[#f7ede3]"],
]

function Section({
  index,
  label,
  children,
  className = "",
  dark = false,
}: {
  index: string
  label: string
  children: React.ReactNode
  className?: string
  dark?: boolean
}) {
  return (
    <section className={`section-y ${dark ? "on-dark" : ""} ${className}`}>
      <div className="shell">
        <Reveal>
          <SectionLabel index={index} accent={dark ? "#9cc5ff" : BLUE} tone={dark ? "dark" : "light"}>
            {label}
          </SectionLabel>
        </Reveal>
        {children}
      </div>
    </section>
  )
}

const h2 = "mt-6 max-w-4xl text-[clamp(1.875rem,1.4rem+1.9vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.035em]"

export function GravitadCase() {
  return (
    <article className="bg-[#f7f4ed] text-[#131315]">
      {/* Hero */}
      <header className="pt-16">
        <div className="shell pt-12 sm:pt-16 lg:pt-20">
          <motion.div {...enter(0)}>
            <SectionLabel index={project.index} accent={BLUE}>
              Professional client work
            </SectionLabel>
          </motion.div>
          <motion.h1
            {...enter(0.06)}
            className="mt-7 max-w-[17ch] text-[clamp(2.5rem,1.6rem+4vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.045em]"
          >
            Making an AI-heavy platform feel clear, useful and human.
          </motion.h1>
          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <motion.div {...enter(0.14)} className="lg:col-span-7">
              <p className="text-base font-semibold sm:text-lg" style={{ color: BLUE }}>
                Gravitad · UX/UI consultancy · AI content platform
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#4f4f55] sm:text-xl">
                I audited a live product journey spanning content generation, result review and
                history, then translated the highest-risk usability issues into prioritised
                recommendations for the team.
              </p>
            </motion.div>
            <motion.dl {...enter(0.2)} className="grid grid-cols-2 gap-x-6 gap-y-5 self-end border-t border-[#d1cfc7] pt-6 lg:col-span-5">
              {[
                ["Role", "Freelance UX/UI Designer / Consultant"],
                ["Deliverable", "UX audit and prioritised recommendations"],
                ["Platform", "Responsive web, with mobile considerations"],
                ["Tech context", "React · Tailwind CSS · Zustand"],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt className="t-eyebrow text-[#5c5c61]">{term}</dt>
                  <dd className="mt-1.5 text-[0.9375rem] font-medium leading-snug">{detail}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.28 }}
            className="mt-14 lg:mt-16"
          >
            <BrowserFrame className="shadow-[0_40px_80px_-40px_rgba(19,19,21,0.35)]">
              <Figure
                media={media("gv-dashboard")}
                alt="Gravitad dashboard with several content-creation entry points"
                sizes="(min-width: 1280px) 1200px, 100vw"
                priority
              />
            </BrowserFrame>
            <p className="t-caption mt-4 max-w-3xl text-[#5c5c61]">
              <span className="font-semibold text-[#131315]">01 · Dashboard and entry points.</span>{" "}
              The first screen exposes several routes at once, making the starting decision an
              important hierarchy problem.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Brief */}
      <Section index="01" label="The brief">
        <div className="mt-9 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className={h2}>
              Help a broad audience move through a capable product without making them learn the
              system first.
            </h2>
            <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.7] text-[#4f4f55]">
              The platform brought content generation, channel-specific parameters, generated
              results and history into one product. My task was to identify where that capability
              became friction and make the recommendations useful to the people building it.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="rounded-2xl border border-[#d1cfc7] bg-white p-6 sm:p-7">
              <p className="t-eyebrow" style={{ color: BLUE }}>
                My contribution
              </p>
              <ul className="mt-5 space-y-3.5 text-[0.9375rem] leading-relaxed text-[#3f3f44]">
                {[
                  "Reviewed the supplied product interfaces and key user journey",
                  "Identified hierarchy, navigation and comprehension risks",
                  "Prioritised immediate fixes and structural opportunities",
                  "Delivered audit findings and UX recommendations",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0" style={{ color: BLUE }} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-[#e6e3db] pt-5 text-sm leading-relaxed text-[#5c5c61]">
                <span className="font-semibold text-[#131315]">Evidence boundary:</span> implementation
                and measured impact are not verified.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Interface evidence */}
      <Section index="02" label="Interface evidence" dark className="bg-[#1c1f24] text-white">
        <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <h2 className={h2}>I followed the real creation journey, not an idealised flow.</h2>
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-5">
            <p className="text-[0.9375rem] leading-relaxed text-[#c3c5cc]">
              These original project exports document the interface I reviewed. They are shown as
              audit context; I do not claim screen authorship or a production release.
            </p>
          </Reveal>
        </div>
        <ol className="mt-12 grid gap-6 lg:grid-cols-2">
          {screens.map(({ name, title, caption }, i) => (
            <li key={name}>
              <Reveal delay={(i % 2) * 0.08} className="h-full overflow-hidden rounded-2xl bg-[#25282f] ring-1 ring-white/10">
                <BrowserFrame className="rounded-none ring-0">
                  <Figure media={media(name)} alt={`Gravitad interface: ${title.toLowerCase()}`} sizes="(min-width: 1024px) 600px, 100vw" />
                </BrowserFrame>
                <div className="grid gap-2 p-6 sm:grid-cols-[2.75rem_1fr]">
                  <span className="tabular text-sm font-semibold text-[#9cc5ff]">{String(i + 2).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-bold text-white">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#c3c5cc]">{caption}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* Scope */}
      <Section index="03" label="Scope of review">
        <Reveal>
          <h2 className={h2}>Three connected experiences needed to feel like one product.</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reviewed.map(({ title, body }, i) => (
            <Reveal key={title} delay={i * 0.06} className="rounded-2xl border border-[#d1cfc7] bg-white p-6 sm:p-7">
              <span className="tabular text-sm font-semibold" style={{ color: BLUE }}>0{i + 1}</span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[#4f4f55]">{body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Approach */}
      <Section index="04" label="My approach" className="bg-[#e5f0fc]">
        <Reveal>
          <h2 className={h2}>Audit the journey before polishing the screen.</h2>
        </Reveal>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {process.map(([title, body], i) => (
            <li key={title}>
              <Reveal delay={i * 0.06} className="h-full rounded-2xl border border-[#bdd0e8] bg-white/85 p-6">
                <span className="tabular text-sm font-semibold" style={{ color: BLUE }}>0{i + 1}</span>
                <h3 className="mt-3 text-lg font-bold">{title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[#4f4f55]">{body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* Findings */}
      <Section index="05" label="High-signal findings">
        <Reveal>
          <h2 className={h2}>The product needed a clearer mental model, not more explanation.</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {findings.map(({ icon: Icon, observation, risk, response }, i) => (
            <Reveal key={observation} delay={i * 0.06} className="flex flex-col rounded-2xl border border-[#d1cfc7] bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5f0fc]" style={{ color: BLUE }}>
                  <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
                </span>
                <span className="tabular text-sm font-semibold text-[#6b6b71]">0{i + 1}</span>
              </div>
              <p className="mt-6 text-base font-semibold leading-relaxed">{observation}</p>
              <div className="mt-6 border-t border-[#e6e3db] pt-5">
                <p className="t-eyebrow text-[#9a4b35]">Why it matters</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#4f4f55]">{risk}</p>
              </div>
              <div className="mt-5 rounded-xl bg-[#f1f6fd] p-4 lg:mt-auto">
                <p className="t-eyebrow" style={{ color: BLUE }}>Recommendation</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#36506f]">{response}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Proposed workflow */}
      <Section index="06" label="Proposed workflow" className="bg-[#e5f0fc]">
        <Reveal>
          <h2 className={h2}>Separate writing from evaluation, then make the next action obvious.</h2>
          <p className="mt-5 max-w-3xl text-[0.9375rem] leading-relaxed text-[#4f4f55]">
            This portfolio-safe reconstruction communicates the recommendation. It is not a
            reproduction of a shipped client screen.
          </p>
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <div
            role="img"
            aria-label="Concept illustration: a sidebar with Dashboard, Generate, Review and History, three stages labelled Create, Review and Evaluate, and a persistent next-action panel with progress."
            className="pointer-events-none overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-40px_rgba(5,40,90,0.4)] ring-1 ring-[#b9cde7] select-none"
          >
            <div aria-hidden="true" className="flex items-center justify-between border-b border-black/[0.06] bg-[#f5f5f2] px-3.5 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f26157]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#f2b042]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#59b86e]" />
              </div>
              <span className="t-eyebrow text-[#6b6b71]">Concept illustration</span>
            </div>
            <div aria-hidden="true" className="grid md:grid-cols-[11rem_1fr]">
              <div className="flex gap-1 overflow-hidden bg-[#1c1f24] p-3 text-xs text-[#bfc2cc] md:block md:p-5">
                <p className="mb-4 hidden font-bold tracking-wide text-white md:block">AI CONTENT</p>
                {["Dashboard", "Generate", "Review", "History"].map((item) => (
                  <div key={item} className={`rounded-lg px-3 py-2.5 md:mb-1 ${item === "Generate" ? "bg-[#055cbf] font-semibold text-white" : ""}`}>
                    {item}
                  </div>
                ))}
              </div>
              <div className="bg-[#fbfbfa] p-4 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                  {[
                    ["1. Create", "Choose a goal and configure the essentials."],
                    ["2. Review", "Edit the output while retaining task context."],
                    ["3. Evaluate", "Open analysis when it supports a decision."],
                  ].map(([title, body]) => (
                    <div key={title} className="rounded-xl border border-[#d1cfc7] bg-white p-4 sm:p-5">
                      <p className="font-bold">{title}</p>
                      <p className="mt-2 text-xs leading-5 text-[#5c5c61]">{body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-xl border border-[#d1cfc7] bg-white p-4 sm:mt-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-wide" style={{ color: BLUE }}>NEXT ACTION</p>
                      <p className="mt-1 font-bold">Refine, save or export the result</p>
                    </div>
                    <span className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold text-white" style={{ backgroundColor: BLUE }}>
                      Continue
                    </span>
                  </div>
                  <div className="mt-5 h-2 rounded-full bg-[#dce9fa]">
                    <div className="h-2 w-2/3 rounded-full" style={{ backgroundColor: BLUE }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Deliverable */}
      <Section index="07" label="Deliverable">
        <Reveal>
          <h2 className={h2}>From observations to decisions the team could use.</h2>
        </Reveal>
        <ol className="mt-10 border-t border-[#d1cfc7]">
          {recommendations.map(([title, body], i) => (
            <li key={title} className="border-b border-[#d1cfc7]">
              <Reveal delay={0.03 * i} className="grid gap-2 py-6 sm:grid-cols-[3.5rem_1fr] sm:py-7">
                <span className="tabular text-sm font-semibold" style={{ color: BLUE }}>0{i + 1}</span>
                <div className="max-w-3xl">
                  <h3 className="text-xl font-bold tracking-[-0.01em]">{title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[#4f4f55]">{body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal className="mt-8 rounded-xl border border-[#b9cde7] bg-[#eef5fd] p-5 text-[0.9375rem] leading-relaxed text-[#36506f] sm:p-6">
          <strong className="text-[#131315]">Verified outcome:</strong> I delivered UX audits and
          recommendations. Implementation, production release and measured product outcomes
          remain unverified.
        </Reveal>
      </Section>

      {/* What it demonstrates */}
      <Section index="08" label="What this work demonstrates" className="bg-[#f0ece3]">
        <Reveal>
          <h2 className={h2}>
            Professional UX is often less about drawing another screen and more about making the
            right decisions clear.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {values.map(([title, body, color], i) => (
            <Reveal key={title} delay={i * 0.06} className={`rounded-2xl border border-[#d1cfc7] p-6 sm:p-7 ${color}`}>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[#4f4f55]">{body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <NextProject current="gravitad" />
    </article>
  )
}
