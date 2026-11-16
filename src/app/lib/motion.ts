/** One motion language for the whole site. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const

export const DURATION = {
  /** Hover / press feedback. */
  fast: 0.18,
  /** Scroll reveals and section entrances. */
  reveal: 0.7,
  /** Hero introduction. */
  intro: 0.9,
} as const

/** Default reveal distance in px. Small enough to feel calm, large enough to read. */
export const REVEAL_Y = 18

export const STAGGER = 0.07
