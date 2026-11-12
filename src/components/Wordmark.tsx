interface WordmarkProps {
  className?: string
}

export function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-display text-xl font-bold tracking-tight sm:gap-2 sm:text-2xl ${className}`}>
      {/* The app's mark (2026-11-12): a white shield with a B cut out, on indigo. */}
      <img src="/favicon.svg" alt="" width={26} height={26} className="h-[22px] w-[22px] rounded-[5px] sm:h-[26px] sm:w-[26px] sm:rounded-[6px]" />
      <span><span className="text-ink">Blocker</span>
      <span className="text-primary">flow</span></span>
    </span>
  )
}
