const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=eu.khaleel.blockerflow'

/** The official Google Play triangle mark, flat four-color version used on the Play Store badges. */
function PlayGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size * (129.2 / 120.9)} viewBox="30 336.7 120.9 129.2" aria-hidden="true">
      <path
        d="M119.2 421.2c15.3-8.4 27-14.8 28-15.3 3.2-1.7 6.5-6.2 0-9.7-2.1-1.1-13.4-7.3-28-15.3l-20.1 20.2z"
        fill="#ffd400"
      />
      <path
        d="m99.1 401.1-64.2 64.7c1.5.2 3.2-.2 5.2-1.3 4.2-2.3 48.8-26.7 79.1-43.3z"
        fill="#f33"
      />
      <path
        d="m99.1 401.1 20.1-20.2s-74.6-40.7-79.1-43.1c-1.7-1-3.6-1.3-5.3-1z"
        fill="#48ff48"
      />
      <path
        d="m99.1 401.1-64.3-64.3c-2.6.6-4.8 2.9-4.8 7.6v113.8c0 4.3 1.7 7.4 4.9 7.7z"
        fill="#3bccff"
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
