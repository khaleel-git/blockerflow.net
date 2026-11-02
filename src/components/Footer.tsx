import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { OPEN_CONSENT_EVENT } from './ConsentBanner'
import { Wordmark } from './Wordmark'

const linkClass = 'text-ink-muted transition-colors hover:text-ink'

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">{children}</ul>
    </div>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-outline bg-surface">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-xs">
          <Wordmark />
          <p className="mt-3 text-sm text-ink-muted">
            A free blocker for Android, Mac and Windows, with a partner who has to agree before you switch it off.
          </p>
        </div>
        <Group title="Get help">
          <li><Link to="/guide/" className={linkClass}>Setup</Link></li>
          <li><Link to="/guides/" className={linkClass}>Guides</Link></li>
          <li><Link to="/dashboard/" className={linkClass}>Dashboard</Link></li>
          <li><a href="/status.html" className={linkClass}>Status</a></li>
        </Group>
        <Group title="Legal">
          <li><Link to="/privacy/" className={linkClass}>Privacy Policy</Link></li>
          <li><Link to="/terms/" className={linkClass}>Terms &amp; Conditions</Link></li>
          <li>
            <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className={linkClass}>
              Analytics settings
            </button>
          </li>
        </Group>
      </div>
      <div className="border-t border-outline">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-5 text-xs text-ink-muted sm:flex-row sm:justify-between">
          <p>&copy; {year} Blockerflow</p>
          <p>
            <Link to="/support/" className={linkClass}>Support the project</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <a href="https://khaleel.eu" target="_blank" rel="noopener noreferrer" className={linkClass}>Made by Khaleel</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
