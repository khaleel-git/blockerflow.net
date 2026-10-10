import { FUNDING_GOALS } from '../seo/funding'
import { DONATE_URL, FUNDING_ISSUE_URL } from '../seo/site'

/** A drawing of the macOS warning people get today, and the same dialog once the app is signed. */
function WarningToFix() {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3" aria-hidden="true">
      <div className="min-w-0 max-w-[150px] flex-1 rounded-xl border border-outline bg-surface p-3 shadow-md">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <svg className="mt-3" width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 3.5l9.5 16.5h-19L12 3.5z" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
          <path d="M12 10v4.5M12 17.2v.1" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="mt-2 text-[11px] font-semibold leading-tight text-ink">“Blockerflow” Not Opened</p>
        <p className="mt-1 text-[10px] leading-snug text-ink-muted">Apple could not verify it is free of malware.</p>
        <div className="mt-2 h-4 rounded bg-outline" />
      </div>

      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-primary">
        <path d="M4 12h15m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="min-w-0 max-w-[150px] flex-1 rounded-xl border-2 border-emerald-300 bg-surface p-3 shadow-md">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <svg className="mt-3" width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#059669" strokeWidth="2" />
          <path d="M7.8 12.3l2.9 2.9 5.5-5.8" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-2 text-[11px] font-semibold leading-tight text-ink">Blockerflow</p>
        <p className="mt-1 text-[10px] leading-snug text-ink-muted">Opens like any other app.</p>
        <div className="mt-2 h-4 rounded bg-primary/80" />
      </div>
    </div>
  )
}

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
              <WarningToFix />
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
              <a
                href={FUNDING_ISSUE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                See the details
              </a>
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
