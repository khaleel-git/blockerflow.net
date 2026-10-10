import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { WarningToFix } from '../components/SupportSection'
import {
  APPLE_YEARLY_EUR,
  FUNDING_GOALS,
  WINDOWS_YEARLY_EUR,
  daysCovered,
  formatAmount,
  parseAmount,
  paypalUrl,
} from '../seo/funding'
import { FUNDING_ISSUE_URL, MAC_GUIDE_PATH, PLAY_STORE_URL } from '../seo/site'

const PRESETS = [3, 5, 10, 25]
const DAYS_IN_YEAR = 365

/** One square per day of a year, filled for the days an amount pays for. Reads like a calendar, one week per column. */
function YearStrip({ filled }: { filled: number }) {
  return (
    <div
      aria-hidden="true"
      className="grid grid-flow-col grid-rows-7 gap-[2px]"
      style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' }}
    >
      {Array.from({ length: DAYS_IN_YEAR }, (_, i) => (
        <span
          key={i}
          data-day={i + 1}
          data-filled={i < filled}
          className={`aspect-square rounded-[2px] motion-safe:transition-colors motion-safe:duration-200 ${
            i < filled ? 'bg-primary' : 'bg-outline'
          }`}
        />
      ))}
    </div>
  )
}

export function Support() {
  usePageMeta('/support')
  const [preset, setPreset] = useState<number>(10)
  const [custom, setCustom] = useState('')

  const typing = custom.trim() !== ''
  const amount = typing ? parseAmount(custom) : preset
  const apple = amount === null ? 0 : daysCovered(amount, APPLE_YEARLY_EUR)
  const windows = amount === null ? 0 : daysCovered(amount, WINDOWS_YEARLY_EUR)

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-12 sm:pt-20">
      <section className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
        <div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-ink sm:text-6xl">
            Keep Blockerflow free.
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-muted">
            No ads, no subscriptions, no selling your data. If it helps you, a donation pays for
            the things that keep it free and safe to install. Any amount helps.
          </p>
        </div>

        <div className="min-w-0 rounded-3xl border border-outline bg-surface p-6 shadow-lg shadow-primary/10 sm:p-8">
          <fieldset>
            <legend className="font-display text-lg font-semibold text-ink">Choose an amount</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {PRESETS.map((a) => (
                <label key={a} className="relative">
                  <input
                    type="radio"
                    name="amount"
                    value={a}
                    checked={!typing && preset === a}
                    onChange={() => {
                      setPreset(a)
                      setCustom('')
                    }}
                    className="peer sr-only"
                  />
                  <span className="flex h-12 min-w-[4.5rem] cursor-pointer items-center justify-center rounded-xl border border-outline px-4 font-display text-lg font-semibold tabular-nums text-ink transition hover:border-primary peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2">
                    €{a}
                  </span>
                </label>
              ))}
              <div className="flex-1 basis-40">
                <label htmlFor="custom-amount" className="sr-only">
                  Another amount in euro
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted">€</span>
                  <input
                    id="custom-amount"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="Another amount"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    aria-invalid={typing && amount === null}
                    className="h-12 w-full rounded-xl border border-outline bg-surface pl-9 pr-3 tabular-nums text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-[invalid=true]:border-rose-500"
                  />
                </div>
              </div>
            </div>
            {typing && amount === null && (
              <p role="alert" className="mt-2 text-sm text-rose-700">
                Enter an amount from 1 to 10000 euro.
              </p>
            )}
          </fieldset>

          <div className="mt-6">
            <YearStrip filled={apple} />
            <p className="mt-2 text-xs text-ink-muted">
              One square for each day of a year of Apple Developer ID signing.
            </p>
          </div>

          <div role="status" className="mt-5 min-h-[3.5rem] space-y-1 text-ink">
            {amount === null ? (
              <p className="text-ink-muted">Pick an amount to see what it covers.</p>
            ) : (
              <>
                <p className="text-lg">
                  <span className="font-display text-2xl font-bold tabular-nums">{apple} days</span> of Apple
                  Developer ID signing
                </p>
                <p className="text-ink-muted">
                  or {windows} days of Windows code signing
                </p>
              </>
            )}
          </div>

          <a
            href={paypalUrl(amount)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-3.5 font-display text-lg font-semibold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            {amount === null ? 'Donate via PayPal' : `Donate €${formatAmount(amount)} via PayPal`}
          </a>
          <p className="mt-3 text-center text-sm text-ink-muted">
            You pay on PayPal's own page. Blockerflow never sees your payment details.
          </p>
        </div>
      </section>

      <section aria-labelledby="goes" className="mt-24 max-w-3xl">
        <h2 id="goes" className="font-display text-3xl font-bold tracking-tight text-ink">
          Where it goes
        </h2>
        <div className="mt-8 space-y-7">
          {FUNDING_GOALS.map((g) => (
            <div key={g.title}>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                <h3 className="font-display text-xl font-semibold text-ink">{g.title}</h3>
                <span aria-hidden="true" className="hidden min-w-4 flex-1 -translate-y-1 border-b-2 border-dotted border-outline sm:block" />
                <span className="shrink-0 font-display text-xl font-semibold tabular-nums text-primary sm:text-ink">{g.cost}</span>
              </div>
              <p className="mt-1 max-w-xl text-ink-muted">{g.why}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-ink-muted">
          Prices are public list prices, checked on 10 October 2026. The full list and history are in the{' '}
          <a href={FUNDING_ISSUE_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
            funding issue
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="changes" className="mt-24 grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <h2 id="changes" className="font-display text-3xl font-bold tracking-tight text-ink">
            What changes for you
          </h2>
          <p className="mt-4 max-w-md text-ink-muted">
            Today the Mac app is not signed, so macOS says it cannot verify it. You open it with a
            right click, or one Terminal command. Once it is signed and notarized, it opens like any
            other app.
          </p>
          <Link to={MAC_GUIDE_PATH} className="mt-4 inline-block font-medium text-primary hover:underline">
            Read the Mac install guide
          </Link>
        </div>
        <WarningToFix />
      </section>

      <section aria-labelledby="free-help" className="mt-24 max-w-3xl">
        <h2 id="free-help" className="font-display text-3xl font-bold tracking-tight text-ink">
          Ways to help for free
        </h2>
        <ul className="mt-6 space-y-4 text-ink-muted">
          <li>
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
              Review it on Google Play
            </a>
            . A rating helps other people find it.
          </li>
          <li>
            Tell me what is broken or missing:{' '}
            <a href="mailto:hello@khaleel.eu" className="font-medium text-primary hover:underline">
              hello@khaleel.eu
            </a>
            .
          </li>
          <li>
            <a
              href="mailto:?subject=Blockerflow&body=https%3A%2F%2Fblockerflow.net"
              className="font-medium text-primary hover:underline"
            >
              Send blockerflow.net to one person
            </a>{' '}
            who would use it.
          </li>
        </ul>
      </section>
    </div>
  )
}
