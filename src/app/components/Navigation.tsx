import { useEffect, useState, type ReactNode } from "react"
import { motion, useScroll, useSpring } from "motion/react"
import { Link, isPlainClick, useNav, type Section } from "../lib/router"
import { PROJECT_MAP } from "../lib/projects"
import { media } from "../lib/media"
import { Img } from "./system/Img"

const avatar = media("avatar")

export function Navigation() {
  const { page, backToWork } = useNav()
  const project = page === "home" ? null : PROJECT_MAP[page]
  const [scrolled, setScrolled] = useState(false)
  const [inView, setInView] = useState<Section | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Scroll-spy: highlight the homepage section that crosses the reading line.
  useEffect(() => {
    if (page !== "home") {
      setInView(null)
      return
    }
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.isIntersecting
            ? visible.add(entry.target.id)
            : visible.delete(entry.target.id),
        )
        setInView(
          visible.has("work")
            ? "work"
            : visible.has("about") || visible.has("toolkit")
              ? "about"
              : null,
        )
      },
      { rootMargin: "-40% 0px -55% 0px" },
    )
    const frame = requestAnimationFrame(() =>
      ["work", "about", "toolkit"].forEach((id) => {
        const element = document.getElementById(id)
        if (element) observer.observe(element)
      }),
    )
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [page])

  const workActive = page !== "home" || inView === "work"

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-white/80 backdrop-blur-xl backdrop-saturate-150 transition-[border-color,background-color] duration-300 [view-transition-name:site-nav] ${
        scrolled ? "border-neutral-200/80" : "border-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="shell flex h-16 items-center justify-between gap-4"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="home"
            className="group -ml-1 flex min-h-11 shrink-0 items-center gap-2.5 rounded-full py-1 pr-2 pl-1"
          >
            <Img
              media={avatar}
              alt=""
              priority
              className="h-8 w-8 rounded-full object-cover ring-1 ring-black/10 transition-[box-shadow] duration-300 group-hover:ring-black/25"
            />
            <span className="font-serif text-[1.0625rem] leading-none tracking-[-0.01em] text-neutral-950">
              Angel Agharia
            </span>
          </Link>
          {project && (
            <p className="hidden min-w-0 items-center gap-3 text-sm text-neutral-500 md:flex">
              <span aria-hidden="true" className="text-neutral-300">
                /
              </span>
              <span aria-current="page" className="truncate">
                {project.title}
              </span>
            </p>
          )}
        </div>

        <ul className="flex items-center gap-0.5 sm:gap-1.5">
          <li>
            <NavLink
              to="home"
              section="work"
              active={workActive}
              onClick={
                page === "home"
                  ? undefined
                  : (event) => {
                      if (!isPlainClick(event)) return
                      event.preventDefault()
                      backToWork()
                    }
              }
            >
              Work
            </NavLink>
          </li>
          <li className="hidden min-[400px]:block">
            <NavLink to="home" section="about" active={inView === "about"}>
              About
            </NavLink>
          </li>
          <li className="ml-1.5">
            <Link
              to={page}
              section="contact"
              className="inline-flex min-h-10 items-center rounded-full bg-neutral-900 px-4 text-sm font-medium text-white transition-[background-color,transform] duration-200 ease-out-quint hover:bg-neutral-700 active:scale-[0.97]"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      {project && <ReadingProgress color={project.accent} />}
    </header>
  )
}

function NavLink({
  to,
  section,
  active,
  onClick,
  children,
}: {
  to: "home"
  section: Section
  active: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      section={section}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={`group relative inline-flex min-h-11 items-center px-2.5 text-sm font-medium transition-colors duration-200 sm:px-3 ${
        active ? "text-neutral-950" : "text-neutral-600 hover:text-neutral-950"
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute inset-x-2.5 bottom-2 h-px origin-left bg-current transition-transform duration-300 ease-out-quint sm:inset-x-3 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  )
}

function ReadingProgress({ color }: { color: string }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 40,
    restDelta: 0.001,
  })
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 -bottom-px h-0.5 origin-left"
      style={{ scaleX, backgroundColor: color }}
    />
  )
}
