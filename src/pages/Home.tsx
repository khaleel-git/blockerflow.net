import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const FEATURES = [
  {
    title: 'Adult content blocking',
    description:
      'A 1.1M+ domain and keyword blocklist, checked entirely on your device — nothing you browse is ever uploaded.',
  },
  {
    title: 'Social video blocking',
    description:
      'Blocks Instagram Reels, Facebook Reels, YouTube Shorts, Snapchat Spotlight, and X/Twitter videos — in both the apps and their websites.',
  },
  {
    title: 'Focus Mode',
    description:
      'Named, optionally time-boxed sessions that block your chosen distractions until the session ends.',
  },
  {
    title: 'Accountability Partner',
    description:
      'A trusted contact unlocks blocked features for you, via a one-time PIN sent to their email.',
  },
  {
    title: 'Uninstall Protection',
    description: 'Stops the app being removed as a shortcut around its own blocks.',
  },
  {
    title: 'AI Coach',
    description:
      "An honest second opinion when you're tempted to disable a blocker — before you talk yourself out of it.",
  },
]

export function Home() {
  useDocumentTitle('Blockerflow — Block distractions, stay accountable')

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-24 text-center sm:pt-32">
        <span className="inline-flex items-center rounded-full bg-primary-bg px-4 py-1.5 text-sm font-medium text-primary">
          Coming Soon on Google Play
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Block distractions.
          <br />
          Stay accountable.
        </h1>
        <p className="mt-6 text-lg text-ink-muted">
          Blockerflow is an Android app that blocks adult content and distracting social video
          feeds, backed by a real accountability system — not just a toggle you can switch off
          the moment you're tempted.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-outline bg-surface p-6">
              <h2 className="font-display text-lg font-semibold text-ink">{feature.title}</h2>
              <p className="mt-2 text-sm text-ink-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="rounded-2xl border border-outline bg-primary-bg p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-ink">Privacy-first, by design</h2>
          <p className="mt-3 text-ink-muted">
            No analytics SDK, no crash reporter, no telemetry upload path. Your browsing history
            never leaves your device.
          </p>
          <Link to="/privacy" className="mt-4 inline-block font-medium text-primary hover:underline">
            Read the full Privacy Policy &rarr;
          </Link>
        </div>
      </section>
    </>
  )
}
