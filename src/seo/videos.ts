export interface DemoVideoInfo {
  src: string
  poster: string
  name: string
  description: string
  durationSeconds: number
  /** 16:9 clips render wide instead of in a phone shaped box. */
  landscape?: boolean
}

const DATA = {
  websiteBlock: {
    src: '/assets/videos/website-block.mp4',
    poster: '/assets/videos/website-block.jpg',
    name: 'Blockerflow blocking an adult website in the browser',
    description:
      'Screen recording of Blockerflow on Android showing the Content Blocked screen the moment an adult website is opened in the browser.',
    durationSeconds: 15,
  },
  focusMode: {
    src: '/assets/videos/focus-facebook.mp4',
    poster: '/assets/videos/focus-facebook.jpg',
    name: 'Blockerflow Focus Mode blocking Facebook',
    description:
      'Screen recording of a Blockerflow Focus Mode session: naming and timing a session, then Facebook being blocked while it runs.',
    durationSeconds: 18,
  },
  challenge: {
    src: '/assets/videos/self-challenge.mp4',
    poster: '/assets/videos/self-challenge.jpg',
    name: 'Blockerflow typing challenge before disabling protection',
    description:
      'Screen recording of the typing challenge Blockerflow shows when you try to uninstall or disable protection.',
    durationSeconds: 33,
  },
  overview: {
    src: '/assets/videos/combined.mp4',
    poster: '/assets/videos/combined.jpg',
    name: 'Blockerflow app overview',
    description:
      'A walkthrough of Blockerflow for Android: adult content blocking, social video blocking, Focus Mode and accountability partner options.',
    durationSeconds: 48,
  },
  pornBlocker: {
    src: '/assets/videos/porn-blocker.mp4',
    poster: '/assets/videos/porn-blocker.jpg',
    name: 'Blockerflow porn blocker for Android',
    description:
      'A short promo video showing how Blockerflow blocks porn on Android, in the browser and in apps.',
    durationSeconds: 15,
  },
  urgeTyping: {
    src: '/assets/videos/urge-typing.mp4',
    poster: '/assets/videos/urge-typing.jpg',
    name: 'Blockerflow typing challenge at 11 PM',
    description:
      'A short promo showing the typing challenge Blockerflow asks for before protection can be switched off late at night.',
    durationSeconds: 15,
  },
  reelsShorts: {
    src: '/assets/videos/reels-shorts.mp4',
    poster: '/assets/videos/reels-shorts.jpg',
    name: 'Blockerflow blocking Reels and Shorts',
    description:
      'A short promo showing Blockerflow blocking Instagram Reels, YouTube Shorts, Snapchat Spotlight and X videos while messages stay usable.',
    durationSeconds: 15,
  },
  focusPromo: {
    src: '/assets/videos/focus-promo.mp4',
    poster: '/assets/videos/focus-promo.jpg',
    name: 'Blockerflow Focus Mode promo',
    description:
      'A short promo of Blockerflow Focus Mode: pick a session, set the time and start, with social apps blocked until it ends.',
    durationSeconds: 15,
  },
  accountability: {
    src: '/assets/videos/accountability.mp4',
    poster: '/assets/videos/accountability.jpg',
    name: 'Blockerflow accountability partner options',
    description:
      'The four accountability options in Blockerflow: Friend, Myself, Time Delay and AI Coach.',
    durationSeconds: 15,
    landscape: true,
  },
  privacy: {
    src: '/assets/videos/privacy.mp4',
    poster: '/assets/videos/privacy.jpg',
    name: 'Blockerflow checks sites on your phone',
    description:
      'An explainer showing web addresses checked against a 1.1M+ site blocklist on the phone, not on a server.',
    durationSeconds: 15,
    landscape: true,
  },
} satisfies Record<string, DemoVideoInfo>

export type VideoKey = keyof typeof DATA

export const VIDEOS: Record<VideoKey, DemoVideoInfo> = DATA
