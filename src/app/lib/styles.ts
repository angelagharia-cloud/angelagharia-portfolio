/** Shared interactive styles so every button and link behaves the same way. */
export const btn = {
  primary:
    "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 text-sm font-medium text-white transition-[background-color,transform,box-shadow] duration-200 ease-out-quint hover:bg-neutral-800 hover:shadow-[0_6px_20px_-8px_rgba(0,0,0,0.45)] active:scale-[0.98]",
  secondary:
    "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white/60 px-6 text-sm font-medium text-neutral-800 transition-[border-color,background-color,transform] duration-200 ease-out-quint hover:border-neutral-900 hover:bg-white active:scale-[0.98]",
} as const

/** Arrow that nudges forward when its parent `group` is hovered or focused. */
export const arrowNudge =
  "transition-transform duration-300 ease-out-quint group-hover:translate-x-1 group-focus-visible:translate-x-1"
