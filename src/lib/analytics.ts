/**
 * Google Analytics for the website (the same Analytics property as the app, Firebase web app
 * "Blockerflow website"). Loaded only after the visitor allows it on the consent banner, as EU law
 * requires for its cookies; until then nothing is sent to Google. No advertising features.
 */

export const MEASUREMENT_ID = 'G-13FX3BGT2F'
const KEY = 'bf-analytics-consent'

export type Consent = 'granted' | 'denied'

/** This page's choice, for when storage is unavailable (private windows). */
let memory: Consent | null = null

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : memory
  } catch {
    return memory
  }
}

export function setConsent(c: Consent): void {
  memory = c
  try {
    localStorage.setItem(KEY, c)
  } catch {
    // Private mode: the choice lasts for this page only.
  }
  if (c === 'granted') loadAnalytics()
}

export function clearConsent(): void {
  memory = null
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

type Gtag = (...args: unknown[]) => void
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

let loaded = false

/** Injects gtag.js once. Page views are sent by trackPageView on every route change. */
export function loadAnalytics(): void {
  if (loaded || typeof document === 'undefined') return
  loaded = true
  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag() {
    // gtag.js reads the arguments object itself.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(s)
}

/** One page view, only when the visitor allowed analytics. */
export function trackPageView(path: string): void {
  if (getConsent() !== 'granted') return
  loadAnalytics()
  window.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href, page_title: document.title })
}
