import { usePageMeta } from '../hooks/usePageMeta'

export function Privacy() {
  usePageMeta('/privacy')

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 [overflow-wrap:anywhere]">
      <h1 className="font-display text-3xl font-bold text-ink">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-muted">Last updated: 5 November 2026</p>

      <p className="mt-8 text-ink-muted">
        This policy describes what Blockerflow reads, what stays on your device, and what leaves
        it. Blocking content requires seeing what is on screen, so Blockerflow uses Android's
        Accessibility Service to read on-screen information in browsers and supported apps,
        including the web address in your browser's address bar, and decides locally whether to
        block it. The Windows app uses Windows UI Automation to read the address bar of the browser
        in front and to see which app is in front. The Mac app filters web traffic through a proxy
        that runs on your Mac and reads the address of the front tab in supported browsers with
        Apple Events. On all three, a picture check can also look at the screen for explicit
        pictures, entirely on your device (see below).
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">On-device processing</h2>
      <p className="mt-3 text-ink-muted">
        The following is processed entirely on your device and never uploaded:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-muted">
        <li>
          Web addresses read from your browser, checked locally against Blockerflow's block lists
          on your device
        </li>
        <li>
          On Android, for a site that is not in the block lists, the visible text of the page (its
          title, headings and short link text), read through the Accessibility Service and checked
          in memory to recognise adult pages; the text is never saved or sent
        </li>
        <li>
          On Windows, for a site that is not in the block lists, the page's title and, where the
          browser shows it to UI Automation, the page's visible text (Firefox shows it; Chrome, Edge
          and other Chromium browsers show only the title), checked a few times in the first
          seconds to recognise adult pages; the text is never saved, logged or sent
        </li>
        <li>
          On-screen accessibility content, such as detecting a Reels or Shorts feed, inspected
          locally in memory
        </li>
        <li>
          On Windows, the address bar of the browser in front and the name of the app in front,
          read with UI Automation and checked locally
        </li>
        <li>
          On Windows, the programs installed on the PC (Start menu shortcuts, the installed
          programs list Windows shows in Settings, and Microsoft Store apps for the signed in
          Windows user), with their names and icons, so you can pick apps to block and for Block
          newly installed apps. This list stays on the PC and is never sent; only the apps on your
          block list are part of your settings
        </li>
        <li>
          On Windows, while Uninstall Protection is on, the command lines of programs that start,
          to end commands that would uninstall or stop Blockerflow (such as winget, PowerShell or
          taskkill naming it), and the window of the Settings app and of a standard user's Task
          Manager, to close them while they show Blockerflow. Nothing of this is saved or sent
        </li>
        <li>
          On Mac, the web addresses passing through the local filtering proxy and the address of
          the front browser tab, checked locally
        </li>
        <li>Pictures on screen, for the picture check described below</li>
        <li>Your blocklist, allowlist, and settings, stored locally on your device</li>
      </ul>
      <p className="mt-3 text-ink-muted">
        Your browsing history is not uploaded. Blockerflow has no crash reporter. The Android app
        counts how many people use it with Google Analytics for Firebase (see Usage statistics
        below); that never includes sites, searches, apps, pictures or what was blocked.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">The picture check</h2>
      <p className="mt-3 text-ink-muted">
        Some explicit pictures and videos have no address that gives them away, for example inside
        a chat app. To catch them, Blockerflow looks at what is on screen and checks it with an
        image model, NudeNet 320n, that runs on your device. How it works on each platform:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-muted">
        <li>
          <strong className="text-ink">Android:</strong> only while Block adult content is on and
          after you accept the disclosure that covers it, on Android 11 or newer. The screen is
          captured through the Accessibility Service every few seconds while you use an app, and
          checked in a separate process of the app.
        </li>
        <li>
          <strong className="text-ink">Windows:</strong> only while Block adult content is on (the
          picture check is built into it). Every few seconds the window in front is captured with
          DXGI Desktop Duplication, cropped to that window, and checked by a separate program that
          comes with the app, vision\blockerflow-vision.exe. No extra permission or capture prompt
          is needed.
        </li>
        <li>
          <strong className="text-ink">Mac:</strong> only while Block adult images is on, on macOS
          14 or newer, and after you allow Screen Recording. Every few seconds while a browser, a
          messenger (such as WhatsApp, Telegram, Discord, Messages or Signal) or a photo or video
          app is in front, the main display is captured with ScreenCaptureKit, without
          Blockerflow's own windows, and checked by a separate program inside the app,
          blockerflow-vision.
        </li>
      </ul>
      <p className="mt-3 text-ink-muted">
        Pictures stay in memory only for that check. They are never written to disk, never logged
        and never sent anywhere. Only scores come back to the app. The program that runs the model
        has no network code; its source is public at{' '}
        <a
          href="https://github.com/khaleel-git/blockerflow-vision"
          className="text-primary hover:underline"
        >
          github.com/khaleel-git/blockerflow-vision
        </a>{' '}
        under the GNU AGPL 3.0, and it uses ONNX Runtime (MIT licence).
      </p>
      <p className="mt-3 text-ink-muted">
        Never looked at: Blockerflow itself, the lock screen and video call apps. On Windows, full
        screen games and presentations are not looked at either. On Android, call screens inside
        chat apps, home screens, keyboards, cameras, the phone app and simple tools such as clocks
        and calculators are left out too.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Posts on X</h2>
      <p className="mt-3 text-ink-muted">
        On Android, with Block adult content on, Blockerflow reads the posts on your screen in the X
        app: the author&apos;s name and handle, the text and the descriptions of its pictures. A post
        with clear adult words, or from an account named that way, is blocked. Posts about quitting
        or recovery are left open. This happens on your phone; post text is not saved or sent. On
        Mac and Windows, X posts are only looked at by the picture check.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Telegram and WhatsApp</h2>
      <p className="mt-3 text-ink-muted">
        To block Telegram channels and chats that keep showing explicit pictures, Blockerflow reads
        the name at the top of an open chat and the line under it (such as "12K subscribers" or
        "5 members"). Messages are never read.
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-muted">
        <li>
          <strong className="text-ink">Android:</strong> the top of the open chat is read through
          the Accessibility Service. With Block Telegram channels on, a chat whose line says
          subscribers is a channel and is blocked. With Block adult content on, the names of
          Telegram and Discord groups and channels are checked with the same rule as searches.
          WhatsApp chat names are never judged, because they are people's names; WhatsApp channels
          have their own switch, Block WhatsApp channels.
        </li>
        <li>
          <strong className="text-ink">Windows:</strong> while Block Telegram channels or Block
          adult content is on and Telegram Desktop or WhatsApp is in front, about once a second the
          top strip of its window (the title bar and the open chat's name line) is read with
          Windows' built in offline text recognition, Windows.Media.Ocr. This tells whether the open
          chat is a Telegram channel and which chat is open. The picture of the strip and the text
          stay in memory and are never saved or sent.
        </li>
        <li>
          <strong className="text-ink">Mac:</strong> chat names are not read. Telegram and WhatsApp
          are only looked at by the picture check.
        </li>
      </ul>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Remembered chats</h3>
      <p className="mt-3 text-ink-muted">
        A chat, group, channel or community that keeps showing explicit pictures is remembered, so
        opening it again is blocked at once. This is part of Block adult content, on Android
        (Telegram, Discord, WhatsApp and Reddit communities) and on Windows (Telegram Desktop and
        WhatsApp). It takes three picture blocks in the same chat within 30 minutes, so one or two
        misread photos are not enough, and the chat is forgotten after 30 days.
      </p>
      <p className="mt-3 text-ink-muted">
        Only a fingerprint is stored: a SHA 256 hash of the app and the chat's name, with the times
        of the blocks. The name itself, the pictures and the messages are never stored. The
        fingerprints are kept in the app's private storage on Android (excluded from backups) and
        in %LOCALAPPDATA%\Blockerflow\learned_chats.json on Windows. They never leave your
        device: they are not synced, not shown on the dashboard and not sent anywhere.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Remembered sites (Android and Windows)</h3>
      <p className="mt-3 text-ink-muted">
        The page check is part of Block adult content and skips the 10,000 most visited sites. A
        site that it finds to be adult is remembered for 30 days, so it is blocked
        at once next time. Only a fingerprint is stored: a SHA 256 hash of the site's name. The
        page text, the full address and your other browsing are never stored. The fingerprints are
        kept in the app's private storage on Android (excluded from backups) and in
        %LOCALAPPDATA%\Blockerflow\learned_sites.json on Windows. They never leave your device and
        are forgotten when you report the block as wrong.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Block list updates (Android and Windows)</h3>
      <p className="mt-3 text-ink-muted">
        Once a day, and when you open the app (at most every 3 hours), the Android and Windows apps
        download the newest block lists from lists.blockerflow.net, a public file server on Cloudflare. These
        are the same files for everyone; the request carries no account, device ID, browsing or
        settings. Cloudflare sees the request like any web request (IP address, time). The app only
        installs lists signed by Blockerflow. On Windows the app first fetches a small signed index
        and downloads list files only when it is newer; it installs them only when the signature
        (ECDSA P 256) and every file's SHA 256 hash check out, and otherwise keeps the lists it has.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Streaks and screen time (Android)</h2>
      <p className="mt-3 text-ink-muted">
        From version 1.0.30 the Android app has a Progress tab with your clean streak, your own
        personal streak and your screen time. It is off until you agree to it, at setup or in a one
        time notice. Everything it keeps stays on your phone:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-muted">
        <li>
          <strong className="text-ink">Clean streak:</strong> the day it started, the days an adult
          search or site was blocked, how many blocked attempts there were per day, and the days you
          marked a break as not on purpose. Kept for the last 400 break days and 60 days of
          attempts, in the app's settings store.
        </li>
        <li>
          <strong className="text-ink">Personal streak:</strong> its name, start day, relapse days,
          what set a relapse off and the resolution you wrote. Kept in one private file until you
          delete it.
        </li>
        <li>
          <strong className="text-ink">Screen time:</strong> how many seconds each app was open per
          day. Kept in one private file per day for 30 days. Delete screen time on the Progress tab
          removes all of it.
        </li>
      </ul>
      <p className="mt-3 text-ink-muted">
        Never a time of day, a site, a search or a picture: days and counts only. To celebrate a
        milestone only once, the app also remembers on your phone the last day number it showed you
        and the highest milestone it celebrated. The app has Android backup switched off, and these
        files are left out of a phone to phone transfer. None of it appears in logs, analytics or
        crash reports, and Blockerflow's support team cannot see it. Nothing of it is sent
        anywhere.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Backup file</h3>
      <p className="mt-3 text-ink-muted">
        On the Progress tab you can save your streaks as a file and restore them later, for example
        after a reinstall. You choose where it goes through Android's own file picker: the phone's
        storage, Google Drive or any other storage app. Blockerflow never receives it and never
        talks to a storage service itself. The file always holds the clean streak's days and counts
        and the personal streak's days; the streak's name, what set a relapse off and your
        resolutions only if you tick Include my resolutions. Screen time, settings and anything
        about your account or device are never in it. The file is not encrypted, so anyone who has
        it can read it; a copy in Google Drive is kept by Google under your Google account.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">What leaves your device</h2>
      <p className="mt-3 text-ink-muted">
        Apart from the anonymous usage statistics below, the block list downloads described above
        and the wrong block reports you choose to send, only three features send anything
        off-device. Each is optional and only activates when you deliberately turn it on.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Usage statistics (Android app)</h3>
      <p className="mt-3 text-ink-muted">
        The Android app uses Google Analytics for Firebase to count active users. It sends only
        Firebase's automatic events (first open, sessions, time in the app, app updates, the name
        of the app screen) with a random app instance ID, the device model, Android version, app
        version and approximate country derived from the IP address. It sends no custom events,
        never sites, searches, apps, pictures or block decisions, and collects no advertising ID;
        ad personalisation is off. Google keeps this data for the retention period set in
        Analytics. The Mac and Windows apps do not use Analytics.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">
        Wrong block reports and Contact support
      </h3>
      <p className="mt-3 text-ink-muted">
        Wrongly blocked? Report it, on the block screen of the Android, Windows and Mac apps, shows
        exactly what will be sent: what was blocked (the site's name or the app), the reason the
        block screen showed, the app version and your optional note. On Windows it also names the
        program the block happened in, when that is not the blocked thing itself. If you are signed
        in and press Send, the report goes to Blockerflow's server, is stored for the support team
        and is emailed to support@blockerflow.net together with your account.
      </p>
      <p className="mt-3 text-ink-muted">
        If you are signed out, Blockerflow sends nothing itself. On Android and Mac the report
        opens in your email app, filled in, for you to send or not. On Windows you can copy the same
        text and email it yourself. Contact support in Settings works the same way: on Android it
        opens your email app with the app version, phone model and Android version filled in, on
        Mac with the app version, and on Windows it shows the support address and a Copy button
        that adds the app version, PC model and Windows version for you to paste.
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
        with no account. If you choose to sign in, Blockerflow stores the following in Firestore,
        scoped to your account:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-muted">
        <li>
          <strong className="text-ink">Profile:</strong> the email, display name, and photo URL
          Google Sign-In returns
        </li>
        <li>
          <strong className="text-ink">One record per device:</strong> each phone or computer you
          sign in on has its own record with its settings (blocking switches, blocklist and
          allowlist entries, blocked apps, your accountability partner mode and email, if you've
          set one), the platform (Android, Mac or Windows), the device model (for example "Pixel 8"
          or "MacBook Air"), the system and app version, and when it was first and last seen. A
          random ID identifies the record; no device name, computer name, phone number or
          hardware ID is stored. Each device keeps its own settings: a change on one never
          changes another.
        </li>
        <li>
          <strong className="text-ink">Block counts:</strong> per device and day, how many times
          something was blocked in each category (for example adult content, YouTube Shorts,
          Focus Mode). Never which site, app or search was blocked and never the time. Each day's
          counts are deleted automatically after 30 days. They are shown only to you, on the
          dashboard.
        </li>
      </ul>
      <p className="mt-3 text-ink-muted">
        Device-local state (such as whether onboarding is complete) and your browsing history or
        blocklist match decisions are never synced. This data is stored under your Google
        account's identity in Firebase and is governed by Firebase's own terms. Signing out stops
        further sync; it does not delete what was already written to Firestore.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Dashboard</h3>
      <p className="mt-3 text-ink-muted">
        At{' '}
        <a href="/dashboard/" className="text-primary hover:underline">
          blockerflow.net/dashboard
        </a>{' '}
        you can sign in with the same Google account to see your devices, each device's settings
        (read only; settings can only be changed in the app) and its block counts, remove a device
        or delete your account. Removing a device deletes its record and block counts and signs
        it out; protection on that device keeps running with the settings it has. The dashboard
        uses Firebase Authentication to sign you in and reads only your own data.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Permissions</h2>
      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Android permissions</h3>
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
            <td className="py-2">
              Read on-screen content to detect and block, on the phone only: web addresses and,
              on sites it does not know, page text; what you type in search boxes in browsers and
              apps (in-app search history); which app is open and for how long (screen time); the
              names of groups and channels you open; the names and text of posts in X; pictures
              on screen (Android 11 and newer); and the Settings screens you open during setup
            </td>
          </tr>
          <tr className="border-b border-outline">
            <td className="py-2 pr-4">Internet</td>
            <td className="py-2">
              Block list downloads, usage statistics, wrong block reports you choose to send, and
              the optional AI Coach, Accountability Partner and cloud sync. Never used to upload
              browsing data
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
      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Windows and Mac</h3>
      <p className="mt-3 text-ink-muted">
        The Windows app runs as a full trust desktop app (the runFullTrust capability), which UI
        Automation, the tray icon and starting with Windows need. It asks for no extra permission,
        and the picture check shows no capture prompt. The Mac app asks macOS for Screen Recording
        (the picture check), Automation for each supported browser (reading the front tab's
        address), and may ask for your password to set up its local proxy and certificate.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">No sale of data</h2>
      <p className="mt-3 text-ink-muted">
        Blockerflow does not sell your data, does not use third-party advertising SDKs, and does
        not track you across apps or websites.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Your choices</h2>
      <p className="mt-3 text-ink-muted">
        Apart from the Android app's anonymous usage statistics and the block list downloads,
        every feature that sends data about you off-device is opt-in. If you do not set an
        accountability partner, do not choose the AI Coach, do not send a report and do not sign
        in with Google, nothing else about you leaves your device. The block list downloads send
        nothing about you.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Deleting your account</h3>
      <p className="mt-3 text-ink-muted">
        If you've signed in with Google, you can permanently delete your account and everything
        stored in the cloud (your profile, every device record with its settings, and all block
        counts) in the app (Settings, Reset and delete, Delete Account) or on{' '}
        <a href="/dashboard/" className="text-primary hover:underline">
          blockerflow.net/dashboard
        </a>
        . Confirming deletes your Firestore data and your Firebase Auth account outright; this
        cannot be undone. Blocking settings stored only on your device are not affected by this
        and can be cleared separately with Factory Reset, also in Settings. If you'd rather not
        use either option, email us at the address below and we'll delete it for you.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">Support access</h3>
      <p className="mt-3 text-ink-muted">
        To help you when you contact support, the Blockerflow developer can see your account's
        email, devices, their settings and block counts, and the store statistics for all users
        (totals only). Settings are changed only when you ask for it by email; every change is
        logged, you receive an email listing what was changed, and the app tells you too. An
        account that abuses the service can be blocked from signing in; its devices keep
        protecting with the settings they have.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">This website</h2>
      <p className="mt-3 text-ink-muted">
        blockerflow.net uses Google Analytics only if you choose Allow on the banner. It then sets
        Google Analytics cookies and sends the pages you view, the referring site, your browser,
        device type and approximate location derived from your IP address to Google. No
        advertising features are used. If you choose No thanks, or ignore the banner, Analytics is
        not loaded and nothing is sent. You can change your choice at any time with Analytics
        settings at the bottom of every page. The dashboard reads your account data only after you
        sign in, and that data is never sent to Analytics.
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
