export const SITE_URL = 'https://blockerflow.net'
export const SITE_NAME = 'Blockerflow'
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=eu.khaleel.blockerflow'
export const OG_IMAGE = `${SITE_URL}/assets/feature-graphic.png`
/** Date the guide pages were first published, used for Article schema and the sitemap. */
export const PUBLISHED = '2026-10-08'

/** Cloudflare Pages redirects every page to its trailing slash URL, so that is the canonical form. */
export function absoluteUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}/`
}
