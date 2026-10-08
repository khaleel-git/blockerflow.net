import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { ARTICLES } from '../seo/articles'

export function Guides() {
  usePageMeta('/guides')

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center sm:pt-28">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Guides
        </h1>
        <p className="mt-6 text-lg text-ink-muted">
          How to block porn, Reels, Shorts and social media on Android, with video demos.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <ul className="space-y-4">
          {ARTICLES.map((a) => (
            <li key={a.slug}>
              <Link
                to={`/guides/${a.slug}`}
                className="block rounded-2xl border border-outline bg-surface p-6 transition hover:border-primary"
              >
                <h2 className="font-display text-xl font-semibold text-ink">{a.h1}</h2>
                <p className="mt-2 text-ink-muted">{a.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
