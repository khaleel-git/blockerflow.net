import { WINDOWS_STORE_URL } from '../seo/site'

/** A plain desktop monitor drawing, so the badge reads as "Windows" without using Microsoft's logo. */
function MonitorGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="11.5" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 16v3.500M8 20h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
        <MonitorGlyph size={16} />
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
      <MonitorGlyph size={28} />
      <span className="whitespace-nowrap text-left leading-tight">
        <span className="block text-[11px] uppercase tracking-wider text-ink-muted">Get it for</span>
        <span className="block font-display text-lg font-semibold">Windows</span>
      </span>
    </a>
  )
}
