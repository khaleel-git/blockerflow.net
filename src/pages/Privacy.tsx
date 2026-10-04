import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function Privacy() {
  useDocumentTitle('Privacy Policy — Blockerflow')

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-bold text-ink">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated: October 2026</p>

      <p className="mt-8 text-ink-muted">
        This policy describes what Blockerflow reads, what stays on your device, and what leaves
        it. Blocking content requires seeing what is on screen, so Blockerflow uses Android's
        Accessibility Service to read on-screen information in browsers and supported apps —
        including the web address in your browser's address bar — and decides locally whether to
        block it.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">On-device processing</h2>
      <p className="mt-3 text-ink-muted">
        The following is processed entirely on your device and never uploaded:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-muted">
        <li>
          Web addresses read from your browser, checked locally against blocklists bundled in the
          app
        </li>
        <li>
          On-screen accessibility content, such as detecting a Reels or Shorts feed, inspected
          locally in memory
        </li>
        <li>Your blocklist, allowlist, and settings, stored locally on your device</li>
      </ul>
      <p className="mt-3 text-ink-muted">
        Your browsing history is not uploaded. Blockerflow has no analytics SDK, no crash
        reporter, and no telemetry upload path.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">What leaves your device</h2>
      <p className="mt-3 text-ink-muted">
        Only three features send anything off-device. Each is optional and only activates when
        you deliberately turn it on.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">AI Coach</h3>
      <p className="mt-3 text-ink-muted">
        If you choose the AI Coach as your accountability partner, each time you try to disable a
        blocker the app sends the reason you type and the name of the feature to Blockerflow's
        server, which forwards it to Google's Gemini API for an approve/reject decision. Your
        browsing history is never sent. The server does not store your text; it only keeps a
        per-account daily count of checks to enforce a free daily limit. Google's handling of this
        text is governed by the Gemini API terms.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Accountability Partner</h3>
      <p className="mt-3 text-ink-muted">
        If you set an accountability partner's email address, the app sends that address to
        Blockerflow's server, which generates a one-time PIN and emails it via Amazon SES. The
        server keeps only a salted hash of the PIN until it is used or expires after 10 minutes,
        plus a daily count of emails sent per account to prevent abuse. The sites you visit are
        never included.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Cloud settings sync</h3>
      <p className="mt-3 text-ink-muted">
        Signing in with Google is entirely optional — Blockerflow is fully functional offline
        with no account. If you choose to sign in, your settings (blocking toggles,
        blocklist/whitelist entries, and similar preferences) sync to a Firestore document scoped
        to your account. Device-local state (such as whether onboarding is complete) and your
        browsing history or blocklist match decisions are never synced — only configuration is.
        This data is stored under your Google account's identity in Firebase and is governed by
        Firebase's own terms.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Permissions</h2>
      <table className="mt-3 w-full border-collapse text-left text-sm text-ink-muted">
        <thead>
          <tr className="border-b border-outline">
            <th className="py-2 pr-4 font-medium text-ink">Permission</th>
            <th className="py-2 font-medium text-ink">Why</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-outline">
            <td className="py-2 pr-4">Accessibility Service</td>
            <td className="py-2">Read on-screen content to detect and block</td>
          </tr>
          <tr className="border-b border-outline">
            <td className="py-2 pr-4">Internet</td>
            <td className="py-2">
              The three optional features above — never used to upload browsing data
            </td>
          </tr>
          <tr className="border-b border-outline">
            <td className="py-2 pr-4">Device Admin</td>
            <td className="py-2">Optional uninstall protection</td>
          </tr>
          <tr className="border-b border-outline">
            <td className="py-2 pr-4">Foreground Service</td>
            <td className="py-2">Keeps the blocker running</td>
          </tr>
          <tr className="border-b border-outline">
            <td className="py-2 pr-4">Notifications</td>
            <td className="py-2">Status notifications</td>
          </tr>
          <tr>
            <td className="py-2 pr-4">Query All Packages</td>
            <td className="py-2">Lists installed apps so you can choose which to block</td>
          </tr>
        </tbody>
      </table>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">No sale of data</h2>
      <p className="mt-3 text-ink-muted">
        Blockerflow does not sell your data, does not use third-party advertising SDKs, and does
        not track you across apps or websites.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Contact</h2>
      <p className="mt-3 text-ink-muted">
        Questions about this policy can be sent to{' '}
        <a href="mailto:khaleel.eu@gmail.com" className="text-primary hover:underline">
          khaleel.eu@gmail.com
        </a>
        .
      </p>
    </article>
  )
}
