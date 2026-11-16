import type { ReactNode } from "react"

interface SectionLabelProps {
  index?: string
  children: ReactNode
  tone?: "light" | "dark"
  accent?: string
  className?: string
}

/** Editorial section label: "01 —— Selected work". Shared by the homepage and every case study. */
export function SectionLabel({
  index,
  children,
  tone = "light",
  accent,
  className = "",
}: SectionLabelProps) {
  return (
    <p
      className={`t-eyebrow flex items-center gap-3 ${
        tone === "dark" ? "text-white/65" : "text-neutral-500"
      } ${className}`}
    >
      {index && (
        <>
          <span
            className="tabular"
            style={accent ? { color: accent } : undefined}
          >
            {index}
          </span>
          <span aria-hidden="true" className="h-px w-7 bg-current opacity-40" />
        </>
      )}
      <span>{children}</span>
    </p>
  )
}
