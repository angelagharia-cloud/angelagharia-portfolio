import type { ReactNode } from "react"

/** Lightweight browser chrome for product screenshots (crisp at any width). */
export function BrowserFrame({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`overflow-hidden rounded-xl bg-white ring-1 ring-black/10 ${className}`}>
      <div
        aria-hidden="true"
        className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#f5f5f2] px-3.5 py-2.5"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#f26157]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f2b042]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#59b86e]" />
      </div>
      {children}
    </div>
  )
}
