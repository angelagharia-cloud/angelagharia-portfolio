import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react"
import { SectionLabel } from "./system/SectionLabel"

const EMAIL = "angelagharia@gmail.com"
const PHONE = "+353 89 222 5859"
const LINKEDIN = "https://www.linkedin.com/in/angel-agharia"

export function ContactFooter() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2400)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <footer
      id="contact"
      className="on-dark relative isolate overflow-hidden bg-[#111114] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 right-[-12%] -z-10 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.2),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-18rem] left-[-10%] -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(236,72,153,0.12),transparent)]"
      />

      <div className="shell section-y">
        <SectionLabel tone="dark">Contact</SectionLabel>

        <div className="mt-8 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="t-h2 text-white">
              Let’s make something
              <br />
              <em className="bg-gradient-to-r from-sky-300 via-violet-300 to-pink-300 bg-clip-text pr-[0.08em] text-transparent">
                useful.
              </em>
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">
              I’m looking for junior product design, UX/UI and UX research
              roles where I can turn evidence into clear, useful experiences.
            </p>
            <p className="mt-3 max-w-xl text-white/60">
              Open to full-time graduate roles, internships and freelance
              projects.
            </p>
          </div>

          <div className="min-w-0 lg:col-span-5 lg:pt-2">
            <p className="t-eyebrow text-white/60">Email</p>
            <a
              href={`mailto:${EMAIL}`}
              className="link-underline mt-3 inline [overflow-wrap:anywhere] font-serif text-[clamp(1.5rem,1.15rem+1.3vw,2.125rem)] leading-snug text-white"
            >
              {EMAIL}
            </a>
            <div className="mt-6">
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-medium text-white/85 transition-[border-color,color,background-color,transform] duration-200 ease-out-quint hover:border-white/40 hover:bg-white/5 hover:text-white active:scale-[0.97]"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={copied ? "done" : "copy"}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.18 }}
                    className="flex"
                  >
                    {copied ? (
                      <Check
                        className="h-4 w-4 text-emerald-300"
                        strokeWidth={2}
                      />
                    ) : (
                      <Copy className="h-4 w-4" strokeWidth={1.75} />
                    )}
                  </motion.span>
                </AnimatePresence>
                {copied ? "Copied to clipboard" : "Copy email address"}
              </button>
              <span role="status" aria-live="polite" className="sr-only">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>

            <ul className="mt-10 border-t border-white/10">
              <ContactRow
                label="Phone"
                value={PHONE}
                href={`tel:${PHONE.replace(/\s/g, "")}`}
              />
              <ContactRow
                label="LinkedIn"
                value="Angel Agharia"
                href={LINKEDIN}
                external
              />
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col-reverse gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between lg:mt-28">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Angel Agharia · UX/UI & Product
            Designer
          </p>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                  .matches
                  ? "instant"
                  : "smooth",
              })
            }
            className="group -ml-2 inline-flex min-h-11 items-center gap-2 self-start rounded-full px-2 text-sm text-white/70 transition-colors duration-200 hover:text-white sm:ml-0 sm:self-auto"
          >
            Back to top
            <ArrowUp
              className="h-4 w-4 transition-transform duration-300 ease-out-quint group-hover:-translate-y-0.5"
              strokeWidth={1.75}
            />
          </button>
        </div>
      </div>
    </footer>
  )
}

function ContactRow({
  label,
  value,
  href,
  external = false,
}: {
  label: string
  value: string
  href: string
  external?: boolean
}) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex min-h-16 items-center justify-between gap-6 border-b border-white/10 py-4"
      >
        <span className="text-sm text-white/60">{label}</span>
        <span className="flex items-center gap-2 text-right text-white/90 transition-colors duration-200 group-hover:text-white">
          {value}
          {external && <span className="sr-only">(opens in a new tab)</span>}
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 text-white/45 transition-[transform,color] duration-300 ease-out-quint group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
            strokeWidth={1.75}
          />
        </span>
      </a>
    </li>
  )
}
