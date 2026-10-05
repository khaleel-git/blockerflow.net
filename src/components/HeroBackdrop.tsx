import { Suspense, lazy, useEffect, useState } from 'react'

const HeroScene = lazy(() =>
  import('./HeroScene').then((mod) => ({ default: mod.HeroScene })),
)

export function HeroBackdrop() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isNarrow = window.matchMedia('(max-width: 640px)').matches
    setEnabled(!prefersReducedMotion && !isNarrow)
  }, [])

  if (!enabled) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]"
    >
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>
    </div>
  )
}
