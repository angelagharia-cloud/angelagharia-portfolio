import {
  lazy,
  Component,
  Suspense,
  useLayoutEffect,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type LazyExoticComponent,
} from "react"
import { flushSync } from "react-dom"
import { MotionConfig } from "motion/react"
import { Navigation } from "./components/Navigation"
import { HomePage } from "./components/HomePage"
import { ContactFooter } from "./components/ContactFooter"
import { Link, NavContext, hrefFor, type NavApi, type Section } from "./lib/router"
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
  const parts = route.split("/")
  if (parts.length === 2 && isProjectId(parts[0]) && parts[1] === "contact")
    return { page: parts[0], section: "contact" }
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
  const region = document.getElementById(section)
  const heading = region?.querySelector<HTMLElement>("h2")
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll:true }) }
  if (section === "work" && heading) {
    const header = document.querySelector("header")?.getBoundingClientRect().height ?? 64
    window.scrollTo({top:scrollY + heading.getBoundingClientRect().top - header - 32, behavior:"instant"})
    return
  }
  region?.scrollIntoView({
    behavior: instant || prefersReducedMotion() ? "instant" : "smooth",
    block: "start",
  })
}

class StudyBoundary extends Component<{ id: ProjectId; children: ReactNode }, { failed:boolean }> {
  state = { failed:false }
  static getDerivedStateFromError() { return { failed:true } }
  render() {
    if (!this.state.failed) return this.props.children
    return <section className="shell min-h-screen pt-32">
      <h1 className="t-h2">{PROJECT_MAP[this.props.id].title}</h1>
      <p role="alert" className="mt-5">This case study could not load.</p>
      <div className="mt-6 flex gap-6">
        <button className="min-h-11 underline" onClick={() => window.location.reload()}>Retry</button>
        <Link className="inline-flex min-h-11 items-center underline" to="home" section="work">Back to work</Link>
      </div>
    </section>
  }
}

type Place = { section?: Section; scrollY?: number; card?: ProjectId }
function RouteReady({ onReady }: { onReady: () => void }) {
  useLayoutEffect(onReady, [onReady])
  return null
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
  const pending = useRef<Place | null>({ section:initial.current.section })
  const navigationId = useRef(0)
  const ready = useCallback(() => {
    const place = pending.current
    if (!place) return
    pending.current = null
    if (typeof place.scrollY === "number") {
      window.scrollTo({ top:place.scrollY, behavior:"instant" })
      if (place.card) document.querySelector<HTMLElement>(`#work article a[href="#/${place.card}"]`)?.focus({preventScroll:true})
    } else if (place.section) scrollToSectionNow(place.section, true)
    else window.scrollTo({ top:0, behavior:"instant" })
  }, [])

  const showPage = useCallback(
    (to: Page, place: Place) => {
      const id = ++navigationId.current
      if (pageRef.current === to) { pending.current = place; ready(); return }
      withViewTransition(() => {
        if (navigationId.current !== id) return
        pending.current = place
        window.scrollTo({top:0, behavior:"instant"})
        flushSync(() => setPage(to))
      })
    },
    [ready],
  )

  useEffect(() => {
    history.scrollRestoration = "manual"
    const { page: first, section } = initial.current
    history.replaceState(
      { ...history.state, page: first },
      "",
      hrefFor(first, section),
    )

    const onPopState = (event: PopStateEvent) => {
      const parsed = parseHash(window.location.hash)
      const to = isPage(event.state?.page) ? event.state.page : parsed.page
      const scrollY =
        typeof event.state?.scrollY === "number"
          ? event.state.scrollY
          : undefined
      window.dispatchEvent(new Event("portfolio:navigate"))
      showPage(to, { section: parsed.section, scrollY, card:event.state?.card })
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [showPage])

  const navigate = useCallback<NavApi["navigate"]>(
    (to, options) => {
      const section = options?.section
      const from = pageRef.current
      window.dispatchEvent(new Event("portfolio:navigate"))
      if (to === from) {
        ++navigationId.current
        if (location.hash !== hrefFor(to,section)) {
          history.replaceState({ ...history.state, page:from, scrollY:window.scrollY }, "")
          history.pushState({ page:to, workDepth:history.state?.workDepth ? history.state.workDepth+1 : undefined }, "", hrefFor(to,section))
        }
        if (section) scrollToSectionNow(section)
        else
          window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion() ? "instant" : "smooth",
          })
        return
      }
      history.replaceState(
        { ...(history.state ?? {}), page: from, scrollY: window.scrollY, card:from === "home" && to !== "home" ? to : undefined },
        "",
      )
      history.pushState(
        { page: to, workDepth:to === "home" ? undefined : from === "home" ? 1 : history.state?.workDepth ? history.state.workDepth+1 : undefined },
        "",
        hrefFor(to, section),
      )
      showPage(to, { section })
    },
    [showPage],
  )

  const backToWork = useCallback(() => {
    // Returning to the list you came from restores where you were reading.
    if (history.state?.workDepth) history.go(-history.state.workDepth)
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
    if (document.activeElement === document.body) document.getElementById("main")?.focus({ preventScroll: true })
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
            {CaseStudy && page !== "home" ? (
              <StudyBoundary key={page} id={page}>
                <Suspense fallback={<section className="shell min-h-screen pt-32"><h1 className="t-h2">{PROJECT_MAP[page].title}</h1><p role="status" className="mt-5">Loading case study…</p></section>}>
                  <CaseStudy /><RouteReady onReady={ready} />
                </Suspense>
              </StudyBoundary>
            ) : (
              <><HomePage /><RouteReady onReady={ready} /></>
            )}
          </main>
          <ContactFooter />
        </div>
      </MotionConfig>
    </NavContext.Provider>
  )
}
