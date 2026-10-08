import { usePageMeta } from '../hooks/usePageMeta'

export function Terms() {
  usePageMeta('/terms')

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-bold text-ink">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated: October 2026</p>

      <p className="mt-8 text-ink-muted">
        These terms govern your use of the Blockerflow Android application ("Blockerflow", "the
        app"). By installing or using the app, you agree to these terms. If you do not agree, do
        not use the app.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Acceptable use</h2>
      <p className="mt-3 text-ink-muted">
        Blockerflow is provided for personal use as a content-blocking and accountability tool.
        You agree not to reverse-engineer the app to bypass its own blocking logic for a purpose
        other than your own device's configuration, not to use the app to monitor or restrict
        another person's device without their knowledge and consent, and not to use the
        accountability-partner or AI Coach features to harass, impersonate, or abuse another
        person.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Accountability features</h2>
      <p className="mt-3 text-ink-muted">
        The Accountability Partner feature sends email on your behalf to an address you provide.
        You are responsible for having that person's consent to receive it. The AI Coach feature
        sends text you type to Google's Gemini API to receive an automated recommendation; it is
        a tool to support your own judgment, not a guarantee, and Blockerflow is not responsible
        for the content of its responses.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">No warranty</h2>
      <p className="mt-3 text-ink-muted">
        Blockerflow is provided "as is" and "as available," without warranty of any kind, express
        or implied. No blocking system is perfect: Blockerflow does not guarantee that it will
        block all adult content, all distracting content, or any specific website or app feature,
        including ones not yet covered by its detection logic or changed after this version was
        built.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Limitation of liability</h2>
      <p className="mt-3 text-ink-muted">
        To the maximum extent permitted by law, Blockerflow and its developer are not liable for
        any indirect, incidental, or consequential damages arising from your use of, or inability
        to use, the app — including content that was not blocked, or blocking that was applied in
        error.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Changes</h2>
      <p className="mt-3 text-ink-muted">
        These terms, and the app itself, may change over time. Continued use of the app after a
        change to these terms constitutes acceptance of the updated terms. Material changes will
        be reflected on this page with an updated "Last updated" date.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Contact</h2>
      <p className="mt-3 text-ink-muted">
        Questions about these terms can be sent to{' '}
        <a href="mailto:khaleel.eu@gmail.com" className="text-primary hover:underline">
          khaleel.eu@gmail.com
        </a>
        .
      </p>
    </article>
  )
}
