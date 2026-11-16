import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from "react"
import { flushSync } from "react-dom"
import { MotionConfig } from "motion/react"
import { Navigation } from "./components/Navigation"
import { HomePage } from "./components/HomePage"
import { ContactFooter } from "./components/ContactFooter"
import { NavContext, hrefFor, type NavApi, type Section } from "./lib/router"
import {
  PROJECT_MAP,
  SITE_DESCRIPTION,
  SITE_TITLE,
  isProjectId,
  type Page,
  type ProjectId,
} from "./lib/projects"

export type { Page } from "./lib/projects"

type CaseModule = Promise<{ default: ComponentType }>

// Case studies load on demand; links prefetch them on hover or focus.
const loaders: Record<ProjectId, () => CaseModule> = {
  "creative-key": () =>
    import("./components/CreativeKeyCase").then((m) => ({
      default: m.CreativeKeyCase,
    })),
  gravitad: () =>
    import("./components/GravitadCase").then((m) => ({
      default: m.GravitadCase,
    })),
  "stammer-halo": () =>
    import("./components/StammerHaloCase").then((m) => ({
      default: m.StammerHaloCase,
    })),
  smartmeal: () =>
    import("./components/SmartMealCase").then((m) => ({
      default: m.SmartMealCase,
    })),
  "interruption-study": () =>
    import("./components/InterruptionStudyCase").then((m) => ({
      default: m.InterruptionStudyCase,
    })),
  "ucd-campus": () =>
    import("./components/UCDCampusCase").then((m) => ({
      default: m.UCDCampusCase,
    })),
}

const CASES = Object.fromEntries(
  (Object.keys(loaders) as ProjectId[]).map((id) => [id, lazy(loaders[id])]),
) as unknown as Record<ProjectId, LazyExoticComponent<ComponentType>>

const preloadPage = (to: Page): Promise<unknown> =>
  to === "home" ? Promise.resolve() : loaders[to]().catch(() => undefined)

const SECTIONS: Section[] = ["work", "about", "contact"]

function parseHash(hash: string): { page: Page; section?: Section } {
  const route = hash.replace(/^#\/?/, "")
  if (isProjectId(route)) return { page: route }
  if ((SECTIONS as string[]).includes(route))
    return { page: "home", section: route as Section }
  return { page: "home" }
}

const isPage = (value: unknown): value is Page =>
  value === "home" || isProjectId(value)

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

function scrollToSectionNow(section: Section, instant = false) {
  document.getElementById(section)?.scrollIntoView({
    behavior: instant || prefersReducedMotion() ? "instant" : "smooth",
    block: "start",
  })
}

function withViewTransition(update: () => void) {
  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => unknown
  }
  if (doc.startViewTransition && !prefersReducedMotion()) {
    doc.startViewTransition(update)
  } else {
    update()
  }
}

export default function App() {
  const initial = useRef(parseHash(window.location.hash))
  const [page, setPage] = useState<Page>(initial.current.page)
  const pageRef = useRef(page)
  pageRef.current = page

  const showPage = useCallback(
    (to: Page, place: { section?: Section; scrollY?: number }) => {
      preloadPage(to).then(() =>
        withViewTransition(() => {
          flushSync(() => setPage(to))
          if (typeof place.scrollY === "number") {
            window.scrollTo({ top: place.scrollY, behavior: "instant" })
          } else if (place.section) {
            scrollToSectionNow(place.section, true)
          } else {
            window.scrollTo({ top: 0, behavior: "instant" })
          }
        }),
      )
    },
    [],
  )

  useEffect(() => {
    history.scrollRestoration = "manual"
    const { page: first, section } = initial.current
    history.replaceState(
      { page: first, scrollY: 0 },
      "",
      hrefFor(first, section),
    )
    if (section) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => scrollToSectionNow(section, true)),
      )
    }

    const onPopState = (event: PopStateEvent) => {
      const parsed = parseHash(window.location.hash)
      const to = isPage(event.state?.page) ? event.state.page : parsed.page
      const scrollY =
        typeof event.state?.scrollY === "number"
          ? event.state.scrollY
          : undefined
      if (to === pageRef.current && parsed.section && scrollY === undefined) {
        scrollToSectionNow(parsed.section)
        return
      }
      showPage(to, { section: parsed.section, scrollY })
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [showPage])

  const navigate = useCallback<NavApi["navigate"]>(
    (to, options) => {
      const section = options?.section
      const from = pageRef.current
      if (to === from) {
        if (section) scrollToSectionNow(section)
        else
          window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion() ? "instant" : "smooth",
          })
        return
      }
      history.replaceState(
        { ...(history.state ?? {}), page: from, scrollY: window.scrollY },
        "",
      )
      history.pushState(
        { page: to, scrollY: 0, prev: from },
        "",
        hrefFor(to, section),
      )
      showPage(to, { section })
    },
    [showPage],
  )

  const backToWork = useCallback(() => {
    // Returning to the list you came from restores where you were reading.
    if (history.state?.prev === "home") history.back()
    else navigate("home", { section: "work" })
  }, [navigate])

  const api = useMemo<NavApi>(
    () => ({
      page,
      navigate,
      backToWork,
      scrollToSection: (section) => scrollToSectionNow(section),
      preload: (to) => void preloadPage(to),
    }),
    [page, navigate, backToWork],
  )

  // Titles, descriptions and focus follow the current page.
  const firstRender = useRef(true)
  useEffect(() => {
    const project = page === "home" ? undefined : PROJECT_MAP[page]
    document.title = project?.docTitle ?? SITE_TITLE
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    )
    if (!meta) {
      meta = document.createElement("meta")
      meta.name = "description"
      document.head.appendChild(meta)
    }
    meta.content = project?.description ?? SITE_DESCRIPTION

    if (firstRender.current) {
      firstRender.current = false
      return
    }
    document.getElementById("main")?.focus({ preventScroll: true })
  }, [page])

  const CaseStudy = page === "home" ? null : CASES[page]

  return (
    <NavContext.Provider value={api}>
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen overflow-x-clip bg-white">
          <a
            href="#main"
            onClick={(event) => {
              event.preventDefault()
              document.getElementById("main")?.focus()
            }}
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-neutral-900 focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
          >
            Skip to content
          </a>
          <Navigation />
          <main id="main" tabIndex={-1} className="outline-none">
            {CaseStudy ? (
              <Suspense fallback={<div className="min-h-screen" />}>
                <CaseStudy />
              </Suspense>
            ) : (
              <HomePage />
            )}
          </main>
          <ContactFooter />
        </div>
      </MotionConfig>
    </NavContext.Provider>
  )
}
