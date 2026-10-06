const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=eu.khaleel.blockerflow'

function PlayGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="play-glyph-gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#34D399" />
          <stop offset="0.55" stopColor="#6366F1" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      <path
        d="M4 2.6v18.8a1 1 0 0 0 1.53.85l15.4-9.4a1 1 0 0 0 0-1.7L5.53 1.75A1 1 0 0 0 4 2.6Z"
        fill="url(#play-glyph-gradient)"
      />
    </svg>
  )
}

export function GooglePlayBadge({
  variant = 'default',
  className = '',
}: {
  variant?: 'default' | 'compact'
  className?: string
}) {
  if (variant === 'compact') {
    return (
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Blockerflow on Google Play"
        className={`inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-ink/85 ${className}`}
      >
        <PlayGlyph size={16} />
        Google Play
      </a>
    )
  }

  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get Blockerflow on Google Play"
      className={`group inline-flex items-center gap-3 rounded-2xl bg-ink px-5 py-3 text-white shadow-lg shadow-ink/20 transition hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-xl ${className}`}
    >
      <PlayGlyph size={28} />
      <span className="text-left leading-tight">
        <span className="block text-[11px] uppercase tracking-wider text-white/70">Get it on</span>
        <span className="block font-display text-lg font-semibold">Google Play</span>
      </span>
    </a>
  )
}
