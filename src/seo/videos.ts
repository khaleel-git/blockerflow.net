import { SITE_URL, UPDATED } from './site'

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
  /** The same video on the Blockerflow YouTube channel, when it has been uploaded there. */
  youtube?: string
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
    youtube: 'https://www.youtube.com/shorts/7vdufIGIdlw',
    name: 'How to block Instagram Reels on Android with Blockerflow',
    description:
      'A narrated walkthrough: open the Blocking tab, scroll to Social Blocking and switch on Block Instagram reels, while messages, feed and Stories keep working.',
    durationSeconds: 38,
  },
  shortsGuide: {
    src: '/assets/videos/shorts-guide.mp4',
    poster: '/assets/videos/shorts-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/UOP-dEVHJAA',
    name: 'How to block YouTube Shorts on Android with Blockerflow',
    description:
      'A narrated walkthrough: open the Blocking tab, scroll to Social Blocking and switch on Block Youtube Shorts, while normal videos and subscriptions keep working.',
    durationSeconds: 36,
  },
  spotlightGuide: {
    src: '/assets/videos/spotlight-guide.mp4',
    poster: '/assets/videos/spotlight-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/-YkOHVd3i5M',
    name: 'How to block Snapchat Spotlight on Android with Blockerflow',
    description:
      'A narrated walkthrough: switch on Block Snapchat videos in the Social group, and Spotlight opens to Content Blocked while chats, the camera and Stories from your friends keep working.',
    durationSeconds: 31,
  },
  snapchatSearchGuide: {
    src: '/assets/videos/snapchat-search-guide.mp4',
    poster: '/assets/videos/snapchat-search-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/1JbkCEQdZfg',
    name: 'How to block Snapchat search on Android with Blockerflow',
    description:
      'A narrated walkthrough: switch on Block Snapchat search in the Social group, and the search page opens to Content Blocked while chats, the camera and Stories from your friends keep working.',
    durationSeconds: 33,
  },
  instagramSearchGuide: {
    src: '/assets/videos/instagram-search-guide.mp4',
    poster: '/assets/videos/instagram-search-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/gsoEEweQ3aA',
    name: 'How to block Instagram search on Android with Blockerflow',
    description:
      'A narrated walkthrough: switch on Block Instagram search in the Social group, and the search and Explore page opens to Content Blocked while messages, feed and Stories keep working.',
    durationSeconds: 37,
  },
  imageSearchGuide: {
    src: '/assets/videos/image-search-guide.mp4',
    poster: '/assets/videos/image-search-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/xK5uf7npzt0',
    name: 'How to block image and video search on Android with Blockerflow',
    description:
      'A narrated walkthrough: switch on Block image & video search in the Content Blocking card to close the image and video tabs on five search engines.',
    durationSeconds: 37,
  },
  blocklistGuide: {
    src: '/assets/videos/blocklist-guide.mp4',
    poster: '/assets/videos/blocklist-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/TCh0ClEM7HY',
    name: 'How to block any app or website on Android with Blockerflow',
    description:
      'A narrated walkthrough of the Blocklist tab: add an installed app with the plus button, add a domain under Websites, and block apps installed later.',
    durationSeconds: 40,
  },
  focusGuide: {
    src: '/assets/videos/focus-guide.mp4',
    poster: '/assets/videos/focus-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/pZkgEt9GyOI',
    name: 'How to start a Focus Mode session in Blockerflow',
    description:
      'A narrated walkthrough of Focus Mode: pick a session name and length, press Start, see what is blocked, and switch on Protect Focus Mode.',
    durationSeconds: 51,
  },
  pornBlockerGuide: {
    src: '/assets/videos/porn-blocker-guide.mp4',
    poster: '/assets/videos/porn-blocker-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/NLotArZy3x0',
    name: 'How to block porn on Android with Blockerflow',
    description:
      'A narrated walkthrough: the three setup tasks including Autostart, Protection active, add image and video search blocking, keep unsupported browsers blocked and switch on Uninstall Protection.',
    durationSeconds: 67,
  },
  accountabilityGuide: {
    src: '/assets/videos/accountability-guide.mp4',
    poster: '/assets/videos/accountability-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/cgyca5vwLpE',
    name: 'How to choose an accountability partner in Blockerflow',
    description:
      'A narrated walkthrough of the four accountability partners, Friend, Myself, Time Delay and AI Coach, and what each challenge looks like.',
    durationSeconds: 54,
  },
  uninstallGuide: {
    src: '/assets/videos/uninstall-protection-guide.mp4',
    poster: '/assets/videos/uninstall-protection-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/hOCtsJCCVTA',
    name: 'How to turn on Uninstall Protection in Blockerflow',
    description:
      'A narrated walkthrough: switch on Uninstall Protection, approve the device admin request, and see the typing challenge and the clean way to uninstall.',
    durationSeconds: 49,
  },
  privacyGuide: {
    src: '/assets/videos/privacy-guide.mp4',
    poster: '/assets/videos/privacy-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/e6EmAHuOpjU',
    name: 'Is a porn blocker private? How Blockerflow checks sites on your phone',
    description:
      'A narrated explainer: server checks versus on device checks, what stays on your phone, and the three optional features that use a server.',
    durationSeconds: 61,
  },
  nightUrgesGuide: {
    src: '/assets/videos/night-urges-guide.mp4',
    poster: '/assets/videos/night-urges-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/p9Qb0kMcBr8',
    name: 'How to add friction before a late night urge with Blockerflow',
    description:
      'A narrated walkthrough: choose Myself or Time Delay as your partner, switch on Uninstall Protection and keep unsupported browsers blocked.',
    durationSeconds: 47,
  },
  macInstallGuide: {
    src: '/assets/videos/mac-install-guide.mp4',
    poster: '/assets/videos/mac-install-guide.jpg',
    youtube: 'https://www.youtube.com/watch?v=5ECKdvyXRDE',
    name: 'How to install Blockerflow on Mac',
    description:
      'A narrated walkthrough: open the disk image, drag Blockerflow to Applications, open it past the macOS warning, allow the certificate and press Turn on.',
    durationSeconds: 68,
    landscape: true,
  },
  setupGuide: {
    src: '/assets/videos/setup-guide.mp4',
    poster: '/assets/videos/setup-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/SvjD9XxNSek',
    name: 'How to use Blockerflow in six steps',
    description:
      'A narrated walkthrough of the six setup steps: the setup screen, choosing what to block, your own Blocklist, an accountability partner, Uninstall Protection and a Focus session.',
    durationSeconds: 73,
  },
  progressGuide: {
    src: '/assets/videos/progress-guide.mp4',
    poster: '/assets/videos/progress-guide.jpg',
    name: 'Blockerflow Progress: clean streak and screen time on Android',
    description:
      'A narrated walkthrough of the Progress tab: the clean streak and how it counts, milestones, Not on purpose, a personal streak with a relapse note, and screen time for today and the week. Everything stays on the phone.',
    durationSeconds: 51,
    youtube: 'https://www.youtube.com/shorts/lg3SRZbI_Ic',
  },
  homePitch: {
    src: '/assets/videos/home-demo.mp4',
    poster: '/assets/videos/home-demo.jpg',
    name: 'Blockerflow: your streak, protected',
    description:
      'A 90 second overview of Blockerflow for Android: adult searches and over a million sites blocked, explicit pictures checked on the phone, Reels and Shorts gone, your own Blocklist and Focus, the urge timer, accountability partners, Uninstall Protection, the clean streak with milestones, screen time, and the Accessibility permission explained.',
    durationSeconds: 90,
    youtube: 'https://www.youtube.com/watch?v=6ffx2L_8qys',
  },

  instagramGuide: {
    src: '/assets/videos/instagram-guide.mp4',
    poster: '/assets/videos/instagram-guide.jpg',
    name: 'How to block Instagram on Android with Blockerflow',
    description:
      'A narrated walkthrough: block the Instagram app and instagram.com from the Blocklist, block it during a Focus session, or block only Reels and keep messages.',
    durationSeconds: 49,
    youtube: 'https://www.youtube.com/shorts/h1QGm7nCGSQ',
  },
  snapchatGuide: {
    src: '/assets/videos/snapchat-guide.mp4',
    poster: '/assets/videos/snapchat-guide.jpg',
    name: 'How to block Snapchat on Android with Blockerflow',
    description:
      'A narrated walkthrough: block the Snapchat app and snapchat.com from the Blocklist, block it during a Focus session, or block only Spotlight and keep chats.',
    durationSeconds: 42,
    youtube: 'https://www.youtube.com/shorts/bAhTpydoxnA',
  },
  channelsGuide: {
    src: '/assets/videos/channels-guide.mp4',
    poster: '/assets/videos/channels-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/8sQgM4sSoHw',
    name: 'How to block WhatsApp and Telegram channels on Android with Blockerflow',
    description:
      'A narrated walkthrough: switch on Block WhatsApp channels and Block Telegram channels in the Social Blocking card, while chats, groups, Status and calls keep working.',
    durationSeconds: 43,
  },
  xVideosGuide: {
    src: '/assets/videos/x-videos-guide.mp4',
    poster: '/assets/videos/x-videos-guide.jpg',
    youtube: 'https://www.youtube.com/shorts/oITDp5f3uPw',
    name: 'How to block X (Twitter) videos on Android with Blockerflow',
    description:
      'A narrated walkthrough: switch on Block X / Twitter Videos in the Social Blocking card, while text posts and pictures keep opening.',
    durationSeconds: 35,
  },
} satisfies Record<string, DemoVideoInfo>

export type VideoKey = keyof typeof DATA

export const VIDEOS: Record<VideoKey, DemoVideoInfo> = DATA

/** schema.org VideoObject for one video, with absolute URLs and an uploadDate that has a UTC offset. */
export function videoSchema(key: VideoKey) {
  const video = VIDEOS[key]
  return {
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: `${SITE_URL}${video.poster}`,
    contentUrl: `${SITE_URL}${video.src}`,
    uploadDate: UPDATED,
    duration: `PT${video.durationSeconds}S`,
  }
}
