import { motion } from "motion/react"
import { EASE_OUT } from "../../lib/motion"

/** Reported descriptive statistics from the study (n = 32 per condition). */
export const MODALITY_DATA = [
  { label: "Auditory", mean: 67.94, sd: 11.05, se: 1.95, n: 32, color: "#0f766e" },
  { label: "Visual", mean: 46.63, sd: 11.8, se: 2.09, n: 32, color: "#b45309" },
] as const

const MAX = 80
const TICKS = [0, 20, 40, 60, 80]

interface ModalityChartProps {
  variant?: "card" | "full"
  className?: string
}

/**
 * Re-plot of the reported means with ±1 SE whiskers. The original poster mixed
 * n, mean, SD and SE on one axis; this isolates the comparison that matters.
 */
export function ModalityChart({ variant = "full", className = "" }: ModalityChartProps) {
  const full = variant === "full"
  return (
    <motion.div
      // The container triggers the reveal: zero-height (scaleY 0) bars can't be observed.
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      role="img"
      aria-label="Bar chart. Mean Tetris score was 67.94 with auditory interruptions and 46.63 with visual interruptions. Error bars show one standard error."
      className={`flex flex-col ${className}`}
    >
      <div className={`relative flex-1 ${full ? "min-h-[16rem]" : ""}`}>
        {/* Grid */}
        <div aria-hidden="true" className="absolute inset-0">
          {TICKS.map((tick) => (
            <div
              key={tick}
              className="absolute inset-x-0 flex items-center gap-3"
              style={{ bottom: `${(tick / MAX) * 100}%` }}
            >
              <span
                className={`tabular w-6 shrink-0 text-right text-neutral-500 ${
                  full ? "text-xs" : "text-[0.6875rem]"
                }`}
              >
                {tick}
              </span>
              <span className="h-px flex-1 bg-neutral-900/10" />
            </div>
          ))}
        </div>
        {/* Bars */}
        <div className="absolute inset-y-0 right-0 left-9 flex items-end justify-around px-[8%]">
          {MODALITY_DATA.map((d, i) => (
            <div
              key={d.label}
              className="relative flex h-full w-[30%] max-w-[7.5rem] flex-col justify-end"
            >
              <motion.div
                variants={{
                  hidden: { scaleY: 0 },
                  shown: {
                    scaleY: 1,
                    transition: { duration: 1, ease: EASE_OUT, delay: 0.15 + i * 0.12 },
                  },
                }}
                className="relative origin-bottom rounded-t-md"
                style={{ height: `${(d.mean / MAX) * 100}%`, backgroundColor: d.color }}
              >
                {/* ±1 SE whisker */}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 w-px -translate-x-1/2 bg-neutral-900/70"
                  style={{
                    top: `${-(d.se / d.mean) * 100}%`,
                    height: `${((2 * d.se) / d.mean) * 100}%`,
                  }}
                >
                  <span className="absolute -left-1.5 top-0 h-px w-3 bg-neutral-900/70" />
                  <span className="absolute -left-1.5 bottom-0 h-px w-3 bg-neutral-900/70" />
                </span>
              </motion.div>
              <motion.span
                variants={{
                  hidden: { opacity: 0 },
                  shown: { opacity: 1, transition: { duration: 0.4, delay: 0.75 + i * 0.12 } },
                }}
                className={`tabular absolute inset-x-0 text-center font-semibold text-neutral-900 ${
                  full ? "text-sm" : "text-xs"
                }`}
                style={{ bottom: `calc(${(d.mean / MAX) * 100}% + ${full ? 14 : 10}px)` }}
              >
                {d.mean.toFixed(2)}
              </motion.span>
            </div>
          ))}
        </div>
      </div>
      <div className={`ml-9 flex justify-around px-[8%] ${full ? "mt-3" : "mt-2"}`}>
        {MODALITY_DATA.map((d) => (
          <span
            key={d.label}
            className={`w-[30%] max-w-[7.5rem] text-center font-medium text-neutral-700 ${
              full ? "text-sm" : "text-xs"
            }`}
          >
            {d.label}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
