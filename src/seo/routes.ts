import { ARTICLES } from './articles'

export interface RouteMeta {
  path: string
  title: string
  description: string
  /** Pages that should not appear in search results or the sitemap. */
  noindex?: boolean
}

export const NOT_FOUND_META: RouteMeta = {
  path: '/404',
  title: 'Page not found — Blockerflow',
  description: 'The page you are looking for does not exist.',
  noindex: true,
}

export const ROUTE_META: RouteMeta[] = [
  {
    path: '/',
    title: 'Blockerflow: Porn Blocker & Reels Blocker for Android',
    description:
      'Blockerflow is an Android app that blocks porn, Instagram Reels, YouTube Shorts and other distractions, with an accountability partner and uninstall protection.',
  },
  {
    path: '/guide',
    title: 'How to Set Up Blockerflow: Android Blocker Setup Guide',
    description:
      'Five steps from install to a blocker you cannot talk yourself out of: permissions, blocklist, Focus Mode, accountability partner and uninstall protection.',
  },
  {
    path: '/guides',
    title: 'Guides: Block Porn, Reels and Shorts on Android',
    description:
      'Practical guides to blocking porn, Instagram Reels, YouTube Shorts and social media on Android, with the exact switches to use in the app.',
  },
  ...ARTICLES.map((a) => ({
    path: `/guides/${a.slug}`,
    title: a.title,
    description: a.description,
  })),
  {
    path: '/support',
    title: 'Support Blockerflow: Keep the App Free',
    description:
      'Blockerflow is free. See what donations pay for, pick an amount, and see how many days of Mac and Windows app signing it covers.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — Blockerflow',
    description:
      'What Blockerflow does and does not send off your device. No analytics SDK, no crash reporter, and your browsing history stays on your phone.',
  },
  {
    path: '/terms',
    title: 'Terms & Conditions — Blockerflow',
    description: 'The terms that apply to using the Blockerflow Android app and this website.',
  },
]

export function getRouteMeta(path: string): RouteMeta {
  return ROUTE_META.find((r) => r.path === path) ?? NOT_FOUND_META
}
