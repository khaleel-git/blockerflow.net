import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { HeroBackdrop } from '../components/HeroBackdrop'
import { HeroDemoVideo } from '../components/HeroDemoVideo'
import { PhoneFrame } from '../components/PhoneFrame'

const FEATURES = [
  {
    title: 'Adult content blocking',
    description:
      'A 1.1M+ domain and keyword blocklist, checked entirely on your device. Nothing you browse is ever uploaded.',
    screenshot: '/assets/screenshots/01-blocking.png',
  },
  {
    title: 'Social video blocking',
    description:
      'Blocks Instagram Reels, Facebook Reels, YouTube Shorts, Snapchat Spotlight, and X/Twitter videos, in both the apps and their websites.',
    screenshot: '/assets/screenshots/02-blocklist.png',
  },
  {
    title: 'Focus Mode',
    description:
      'Named, optionally time-boxed sessions that block your chosen distractions until the session ends.',
    screenshot: '/assets/screenshots/03-focus.png',
  },
  {
    title: 'Accountability Partner',
    description:
      'A trusted contact unlocks blocked features for you, via a one-time PIN sent to their email.',
    screenshot: '/assets/screenshots/04-accountability-partner.png',
  },
  {
    title: 'Uninstall Protection',
    description: 'Stops the app being removed as a shortcut around its own blocks.',
    screenshot: '/assets/screenshots/05-uninstall-protection.png',
  },
  {
    title: 'AI Coach',
    description:
      "An honest second opinion when you're tempted to disable a blocker, before you talk yourself out of it.",
    screenshot: '/assets/screenshots/06-ai-coach.png',
  },
]

export function Home() {
  useDocumentTitle('Blockerflow: Block distractions, stay accountable')

  return (
    <>
      <section className="relative overflow-hidden">
        <HeroBackdrop />
        <div className="mx-auto grid max-w-5xl gap-12 px-6 pb-16 pt-20 sm:pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center rounded-full bg-primary-bg px-4 py-1.5 text-sm font-medium text-primary">
              Coming Soon on Google Play
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Block distractions.
              <br />
              Stay accountable.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ink-muted lg:mx-0">
              Blockerflow is an Android app that blocks adult content and distracting social video
              feeds, backed by a real accountability system, not just a toggle you can switch off
              the moment you're tempted.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/guide"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
              >
                See how it works
              </Link>
              <Link
                to="/privacy"
                className="inline-flex items-center justify-center rounded-full border border-outline px-6 py-3 font-medium text-ink transition hover:bg-surface"
              >
                Read the privacy policy
              </Link>
            </div>
          </div>

          <PhoneFrame className="lg:ml-auto">
            <HeroDemoVideo />
          </PhoneFrame>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="space-y-4">
          {FEATURES.map((feature, index) => {
            const reversed = index % 2 === 0
            return (
              <div
                key={feature.title}
                className={`flex flex-col items-center gap-10 rounded-3xl p-8 sm:p-12 lg:flex-row lg:gap-16 ${
                  reversed ? 'lg:flex-row-reverse' : ''
                } ${index % 2 === 0 ? 'bg-surface' : 'bg-transparent'}`}
              >
                <div className={`text-center lg:flex-1 ${reversed ? 'lg:text-right' : 'lg:text-left'}`}>
                  <span className="font-display text-sm font-semibold text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    {feature.title}
                  </h2>
                  <p className="mx-auto mt-4 max-w-md text-ink-muted lg:mx-0">
                    {feature.description}
                  </p>
                </div>

                <div className="lg:flex-1">
                  <PhoneFrame className="max-w-[240px]">
                    <img
                      src={feature.screenshot}
                      alt={`${feature.title} screenshot`}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </PhoneFrame>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-3xl border border-outline bg-primary-bg px-8 py-12 text-center">
          <h2 className="font-display text-2xl font-semibold text-ink">
            New to Blockerflow? Walk through the setup.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ink-muted">
            A step-by-step guide to permissions, your blocklist, Focus Mode, and setting up an
            accountability partner.
          </p>
          <Link
            to="/guide"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90"
          >
            Open the guide &rarr;
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="rounded-2xl border border-outline bg-surface p-8 text-center">
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
