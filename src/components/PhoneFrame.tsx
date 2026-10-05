import type { ReactNode } from 'react'

interface PhoneFrameProps {
  children: ReactNode
  className?: string
}

export function PhoneFrame({ children, className = '' }: PhoneFrameProps) {
  return (
    <div
      className={`relative mx-auto aspect-[9/19.5] w-full max-w-[280px] rounded-[2.5rem] border-[6px] border-ink bg-ink p-2 shadow-2xl ${className}`}
    >
      <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink" />
      <div className="h-full w-full overflow-hidden rounded-[2rem] bg-surface">{children}</div>
    </div>
  )
}
