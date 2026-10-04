import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFound() {
  useDocumentTitle('Page not found — Blockerflow')

  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold text-ink">Page not found</h1>
      <p className="mt-4 text-ink-muted">
        The page you're looking for doesn't exist, or the link may be out of date.
      </p>
      <Link to="/" className="mt-6 inline-block font-medium text-primary hover:underline">
        &larr; Back to home
      </Link>
    </section>
  )
}
