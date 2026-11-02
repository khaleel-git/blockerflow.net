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
    title: 'Blockerflow: Free Porn Blocker and Instagram Blocker for Android',
    description:
      'Free blocker for Android, Mac and Windows: block porn, Instagram, Reels, YouTube Shorts and Snapchat, with an accountability partner and uninstall protection.',
  },
  {
    path: '/guide',
    title: 'How to Set Up Blockerflow: Android Blocker Setup Guide',
    description:
      'Five steps from install to a blocker you cannot talk yourself out of: permissions, blocklist, Focus Mode, accountability partner and uninstall protection.',
  },
  {
    path: '/guides',
    title: 'Guides: Block Porn, Instagram, Snapchat and Shorts on Android',
    description:
      'Step by step guides to blocking porn, Instagram, Reels, YouTube Shorts and Snapchat on Android, with the exact switches to use in the app.',
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
      'What Blockerflow does and does not send off your device. Anonymous usage counts only, no crash reporter, and your browsing history stays on your device.',
  },
  {
    path: '/terms',
    title: 'Terms & Conditions — Blockerflow',
    description: 'The terms that apply to using the Blockerflow Android app and this website.',
  },
  {
    path: '/dashboard',
    title: 'Dashboard — Blockerflow',
    description: 'Your Blockerflow devices, their settings and block counts. Remove a device or delete your account.',
    noindex: true,
  },
  {
    path: '/admin',
    title: 'Admin — Blockerflow',
    description: 'Private page for the Blockerflow team.',
    noindex: true,
  },
  {
    path: '/marketing',
    title: 'Shorts studio — Blockerflow',
    description: 'Private page for the Blockerflow team.',
    noindex: true,
  },
]

export function getRouteMeta(path: string): RouteMeta {
  return ROUTE_META.find((r) => r.path === path) ?? NOT_FOUND_META
}
