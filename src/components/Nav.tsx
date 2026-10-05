import { Link } from 'react-router-dom'
import { Wordmark } from './Wordmark'

export function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-outline bg-surface/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" aria-label="Blockerflow home">
          <Wordmark />
        </Link>
        <div className="flex gap-6 text-sm font-medium text-ink-muted">
          <Link to="/guide" className="hover:text-ink">
            Guide
          </Link>
          <Link to="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-ink">
            Terms
          </Link>
        </div>
      </nav>
    </header>
  )
}
