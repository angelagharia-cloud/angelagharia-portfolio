import { motion, type HTMLMotionProps } from "motion/react"
import { DURATION, EASE_OUT, REVEAL_Y } from "../../lib/motion"

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number
  y?: number
}

/**
 * The single scroll-reveal used across the site: a short rise and fade, once.
 * MotionConfig(reducedMotion="user") turns the rise into a plain fade.
 */
export function Reveal({ delay = 0, y = REVEAL_Y, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: DURATION.reveal, ease: EASE_OUT, delay }}
      {...rest}
    />
  )
}
