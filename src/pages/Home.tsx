import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { HeroBackdrop } from '../components/HeroBackdrop'
import { HeroShowcase } from '../components/HeroShowcase'
import { PhoneFrame } from '../components/PhoneFrame'
import { GooglePlayBadge } from '../components/GooglePlayBadge'
import { JsonLd } from '../components/JsonLd'
import { ARTICLES } from '../seo/articles'
import { PLAY_STORE_URL, SITE_NAME, SITE_URL } from '../seo/site'

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

const HOME_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    {
      '@type': 'MobileApplication',
      name: SITE_NAME,
      operatingSystem: 'Android',
      applicationCategory: 'LifestyleApplication',
      description:
        'An Android app that blocks adult content and distracting social video feeds, backed by an accountability system.',
      url: SITE_URL,
      downloadUrl: PLAY_STORE_URL,
      image: `${SITE_URL}/assets/icon-512.png`,
    },
  ],
}

export function Home() {
  usePageMeta('/')

  return (
    <>
      <JsonLd data={HOME_SCHEMA} />
      <section className="relative overflow-hidden">
        <HeroBackdrop />
        <div className="mx-auto grid max-w-5xl gap-12 px-6 pb-16 pt-20 sm:pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-bg px-4 py-1.5 text-sm font-medium text-primary">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="10" fill="currentColor" fillOpacity="0.15" />
                <path
                  d="M6 10.3l2.4 2.4L14 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Available now on Google Play
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
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <GooglePlayBadge />
              <div className="flex items-center gap-5 text-sm font-medium">
                <Link to="/guide" className="text-ink transition hover:text-primary">
                  See how it works &rarr;
                </Link>
                <Link to="/privacy" className="text-ink-muted transition hover:text-ink">
                  Privacy policy
                </Link>
              </div>
            </div>
          </div>

          <HeroShowcase />
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

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-center font-display text-2xl font-semibold text-ink sm:text-3xl">
          Guides and video demos
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {ARTICLES.map((a) => (
            <Link
              key={a.slug}
              to={`/guides/${a.slug}`}
              className="rounded-2xl border border-outline bg-surface p-6 transition hover:border-primary"
            >
              <h3 className="font-display text-lg font-semibold text-ink">{a.h1}</h3>
              <p className="mt-2 text-sm text-ink-muted">{a.description}</p>
            </Link>
          ))}
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
