import { FUNDING_GOALS } from '../seo/funding'
import { Link } from 'react-router-dom'
import { GatekeeperVisual } from './GatekeeperVisual'
import { DONATE_URL } from '../seo/site'

/** The donation card. It lays out by its own width, so it is two columns on the home page and one inside a guide. */
export function SupportCard({ className = '' }: { className?: string }) {
  return (
    <div className={`@container ${className}`}>
      <div className="rounded-3xl bg-gradient-to-br from-primary/40 via-primary/10 to-sky-300/40 p-px">
        <div className="grid gap-10 rounded-[calc(1.5rem-1px)] bg-surface p-6 sm:p-10 @3xl:grid-cols-[1fr_1.15fr] @3xl:items-center @3xl:gap-14 @3xl:p-12">
          <div className="text-center @3xl:text-left">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Blockerflow is free. Help me keep it that way.
            </h2>
            <p className="mt-4 text-ink-muted">
              No ads, no subscriptions, no selling your data. If it helps you, a donation pays for
              the things that keep it free and safe to install. Any amount helps.
            </p>
            <div className="mt-8">
              <GatekeeperVisual />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Next goals</p>
            <ul className="mt-4 space-y-3">
              {FUNDING_GOALS.map((goal) => (
                <li key={goal.title} className="@container rounded-2xl border border-outline bg-bg p-5">
                  <div className="flex flex-col items-start gap-2 @md:flex-row @md:justify-between @md:gap-4">
                    <h3 className="min-w-0 font-display text-lg font-semibold leading-snug text-ink">{goal.title}</h3>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-primary-bg px-3 py-0.5 text-sm font-medium text-primary">
                      {goal.cost}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-ink-muted">{goal.why}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 @3xl:justify-start">
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 font-display text-lg font-semibold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Donate via PayPal
              </a>
              <Link to="/support" className="text-sm font-medium text-primary hover:underline">
                See the details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SupportSection() {
  return (
    <section id="support" className="mx-auto max-w-5xl scroll-mt-24 px-6 pb-20">
      <SupportCard />
    </section>
  )
}
