import { Link } from 'react-router-dom'
import { MAC_GUIDE_PATH } from '../seo/site'

/** A plain laptop drawing, so the badge reads as "Mac" without using Apple's logo. */
function LaptopGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="5" width="15" height="10.5" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.5 18.5h19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/** Links to the install guide, which holds the download button and the steps to open an app that is not notarized. */
export function MacBadge({
  variant = 'default',
  className = '',
}: {
  variant?: 'default' | 'compact'
  className?: string
}) {
  if (variant === 'compact') {
    return (
      <Link
        to={MAC_GUIDE_PATH}
        aria-label="Get Blockerflow for Mac"
        className={`inline-flex items-center gap-2 rounded-full border border-outline px-3.5 py-1.5 text-sm font-medium text-ink transition hover:bg-primary-bg ${className}`}
      >
        <LaptopGlyph size={16} />
        Mac
      </Link>
    )
  }

  return (
    <Link
      to={MAC_GUIDE_PATH}
      aria-label="Get Blockerflow for Mac"
      className={`group inline-flex items-center gap-3 rounded-2xl border border-outline bg-surface px-5 py-3 text-ink shadow-lg shadow-ink/10 transition hover:-translate-y-0.5 hover:bg-primary-bg hover:shadow-xl ${className}`}
    >
      <LaptopGlyph size={28} />
      <span className="whitespace-nowrap text-left leading-tight">
        <span className="block text-[11px] uppercase tracking-wider text-ink-muted">Download for</span>
        <span className="block font-display text-lg font-semibold">Mac</span>
      </span>
    </Link>
  )
}
