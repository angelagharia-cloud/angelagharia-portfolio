import { Snowflake, Sparkle } from "lucide-react"
import "./seasonal-hero.css"

// Temporary, isolated enhancement: change to false to disable instantly.
// Visible from 15 November through 6 January, then switches itself off.
const ENABLE_SEASONAL_HERO = true

const motes = [
  { kind: "flake", x: 3, y: 20, size: 15, seconds: 17, delay: -7 },
  { kind: "sparkle", x: 92, y: 15, size: 13, seconds: 14, delay: -3 },
  { kind: "flake", x: 78, y: 29, size: 19, seconds: 22, delay: -13 },
  { kind: "flake", x: 8, y: 62, size: 12, seconds: 19, delay: -8 },
  { kind: "sparkle", x: 96, y: 66, size: 11, seconds: 16, delay: -11 },
  { kind: "flake", x: 87, y: 82, size: 15, seconds: 21, delay: -5 },
  { kind: "flake", x: 18, y: 10, size: 10, seconds: 18, delay: -9 },
  { kind: "sparkle", x: 67, y: 8, size: 12, seconds: 20, delay: -14 },
  { kind: "flake", x: 97, y: 39, size: 17, seconds: 25, delay: -16 },
  { kind: "flake", x: 36, y: 91, size: 12, seconds: 23, delay: -10 },
  { kind: "sparkle", x: 62, y: 77, size: 10, seconds: 18, delay: -4 },
  { kind: "flake", x: 5, y: 90, size: 14, seconds: 22, delay: -12 },
] as const

function inSeason(now: Date): boolean {
  const month = now.getMonth()
  const day = now.getDate()
  return month === 11 || (month === 10 && day >= 15) || (month === 0 && day <= 6)
}

/**
 * Decorative accents for the landing-page hero only.
 * All motion is CSS based, behind content, and disabled by reduced-motion.
 */
export function SeasonalHeroAccents() {
  if (!ENABLE_SEASONAL_HERO || !inSeason(new Date())) return null

  return (
    <div className="seasonal-hero" aria-hidden="true">
      <div className="seasonal-hero__wash" />
      {motes.map(({ kind, x, y, size, seconds, delay }, index) => (
        <span
          key={index}
          className={`seasonal-hero__mote seasonal-hero__mote--${kind}`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            animationDuration: `${seconds}s`,
            animationDelay: `${delay}s`,
          }}
        >
          {kind === "flake" ? (
            <Snowflake aria-hidden="true" strokeWidth={1.15} />
          ) : (
            <Sparkle aria-hidden="true" strokeWidth={1.25} />
          )}
        </span>
      ))}
    </div>
  )
}
