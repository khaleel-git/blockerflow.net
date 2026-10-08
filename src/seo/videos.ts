export interface DemoVideoInfo {
  src: string
  poster: string
  name: string
  description: string
  durationSeconds: number
}

export const VIDEOS = {
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
} satisfies Record<string, DemoVideoInfo>

export type VideoKey = keyof typeof VIDEOS
