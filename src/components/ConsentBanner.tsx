import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getConsent, setConsent, trackPageView } from '../lib/analytics'

/** Opens the banner again (the footer's "Analytics settings"). */
export const OPEN_CONSENT_EVENT = 'bf-open-consent'

/**
 * Asks once whether the site may count visits with Google Analytics, and sends a page view per
 * route change when allowed. Rendered on the client only (after hydration), so prerendered pages
 * stay identical.
 */
export function ConsentBanner() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (getConsent() === null) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_CONSENT_EVENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
  }, [])

  useEffect(() => {
    // Let the page set its title first.
    const t = setTimeout(() => trackPageView(pathname), 0)
    return () => clearTimeout(t)
  }, [pathname])

  if (!open) return null
  const choose = (c: 'granted' | 'denied') => {
    setConsent(c)
    setOpen(false)
    if (c === 'granted') trackPageView(pathname)
  }
  return (
    <div role="dialog" aria-label="Analytics" className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-outline bg-surface p-4 text-sm text-ink shadow-lg sm:flex-row sm:items-center">
        <p className="flex-1 text-ink-muted">
          May we count visits with Google Analytics? It uses cookies and shows us which pages are read, never
          anything about your devices or what Blockerflow blocks.{' '}
          <Link to="/privacy/" className="text-primary hover:underline">Privacy Policy</Link>
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => choose('denied')} className="rounded-xl border border-outline px-4 py-2 font-semibold text-ink hover:bg-primary-bg">
            No thanks
          </button>
          <button type="button" onClick={() => choose('granted')} className="rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:opacity-90">
            Allow
          </button>
        </div>
      </div>
    </div>
  )
}
