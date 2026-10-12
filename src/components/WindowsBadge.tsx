import { WINDOWS_STORE_URL } from '../seo/site'

/** The Windows logo: four squares. */
function WindowsLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0078D4" aria-hidden="true">
      <rect x="2.5" y="2.5" width="9" height="9" />
      <rect x="12.5" y="2.5" width="9" height="9" />
      <rect x="2.5" y="12.5" width="9" height="9" />
      <rect x="12.5" y="12.5" width="9" height="9" />
    </svg>
  )
}

/** Links straight to the Microsoft Store listing, which installs the Windows app. */
export function WindowsBadge({
  variant = 'default',
  className = '',
}: {
  variant?: 'default' | 'compact'
  className?: string
}) {
  if (variant === 'compact') {
    return (
      <a
        href={WINDOWS_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Blockerflow for Windows"
        className={`inline-flex items-center gap-2 rounded-full border border-outline px-3.5 py-1.5 text-sm font-medium text-ink transition hover:bg-primary-bg ${className}`}
      >
        <WindowsLogo size={15} />
        Windows
      </a>
    )
  }

  return (
    <a
      href={WINDOWS_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get Blockerflow for Windows"
      className={`group inline-flex items-center gap-3 rounded-2xl border border-outline bg-surface px-5 py-3 text-ink shadow-lg shadow-ink/10 transition hover:-translate-y-0.5 hover:bg-primary-bg hover:shadow-xl ${className}`}
    >
      <WindowsLogo size={26} />
      <span className="whitespace-nowrap text-left leading-tight">
        <span className="block text-[11px] uppercase tracking-wider text-ink-muted">Get it for</span>
        <span className="block font-display text-lg font-semibold">Windows</span>
      </span>
    </a>
  )
}
