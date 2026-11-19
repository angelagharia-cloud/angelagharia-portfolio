import {
  createContext,
  useContext,
  type AnchorHTMLAttributes,
  type MouseEvent,
} from "react"
import type { Page } from "./projects"

export type Section = "work" | "about" | "contact"

export interface NavApi {
  page: Page
  navigate: (to: Page, options?: { section?: Section }) => void
  /** Returns to the work list, restoring the previous scroll position when possible. */
  backToWork: () => void
  scrollToSection: (section: Section) => void
  preload: (to: Page) => void
}

export const NavContext = createContext<NavApi | null>(null)

export function useNav() {
  const api = useContext(NavContext)
  if (!api) throw new Error("useNav must be used inside NavContext")
  return api
}

export const hrefFor = (to: Page, section?: Section) =>
  to === "home" ? (section ? `#/${section}` : "#/") : `#/${to}${section === "contact" ? "/contact" : ""}`

export const isPlainClick = (event: MouseEvent<HTMLAnchorElement>) =>
  !event.defaultPrevented &&
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: Page
  section?: Section
}

/** Real anchor (open in new tab, copy link) with in-app navigation on plain clicks. */
export function Link({
  to,
  section,
  onClick,
  onPointerEnter,
  onFocus,
  ...rest
}: LinkProps) {
  const { navigate, preload } = useNav()
  return (
    <a
      href={hrefFor(to, section)}
      onClick={(event) => {
        onClick?.(event)
        if (!isPlainClick(event)) return
        event.preventDefault()
        navigate(to, { section })
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        preload(to)
      }}
      onFocus={(event) => {
        onFocus?.(event)
        preload(to)
      }}
      {...rest}
    />
  )
}
