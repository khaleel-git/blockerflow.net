import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { DemoVideo } from '../components/DemoVideo'
import type { VideoKey } from '../seo/videos'

const STEPS: { number: number; title: string; description: string; video: VideoKey }[] = [
  {
    number: 1,
    title: 'Turn on the Accessibility Service',
    description:
      "Blocking content means Blockerflow has to see what's on screen. During setup, grant the Accessibility Service permission when prompted. This runs entirely on your device; nothing you browse is ever sent anywhere.",
    video: 'privacy',
  },
  {
    number: 2,
    title: 'Choose what to block',
    description:
      'Open your blocklist and pick categories: adult content, Reels, Shorts, Spotlight, or specific apps and sites. Add exceptions with the allowlist if something gets blocked by mistake.',
    video: 'reelsShorts',
  },
  {
    number: 3,
    title: 'Start a Focus Mode session',
    description:
      "Give a session a name, optionally set a time limit, and start it. Everything you've chosen to block stays blocked until the session ends, no early exits.",
    video: 'focusPromo',
  },
  {
    number: 4,
    title: 'Set an Accountability Partner or AI Coach',
    description:
      'In Settings, add a trusted contact as your Accountability Partner. They get a one-time PIN by email whenever you want to unlock something. Prefer not to involve anyone else? Switch to the AI Coach for an honest second opinion instead.',
    video: 'accountability',
  },
  {
    number: 5,
    title: 'Turn on Uninstall Protection',
    description:
      'Enable Device Admin in Settings so Blockerflow can stop itself being removed as a shortcut around its own blocks.',
    video: 'urgeTyping',
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
          Five steps from install to a blocker you can't talk yourself out of.
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
              </div>

              <div className="w-full flex-1">
                <DemoVideo video={step.video} />
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
