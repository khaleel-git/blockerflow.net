export interface DemoVideoInfo {
  src: string
  poster: string
  name: string
  description: string
  durationSeconds: number
  /** 16:9 clips render wide instead of in a phone shaped box. */
  landscape?: boolean
  /** CSS aspect ratio of the file, when it is not the default 9 / 16 or 16 / 9. */
  aspect?: string
}

const DATA = {
  challenge: {
    src: '/assets/videos/self-challenge.mp4',
    poster: '/assets/videos/self-challenge.jpg',
    name: 'Blockerflow typing challenge before disabling protection',
    description:
      'Screen recording of the typing challenge Blockerflow shows when you try to uninstall or disable protection.',
    durationSeconds: 33,
    aspect: '9 / 20',
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
  reelsGuide: {
    src: '/assets/videos/reels-guide.mp4',
    poster: '/assets/videos/reels-guide.jpg',
    name: 'How to block Instagram Reels on Android with Blockerflow',
    description:
      'A narrated walkthrough: open the Blocking tab, scroll to Social Blocking and switch on Block Instagram reels, while messages, feed and Stories keep working.',
    durationSeconds: 39,
  },
  shortsGuide: {
    src: '/assets/videos/shorts-guide.mp4',
    poster: '/assets/videos/shorts-guide.jpg',
    name: 'How to block YouTube Shorts on Android with Blockerflow',
    description:
      'A narrated walkthrough: open the Blocking tab, scroll to Social Blocking and switch on Block Youtube Shorts, while normal videos and subscriptions keep working.',
    durationSeconds: 36,
  },
  spotlightGuide: {
    src: '/assets/videos/spotlight-guide.mp4',
    poster: '/assets/videos/spotlight-guide.jpg',
    name: 'How to block Snapchat Spotlight on Android with Blockerflow',
    description:
      'A narrated walkthrough: switch on Block Snapchat videos and Block Snapchat search in the Social Blocking card, while chats, the camera and Stories keep working.',
    durationSeconds: 39,
  },
  imageSearchGuide: {
    src: '/assets/videos/image-search-guide.mp4',
    poster: '/assets/videos/image-search-guide.jpg',
    name: 'How to block image and video search on Android with Blockerflow',
    description:
      'A narrated walkthrough: switch on Block image & video search in the Content Blocking card to close the image and video tabs on five search engines.',
    durationSeconds: 37,
  },
  blocklistGuide: {
    src: '/assets/videos/blocklist-guide.mp4',
    poster: '/assets/videos/blocklist-guide.jpg',
    name: 'How to block any app or website on Android with Blockerflow',
    description:
      'A narrated walkthrough of the Blocklist tab: add an installed app with the plus button, add a domain under Websites, and block apps installed later.',
    durationSeconds: 41,
  },
  focusGuide: {
    src: '/assets/videos/focus-guide.mp4',
    poster: '/assets/videos/focus-guide.jpg',
    name: 'How to start a Focus Mode session in Blockerflow',
    description:
      'A narrated walkthrough of Focus Mode: pick a session name and length, press Start, see what is blocked, and switch on Protect Focus Mode.',
    durationSeconds: 50,
  },
  pornBlockerGuide: {
    src: '/assets/videos/porn-blocker-guide.mp4',
    poster: '/assets/videos/porn-blocker-guide.jpg',
    name: 'How to block porn on Android with Blockerflow',
    description:
      'A narrated walkthrough: the three setup tasks including Autostart, Protection active, add image and video search blocking, keep unsupported browsers blocked and switch on Uninstall Protection.',
    durationSeconds: 68,
  },
  accountabilityGuide: {
    src: '/assets/videos/accountability-guide.mp4',
    poster: '/assets/videos/accountability-guide.jpg',
    name: 'How to choose an accountability partner in Blockerflow',
    description:
      'A narrated walkthrough of the four accountability partners, Friend, Myself, Time Delay and AI Coach, and what each challenge looks like.',
    durationSeconds: 54,
  },
  uninstallGuide: {
    src: '/assets/videos/uninstall-protection-guide.mp4',
    poster: '/assets/videos/uninstall-protection-guide.jpg',
    name: 'How to turn on Uninstall Protection in Blockerflow',
    description:
      'A narrated walkthrough: switch on Uninstall Protection, approve the device admin request, and see the typing challenge and the clean way to uninstall.',
    durationSeconds: 49,
  },
} satisfies Record<string, DemoVideoInfo>

export type VideoKey = keyof typeof DATA

export const VIDEOS: Record<VideoKey, DemoVideoInfo> = DATA
