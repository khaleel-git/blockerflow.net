import { Link } from 'react-router-dom'
import { Wordmark } from './Wordmark'
import { GooglePlayBadge } from './GooglePlayBadge'
import { MacBadge } from './MacBadge'
import { WindowsBadge } from './WindowsBadge'

export function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-outline bg-surface/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-6">
        <Link to="/" aria-label="Blockerflow home" className="shrink-0">
          <Wordmark />
        </Link>
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-ink-muted sm:gap-4">
          <Link to="/guides/" className="hidden hover:text-ink sm:inline">
            Guides
          </Link>
          <Link to="/guide/" className="hidden hover:text-ink sm:inline">
            Setup
          </Link>
          <Link to="/privacy/" className="hidden hover:text-ink sm:inline">
            Privacy
          </Link>
          <Link
            to="/dashboard/"
            aria-label="Dashboard"
            className="inline-flex items-center gap-1.5 rounded-full border border-outline px-2.5 py-1.5 text-ink transition hover:bg-primary-bg sm:px-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="7" height="9" rx="1.5" />
              <rect x="14" y="3" width="7" height="5" rx="1.5" />
              <rect x="14" y="12" width="7" height="9" rx="1.5" />
              <rect x="3" y="16" width="7" height="5" rx="1.5" />
            </svg>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            to="/support/"
            aria-label="Support Blockerflow"
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1.5 sm:px-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100 motion-safe:hover:scale-105"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="motion-safe:animate-pulse">
              <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 2.7 5 6 5c2 0 3.4 1.1 4 2.3h4C14.6 6.1 16 5 18 5c3.3 0 5.1 3.5 3.6 6.8C19.5 16.4 12 21 12 21z" />
            </svg>
            <span className="hidden sm:inline">Support</span>
          </Link>
          <span className="hidden lg:inline-flex">
            <WindowsBadge variant="compact" />
          </span>
          <span className="hidden sm:inline-flex">
            <MacBadge variant="compact" />
          </span>
          <GooglePlayBadge variant="compact" />
        </div>
      </nav>
    </header>
  )
}
