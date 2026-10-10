import { Link } from 'react-router-dom'
import { Wordmark } from './Wordmark'
import { GooglePlayBadge } from './GooglePlayBadge'
import { MacBadge } from './MacBadge'

export function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-outline bg-surface/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" aria-label="Blockerflow home">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium text-ink-muted sm:gap-6">
          <Link to="/guides" className="hidden hover:text-ink sm:inline">
            Guides
          </Link>
          <Link to="/guide" className="hidden hover:text-ink sm:inline">
            Setup
          </Link>
          <Link to="/privacy" className="hidden hover:text-ink sm:inline">
            Privacy
          </Link>
          <Link to="/terms" className="hidden hover:text-ink sm:inline">
            Terms
          </Link>
          <span className="hidden sm:inline-flex">
            <MacBadge variant="compact" />
          </span>
          <GooglePlayBadge variant="compact" />
        </div>
      </nav>
    </header>
  )
}
