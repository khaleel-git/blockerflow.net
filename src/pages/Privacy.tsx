import { usePageMeta } from '../hooks/usePageMeta'

export function Privacy() {
  usePageMeta('/privacy')

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
        If you choose the AI Coach as your accountability partner (requires sign-in), each time
        you try to disable a blocker the app sends the reason you type and the name of the
        feature to Blockerflow's server, which forwards it to Google's Gemini API for an
        approve/reject decision. Your browsing history is never sent. The server does not store
        your text; it only keeps a per-account daily count of checks to enforce a free daily
        limit. If Gemini returns an error or an answer the server can't read, that answer — which
        may quote your reason — is written to the server's error log. Google's handling of this
        text is governed by the Gemini API terms.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Accountability Partner</h3>
      <p className="mt-3 text-ink-muted">
        If you set an accountability partner's email address (requires sign-in), the app sends
        that address to Blockerflow's server, which generates a one-time PIN and emails it via
        Amazon SES. The server keeps only a salted hash of the PIN until it is used or expires
        after 10 minutes, plus a daily count of emails sent per account to prevent abuse. The
        sites you visit are never included.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Cloud settings sync</h3>
      <p className="mt-3 text-ink-muted">
        Signing in with Google is entirely optional — Blockerflow is fully functional offline
        with no account. If you choose to sign in, Blockerflow stores the following in a
        Firestore document scoped to your account:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-muted">
        <li>
          <strong className="text-ink">Profile:</strong> the email, display name, and photo URL
          Google Sign-In returns
        </li>
        <li>
          <strong className="text-ink">Settings:</strong> your blocking toggles,
          blocklist/whitelist entries, and similar preferences — including your
          accountability-partner mode and email, if you've set one
        </li>
      </ul>
      <p className="mt-3 text-ink-muted">
        Device-local state (such as whether onboarding is complete) and your browsing history or
        blocklist match decisions are never synced. This data is stored under your Google
        account's identity in Firebase and is governed by Firebase's own terms. Signing out stops
        further sync; it does not delete what was already written to Firestore.
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

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Your choices</h2>
      <p className="mt-3 text-ink-muted">
        Every feature that sends data off-device is opt-in — simply not setting an accountability
        partner, not choosing the AI Coach, and not signing in with Google means nothing leaves
        your device at all.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Deleting your account</h3>
      <p className="mt-3 text-ink-muted">
        If you've signed in with Google, you can permanently delete your account and everything
        synced to the cloud (your profile and settings document) directly in the app: open
        Blockerflow, go to Settings, scroll to Danger Zone, and tap Delete Account. Confirming
        deletes your Firestore data and your Firebase Auth account outright; this cannot be
        undone. Blocking settings stored only on your device are not affected by this and can be
        cleared separately with Factory Reset, also in Settings. If you'd rather not use the
        in-app option, email us at the address below and we'll delete it for you.
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
