import { HeroDemoVideo } from './HeroDemoVideo'

function Shield() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2l6 2.2v5c0 3.9-2.6 6.9-6 8.3-3.4-1.4-6-4.4-6-8.3v-5L10 2z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7 10l2.1 2.1L13 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** The hero video: glowing gradient frame, slow aurora behind it, floating proof chips. */
export function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[300px] lg:ml-auto lg:mr-0">
      <div
        aria-hidden="true"
        className="absolute -inset-10 -z-10 motion-safe:animate-spin-slow"
      >
        <div className="h-full w-full rounded-full bg-[conic-gradient(from_0deg,#6366f1,#a855f7,#38bdf8,#6366f1)] opacity-40 blur-3xl" />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-2.5">
        <div className="flex items-center gap-2 rounded-full border border-outline bg-surface px-3.5 py-2 text-sm font-semibold text-ink shadow-md">
          <span className="text-primary">
            <Shield />
          </span>
          1.1M+ sites blocked
        </div>
        <div className="flex items-center gap-2 rounded-full border border-outline bg-surface px-3.5 py-2 text-sm font-semibold text-ink shadow-md">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Stays on your device
        </div>
      </div>

      <div className="rounded-[2rem] bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-400 p-[3px] shadow-2xl shadow-indigo-500/30">
        <div className="aspect-[9/16] overflow-hidden rounded-[calc(2rem-3px)] bg-ink">
          <HeroDemoVideo />
        </div>
      </div>

    </div>
  )
}
