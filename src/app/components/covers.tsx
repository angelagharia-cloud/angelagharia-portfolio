import { media } from "../lib/media"
import type { ProjectId } from "../lib/projects"
import { Img } from "./system/Img"
import { ModalityChart } from "./charts/ModalityChart"
import { UcdLogo } from "./UcdLogo"

const coverZoom =
  "transition-transform duration-[900ms] ease-out-quint group-hover:scale-[1.04]"

/** Art-directed project covers built from genuine project material. */
export function ProjectCover({
  id,
  sizes = "(min-width: 768px) 46vw, 100vw",
}: {
  id: ProjectId
  sizes?: string
}) {
  switch (id) {
    case "creative-key":
      return (
        <>
          <Img
            media={media("ck-kiosk")}
            alt="Cardboard Creative Key kiosk prototype in the Creative Futures Academy studio"
            sizes={sizes}
            className={`h-full w-full object-cover object-[38%_center] opacity-85 ${coverZoom}`}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a]/80 via-transparent to-transparent"
          />
          <div className="absolute right-[8%] bottom-[8%] w-[24%] -rotate-3 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-white/20 transition-transform duration-500 ease-out-quint group-hover:-translate-y-1 group-hover:-rotate-1">
            <Img
              media={media("ck-tickets")}
              alt=""
              sizes="8rem"
              className="block h-auto w-full"
            />
          </div>
        </>
      )
    case "gravitad":
      return (
        <div className="absolute inset-0 flex items-center p-[7%]">
          <div className="w-full overflow-hidden rounded-lg bg-white shadow-[0_24px_50px_-24px_rgba(5,40,90,0.45)] ring-1 ring-[#b9d3f2] transition-transform duration-700 ease-out-quint group-hover:-translate-y-1">
            <div
              aria-hidden="true"
              className="flex gap-1 border-b border-neutral-100 bg-neutral-50 px-3 py-2"
            >
              <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
              <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
              <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            </div>
            <Img
              media={media("gv-dashboard")}
              alt="Gravitad content platform dashboard"
              sizes={sizes}
              className="block h-auto w-full"
            />
          </div>
        </div>
      )
    case "stammer-halo":
      return (
        <Img
          media={media("sh-profile")}
          alt="Side profile of a person wearing the Stammer Halo open-ear earpiece"
          sizes={sizes}
          className={`h-full w-full object-cover object-[40%_50%] ${coverZoom}`}
        />
      )
    case "smartmeal": {
      const phone =
        "overflow-hidden rounded-[0.9rem] bg-white shadow-[0_18px_36px_-14px_rgba(4,60,40,0.4)] ring-1 ring-black/5 transition-transform duration-700 ease-out-quint"
      return (
        <div className="absolute inset-0 flex items-center justify-center gap-[4%] px-[8%] pt-[6%]">
          <div className={`w-[24%] translate-y-[8%] group-hover:-translate-x-1.5 ${phone}`}>
            <Img media={media("sm-screen-home")} alt="" sizes="9rem" className="block h-auto w-full" />
          </div>
          <div className={`w-[27%] -translate-y-[2%] group-hover:-translate-y-[5%] ${phone}`}>
            <Img
              media={media("sm-screen-recipe")}
              alt="SmartMeal hi-fi screens: home, recipe and smart grocery list"
              sizes="10rem"
              className="block h-auto w-full"
            />
          </div>
          <div className={`w-[24%] translate-y-[8%] group-hover:translate-x-1.5 ${phone}`}>
            <Img media={media("sm-screen-grocery")} alt="" sizes="9rem" className="block h-auto w-full" />
          </div>
        </div>
      )
    }
    case "interruption-study":
      return (
        <div className="absolute inset-0 flex flex-col px-[9%] pt-[8%] pb-[7%]">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-xs font-medium text-neutral-700">Mean Tetris score</p>
            <p className="tabular text-[0.6875rem] text-neutral-600">
              t(62) = 7.46 · p &lt; .001
            </p>
          </div>
          <ModalityChart variant="card" className="mt-5 flex-1" />
        </div>
      )
    case "ucd-campus":
      return (
        <>
          <Img
            media={media("ucd-stall")}
            alt="Students gathering at the UCD Campus Collective research stall"
            sizes={sizes}
            className={`h-full w-full object-cover object-[50%_72%] ${coverZoom}`}
          />
          <span className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/5">
            <UcdLogo aria-hidden="true" className="h-full w-full text-[#003B5C]" />
          </span>
        </>
      )
  }
}
