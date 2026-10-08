import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { PhoneFrame } from '../components/PhoneFrame'

/**
 * Written against the shipped app. The feature switches all live on the Blocking tab, the screen
 * the app opens on; the Blocklist tab is only for apps and sites the user adds themselves. An
 * earlier version of this page sent people to the Blocklist tab to pick categories, which is not
 * where any of them are.
 */
interface Step {
  number: number
  title: string
  description: string
  bullets?: string[]
  screenshot?: string
  /** Shown in place of a screenshot: where in the app the step happens. */
  location?: string
}

const STEPS: Step[] = [
  {
    number: 1,
    title: 'Finish the setup screen',
    description:
      'On first launch Blockerflow lists the permissions it needs as tasks, each with its own button, and will not let you finish until the required one is done.',
    bullets: [
      'Enable Accessibility Service, the one marked Required. It is how Blockerflow sees what is on screen, including your browser address bar. Checks run on your device.',
      'Remove Battery Restrictions, so Android does not kill the blocker in the background.',
      'Enable Autostart, which appears on Xiaomi, Redmi and POCO phones, so the blocker comes back after a restart.',
    ],
    location: 'Setup → Enable Accessibility Service',
  },
  {
    number: 2,
    title: 'Choose what to block',
    description:
      'Everything is on the Blocking tab, the screen the app opens on. The card at the top should read Protection active before you go further.',
    bullets: [
      'Content Blocking: adult content, known piracy sites, and image and video search.',
      'Social Blocking: Instagram and Facebook Reels, YouTube Shorts, Instagram search, Snapchat videos and search, WhatsApp channels, and X videos.',
      'Advanced Blocking: unsupported browsers, newly installed apps, and Focus Mode protection.',
    ],
    screenshot: '/assets/screenshots/01-blocking.png',
  },
  {
    number: 3,
    title: 'Add your own apps and sites',
    description:
      'The Blocklist tab is the separate list you build yourself. Use the plus button to block an installed app, or switch to Websites and type an exact domain such as reddit.com.',
    bullets: [
      'A blocked domain covers its subdomains, so the mobile version is included.',
      'The Whitelist is for a site caught by mistake. It skips every other check, so adding one needs your accountability partner.',
    ],
    screenshot: '/assets/screenshots/02-blocklist.png',
  },
  {
    number: 4,
    title: 'Set an Accountability Partner',
    description:
      'Tap Edit on the Accountability Partner card on the Blocking tab, then pick who holds the off switch. Every change that weakens protection goes through it.',
    bullets: [
      'Friend: a trusted person gets approve and deny links and a six digit PIN by email. Needs you to be signed in.',
      'Myself: retype a sentence exactly before anything turns off.',
      'Time Delay: every change waits 24 hours.',
      'AI Coach: convince a strict coach first. Free, ten checks a day, needs you to be signed in.',
    ],
    screenshot: '/assets/screenshots/04-accountability-partner.png',
  },
  {
    number: 5,
    title: 'Turn on Uninstall Protection',
    description:
      'Switch it on from the Blocking tab or from Settings, then approve the Device Admin request. Android will then refuse to uninstall the app, and turning that off needs your partner.',
    bullets: [
      'The switch only shows as on once Android confirms it, so it can never claim protection you do not have.',
      'When you genuinely want the app gone, Uninstall App under Danger Zone runs the check and removes Device Admin for you.',
    ],
    screenshot: '/assets/screenshots/05-uninstall-protection.png',
  },
  {
    number: 6,
    title: 'Start a Focus session',
    description:
      'The Focus tab blocks the main social apps and sites for a set stretch of time. Name the session, pick a length, and press start.',
    bullets: [
      'Instagram, Facebook, Snapchat, TikTok, X, Reddit, Threads, Pinterest and Tumblr are blocked by default, as apps and websites, Lite versions included.',
      'Add extra sites under Also block during Focus, or exempt one under Allow during Focus.',
      'Switch on Protect Focus Mode if you want stopping early to need your partner.',
    ],
    screenshot: '/assets/screenshots/03-focus.png',
  },
]

export function Guide() {
  usePageMeta('/guide')

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center sm:pt-28">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          How to use Blockerflow
        </h1>
        <p className="mt-6 text-lg text-ink-muted">
          Six steps from install to a blocker you can't talk yourself out of.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="space-y-16">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className={`flex flex-col items-center gap-10 lg:flex-row lg:items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-bg font-display text-sm font-semibold text-primary">
                  {step.number}
                </span>
                <h2 className="mt-4 font-display text-2xl font-semibold text-ink">{step.title}</h2>
                <p className="mt-3 text-ink-muted">{step.description}</p>
                {step.bullets && (
                  <ul className="mx-auto mt-4 max-w-md space-y-2 text-left text-sm text-ink-muted">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex-1">
                {step.screenshot ? (
                  <PhoneFrame className="max-w-[240px]">
                    <img
                      src={step.screenshot}
                      alt={`${step.title} screenshot`}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </PhoneFrame>
                ) : (
                  <div className="mx-auto flex aspect-[9/19.5] w-full max-w-[240px] items-center justify-center rounded-[2.5rem] border border-outline bg-primary-bg">
                    <span className="px-6 text-center font-display text-sm font-medium text-primary">
                      {step.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <div className="rounded-2xl border border-outline bg-surface p-8">
          <h2 className="font-display text-xl font-semibold text-ink">Still have questions?</h2>
          <p className="mt-3 text-ink-muted">
            Check what Blockerflow does and doesn't send off your device.
          </p>
          <Link to="/privacy" className="mt-4 inline-block font-medium text-primary hover:underline">
            Read the full Privacy Policy &rarr;
          </Link>
        </div>
      </section>
    </>
  )
}
