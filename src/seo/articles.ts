import type { VideoKey } from './videos'
import { MAC_DOWNLOAD_URL } from './site'

/** A highlighted warning with one command to copy, for a step many readers will hit. */
export interface ArticleNotice {
  title: string
  body: string
  command: string
  /** What to do once the command has run. */
  after: string
}

export interface ArticleSection {
  heading: string
  notice?: ArticleNotice
  paragraphs: string[]
  steps?: string[]
}

/**
 * What sits beside the article: a demo clip, or a screenshot of the app. Guides whose screen
 * has neither leave `media` off and run full width instead of being given a stand in.
 */
export type ArticleMedia =
  | { kind: 'video'; video: VideoKey; caption: string }
  | { kind: 'screenshot'; src: string; alt: string; caption: string }

export interface Article {
  slug: string
  /** Text for the browser tab and search result title. Keep under about 60 characters. */
  title: string
  /** Text for the search result snippet. Keep under about 155 characters. */
  description: string
  h1: string
  intro: string
  media?: ArticleMedia
  /** A file to download, shown as a button under the intro and again at the end of the guide. */
  download?: { label: string; href: string; note: string }
  /** Shown right under the download button, for what a reader must know before opening the file. */
  notice?: ArticleNotice
  /** Show the donation card after the FAQ. */
  support?: boolean
  sections: ArticleSection[]
  faq: { question: string; answer: string }[]
  /** Slugs of other articles to link to at the bottom. */
  related: string[]
}

/**
 * Every instruction here is written against the shipped app, not from memory.
 *
 * The layout these guides describe: four tabs at the bottom (Blocking, Blocklist, Focus,
 * Settings). Blocking is the screen the app opens on and holds every feature switch, grouped
 * into the Content Blocking, Social Blocking, Uninstall Protection and Advanced Blocking cards,
 * with the Accountability Partner card above them. The Blocklist tab is only for apps and sites
 * the user adds themselves. An earlier version of these guides sent people to the Blocklist tab
 * to switch features on, which is not where any of them live.
 */
export const ARTICLES: Article[] = [
  {
    slug: 'how-to-block-porn-on-android',
    title: 'How to Block Porn on Android: Phone Porn Blocker Guide',
    description:
      'Block porn on Android in apps and browsers, including mirror domains and image search, against a 1.1M site blocklist checked entirely on your phone.',
    h1: 'How to block porn on Android',
    intro:
      'SafeSearch is a setting you can switch off in ten seconds, and adult sites move to new domains constantly. This guide shows how to set up a porn blocker on an Android phone so that it covers the whole device and takes a deliberate decision to undo.',
    media: { kind: 'video', video: 'pornBlocker', caption: 'Adult content blocked again and again, then straight back to the home screen.' },
    sections: [
      {
        heading: 'Why browser settings and DNS filters fall short',
        paragraphs: [
          'Most quick fixes protect one place only. SafeSearch covers one search engine. A DNS filter covers one connection and can be changed in the network settings. A browser extension covers one browser. Anyone determined, or just tired and tempted, opens a different browser or an app and walks around it.',
          'A blocker that holds across the phone has to see what is on screen, whichever app or browser you are in. On Android that is the Accessibility Service, and it is what Blockerflow asks for during setup.',
        ],
      },
      {
        heading: 'Set up Blockerflow',
        paragraphs: [
          'The setup screen lists the permissions as tasks and will not let you finish until the required one is done. Each task has its own button, so you never have to go hunting through Android settings.',
        ],
        steps: [
          'Install Blockerflow from Google Play and open it.',
          'On task 1, Enable Accessibility Service, tap Open Settings, read the disclosure, then switch Blockerflow on in the Android accessibility list. This one is marked Required.',
          'On task 2, Remove Battery Restrictions, tap Allow Background so Android does not kill the blocker while it is in the background.',
          'On Xiaomi, Redmi and POCO phones a third task appears, Enable Autostart. Tap Open Autostart and turn it on for Blockerflow, or the blocker will not come back after a restart.',
          'Tap Finish Setup.',
        ],
      },
      {
        heading: 'Check the switches on the Blocking tab',
        paragraphs: [
          'Blockerflow opens on the Blocking tab, and every feature switch lives there, not in the Blocklist tab. The card at the very top is the status card: it should read Protection active, with the detail line Blocklists loaded and checks are running. If it reads Starting protection the lists are still loading, and if it reads Protection is impaired or Protection stopped then nothing is being blocked yet.',
          'Under the Content Blocking card you will find Block adult content, which is on by default. The same card has Block known piracy sites and Block image & video search. Further down, the Advanced Blocking card has Block unsupported browsers, which is on by default and matters more than it sounds. Leave it on.',
        ],
        steps: [
          'Open the Blocking tab, the screen the app starts on.',
          'In the Content Blocking card, confirm Block adult content is on.',
          'Switch on Block image & video search in the same card to close the image and video tabs of the search engines.',
          'In the Advanced Blocking card, leave Block unsupported browsers on.',
          'On the Accountability Partner card near the top, tap Edit and pick who holds the off switch.',
          'Switch on Uninstall Protection and approve the Device Admin request from Android.',
        ],
      },
      {
        heading: 'What actually gets blocked',
        paragraphs: [
          'Addresses are checked against a bundled list of about 1.1 million adult domains, and that comparison happens on your phone. Alongside the list, a keyword engine scores the path, query and fragment of the address, so a page on a site that is not on the list can still be caught, and a brand matcher catches new mirror domains of known sites, the endless numbered and re-registered variants.',
          'Search is covered too. Adult search queries are scored separately on the major engines, with protection for health and education wording so an ordinary medical search is not caught. Turning on Block image & video search closes the image and video tabs on Google, Bing, DuckDuckGo, Yahoo and Yandex.',
          'When something is blocked, Blockerflow puts a Content Blocked screen in front of it, saying Adult content is blocked by Blockerflow, with a button to exit to your home screen. You can add your own message and a short exit delay under Settings, Customize Blocked Screen.',
        ],
      },
      {
        heading: 'Browsers: the gap most blockers leave open',
        paragraphs: [
          'Reading the address bar is browser specific. Blockerflow has confirmed on real devices that it can read the full address in Chrome and in Firefox for Android. Other browsers either have not been confirmed or are known to give only the hostname, which means path based rules would quietly not apply.',
          'Rather than claim cover it cannot deliver, the app blocks those browsers outright while Block unsupported browsers is on. That closes the most common workaround, which is installing a second browser for the purpose. Turning that switch off is treated as seriously as turning off the adult blocker itself.',
        ],
      },
      {
        heading: 'Make it hard to switch off',
        paragraphs: [
          'A blocker only matters if it survives the worst hour of your day. Every switch that weakens protection goes through your accountability partner first: a friend approving by email, a 24 hour delay, a typing challenge, or an AI coach you have to convince. Pick one while you are feeling strong, then turn on Uninstall Protection so the app cannot simply be deleted.',
          'Blockerflow also grades how hard each decision should be. Turning off the adult blocker is marked Strict in the challenge, while a single distraction toggle such as Instagram Reels is Lenient. The friction matches the weight of the decision.',
        ],
      },
      {
        heading: 'Habits that make blocking work',
        paragraphs: [
          'A blocker closes doors, but a few habits stop you looking for windows. Keep the phone out of the bedroom at night, tell one person you trust what you are doing, and fill the gap with something you actually want to do. If this feels bigger than a phone setting, speaking to a doctor or a counsellor is a good step.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does the porn blocker work in every browser on Android?',
        answer:
          'Chrome and Firefox are confirmed to work. Other browsers are blocked outright while Block unsupported browsers is on, so a second browser is not a way around it.',
      },
      {
        question: 'Does it work inside apps, not just browsers?',
        answer:
          'Yes. The Accessibility Service reads what is on screen, so blocking applies in apps as well as browsers.',
      },
      {
        question: 'Can I turn the blocker off again?',
        answer:
          'Yes, but it takes a deliberate step: a friend approving by email, a 24 hour wait, a typing challenge or an AI coach check, depending on the partner you chose.',
      },
      {
        question: 'Is my browsing history uploaded anywhere?',
        answer:
          'No. Address checks happen on your phone against the bundled blocklist, and there is no analytics or telemetry reporting what you visit.',
      },
    ],
    related: [
      'accountability-partner-porn-blocker',
      'how-to-stop-uninstalling-your-porn-blocker',
      'block-image-and-video-search-android',
    ],
  },
  {
    slug: 'block-instagram-reels-on-android',
    title: 'How to Block Instagram Reels on Android (App and Web)',
    description:
      'Block Instagram Reels and Facebook Reels on Android without deleting the apps. Covers Instagram Lite and the browser, and keeps your messages working.',
    h1: 'How to block Instagram Reels on Android',
    intro:
      'Plenty of people want Instagram for messages and friends but lose an hour to Reels without noticing. Deleting the app is blunt, and Instagram offers no switch to turn Reels off. Here is how to block Reels and keep the rest.',
    sections: [
      {
        heading: 'Why you cannot turn Reels off in Instagram',
        paragraphs: [
          'Instagram has no setting that removes Reels. You can mute accounts and snooze suggestions, but the Reels tab and the Reels inside your feed stay. Willpower is a weak defence against a feed designed to keep you there.',
        ],
      },
      {
        heading: 'Switch Reels off in Blockerflow',
        paragraphs: [
          'These switches are on the Blocking tab, the screen Blockerflow opens on. Scroll to the Social Blocking card, which carries all the per platform switches. The Blocklist tab is a different thing: it is for apps and sites you add yourself.',
        ],
        steps: [
          'Install Blockerflow and complete setup, which includes granting the Accessibility Service permission.',
          'Stay on the Blocking tab and scroll down to the Social Blocking card.',
          'Switch on Block Instagram reels.',
          'Switch on Block Facebook reels in the same card if Facebook is part of the problem.',
          'Switch on Block Instagram search as well if the Explore tab is where your scrolling usually starts.',
        ],
      },
      {
        heading: 'What it blocks, and what it leaves alone',
        paragraphs: [
          'In the Instagram app, Blockerflow recognises the Reels player itself and puts a Content Blocked screen in front of it. Your direct messages, your feed, Stories and profiles carry on working. Instagram Lite is covered too, which matters because the Lite app is a common way around a block that only knows about the main app.',
          'In the browser, addresses under instagram.com/reels are blocked, and with Block Instagram search on, instagram.com/explore goes as well. Facebook is handled a little differently: the switch catches a video opening in the Facebook app, so opening a Reel or any other video there is blocked, while the rest of Facebook keeps working.',
        ],
      },
      {
        heading: 'If you want everything quiet for a while',
        paragraphs: [
          'The Reels switch is permanent until you change it. For a fixed stretch of time, the Focus tab is the better tool: a session blocks Instagram, Facebook, Snapchat, TikTok, X, Reddit, Threads, Pinterest and Tumblr completely, as apps and as websites, including their Lite versions, until the session ends.',
        ],
      },
      {
        heading: 'Keep the decision from being undone in a weak moment',
        paragraphs: [
          'Switching a social block back off goes through your accountability partner, the same as every other weakening change. Reels is graded Lenient, so the friction is light: it is there to make the decision deliberate, not to trap you. The categories the app exists for, such as adult content, are graded Strict instead.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I still use Instagram messages with Reels blocked?',
        answer:
          'Yes. Only the Reels player is blocked. Direct messages, the feed, Stories and profiles all keep working.',
      },
      {
        question: 'Does it block Reels in the browser too?',
        answer:
          'Yes. Addresses under instagram.com/reels are blocked in a supported browser, alongside the app.',
      },
      {
        question: 'What about Instagram Lite?',
        answer:
          'Instagram Lite is covered by the same switch, so swapping to the Lite app is not a way around it.',
      },
      {
        question: 'Does this also block Facebook Reels?',
        answer:
          'There is a separate Block Facebook reels switch in the same card. It blocks videos opening in the Facebook app, Reels included.',
      },
    ],
    related: [
      'block-youtube-shorts-on-android',
      'block-snapchat-spotlight-on-android',
      'focus-mode-block-social-media-android',
    ],
  },
  {
    slug: 'block-youtube-shorts-on-android',
    title: 'How to Block YouTube Shorts on Android (and Keep YouTube)',
    description:
      'Remove the YouTube Shorts rabbit hole on Android. Block Shorts in the app and at youtube.com/shorts while normal videos and subscriptions keep working.',
    h1: 'How to block YouTube Shorts on Android',
    intro:
      'You open YouTube for one tutorial and surface forty minutes later, deep in Shorts. YouTube does not let you remove the Shorts shelf. Blockerflow does, and it leaves ordinary videos alone.',
    sections: [
      {
        heading: 'Why Shorts is hard to avoid',
        paragraphs: [
          'Shorts is built into the app: a tab in the bottom bar, a shelf in the home feed, and a swipe up player that never runs out. There is no setting to switch it off, and hiding individual Shorts only trains the recommendations rather than closing the door.',
        ],
      },
      {
        heading: 'Switch Shorts off in Blockerflow',
        paragraphs: [
          'The switch is on the Blocking tab, the screen the app opens on, in the Social Blocking card. You do not need to add YouTube to any list. The Blocklist tab is for apps and sites you choose to add yourself, which is a separate feature.',
        ],
        steps: [
          'Install Blockerflow and complete setup, including the Accessibility Service permission.',
          'Stay on the Blocking tab and scroll to the Social Blocking card.',
          'Switch on Block Youtube Shorts.',
        ],
      },
      {
        heading: 'What happens next',
        paragraphs: [
          'In the YouTube app, Blockerflow recognises the Shorts player as it opens and puts a Content Blocked screen in front of it, with a button back to your home screen. Normal videos, your subscriptions, playlists, search and comments are untouched, because only the Shorts player is matched.',
          'In the browser, addresses under youtube.com/shorts are blocked in Chrome or Firefox. The rest of youtube.com keeps working.',
        ],
      },
      {
        heading: 'If Shorts is not the only feed pulling at you',
        paragraphs: [
          'The same Social Blocking card has switches for Instagram Reels, Facebook Reels, Snapchat videos and search, WhatsApp channels, and X videos. Each is a separate switch, so you can close exactly the doors that are a problem for you and leave the rest alone.',
          'For a time boxed version instead, the Focus tab blocks the main social apps and sites completely for the length of a session. YouTube is deliberately not in that default list, since it is often needed for work or study, but you can add youtube.com under Also block during Focus.',
        ],
      },
      {
        heading: 'Keep the switch from being flipped back',
        paragraphs: [
          'Turning Block Youtube Shorts off again goes through whichever accountability partner you chose. Shorts is graded Lenient, so the check is deliberately light. It exists to make the moment conscious.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I still watch normal YouTube videos?',
        answer:
          'Yes. Only the Shorts player is blocked. Regular videos, subscriptions, playlists and search keep working.',
      },
      {
        question: 'Does it block Shorts on the YouTube website?',
        answer:
          'Yes. Addresses under youtube.com/shorts are blocked in Chrome and Firefox, alongside the app.',
      },
      {
        question: 'Can I block YouTube completely instead?',
        answer:
          'Yes. Add youtube.com in the Blocklist tab for a permanent block, or under Also block during Focus to block it only while a Focus session runs.',
      },
    ],
    related: [
      'block-instagram-reels-on-android',
      'focus-mode-block-social-media-android',
      'block-any-app-or-website-on-android',
    ],
  },
  {
    slug: 'block-snapchat-spotlight-on-android',
    title: 'How to Block Snapchat Spotlight on Android',
    description:
      'Block the Snapchat Spotlight feed and in-app search on Android while chats, the camera and Stories keep working. Step by step with Blockerflow.',
    h1: 'How to block Snapchat Spotlight on Android',
    intro:
      'Snapchat is a messaging app with a short video feed bolted on. Spotlight scrolls like any other endless feed, and Snapchat gives you no way to remove it. You can block the feed and keep the messaging.',
    sections: [
      {
        heading: 'Spotlight is the part that eats the time',
        paragraphs: [
          'Most people open Snapchat to reply to someone. Spotlight sits one tap away in the bottom bar, and once you are in it the swipe up never ends. Snapchat has no setting to hide it, so the only way out is a blocker that can tell the feed apart from the rest of the app.',
        ],
      },
      {
        heading: 'Switch it off in Blockerflow',
        paragraphs: [
          'Both Snapchat switches live on the Blocking tab, in the Social Blocking card. They are separate, so you can block the feed without blocking search, or both.',
        ],
        steps: [
          'Install Blockerflow and complete setup, including the Accessibility Service permission.',
          'Stay on the Blocking tab and scroll to the Social Blocking card.',
          'Switch on Block Snapchat videos to block the Spotlight feed.',
          'Switch on Block Snapchat search if searching inside Snapchat is how your scrolling tends to start.',
        ],
      },
      {
        heading: 'What stays working',
        paragraphs: [
          'Blockerflow matches the Spotlight viewer itself, not the Spotlight icon in the bottom bar. That distinction matters: matching the icon would block Snapchat everywhere, since the bar is on screen the whole time. Chats, the camera, Stories and the map carry on as normal, and only the feed is stopped.',
          'Adding friends is deliberately left alone too. The add friends screen reuses the same search field as in-app search, so it is recognised separately and allowed, which means you can still accept a friend request with Snapchat search blocked.',
        ],
      },
      {
        heading: 'Blocking Snapchat completely for a while',
        paragraphs: [
          'If you want Snapchat gone entirely for a stretch rather than trimmed, start a session on the Focus tab. Snapchat is in the default list that Focus Mode blocks, as the app and as snapchat.com, along with Instagram, Facebook, TikTok, X, Reddit, Threads, Pinterest and Tumblr.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I still send and receive snaps?',
        answer:
          'Yes. Chats, the camera and Stories keep working. Only the Spotlight feed is blocked, and in-app search if you switch that on too.',
      },
      {
        question: 'Can I still accept friend requests with Snapchat search blocked?',
        answer:
          'Yes. The add friends screen is recognised separately from search and is left working.',
      },
      {
        question: 'How do I block Snapchat completely?',
        answer:
          'Start a Focus session, which blocks Snapchat by default, or add Snapchat in the Blocklist tab for a permanent block.',
      },
    ],
    related: [
      'block-instagram-reels-on-android',
      'focus-mode-block-social-media-android',
      'block-any-app-or-website-on-android',
    ],
  },
  {
    slug: 'focus-mode-block-social-media-android',
    title: 'Focus Mode on Android: Block Social Media While You Study',
    description:
      'Block Instagram, Facebook, TikTok, Reddit, X and more for a set time with Blockerflow Focus Mode, including Lite apps, and make stopping early need approval.',
    h1: 'Block social media on Android with Focus Mode',
    intro:
      'Some days you do not want to block one feed, you want everything quiet until the work is done. Focus Mode is built for exactly that: name a session, set a length, and the distractions stay shut until it ends.',
    media: { kind: 'video', video: 'focusPromo', caption: 'Pick a session, set the time, press start. Distractions stay blocked.' },
    sections: [
      {
        heading: 'What a Focus session blocks',
        paragraphs: [
          'While a session is running, Blockerflow blocks Instagram, Facebook, Snapchat, TikTok, X, Reddit, Threads, Pinterest and Tumblr. Each one is blocked as the app and as the website, and the Lite versions are included, so Facebook Lite, Instagram Lite and TikTok Lite are not an escape hatch.',
          'Everything already in your own Blocklist stays blocked during a session as well. Chat apps such as WhatsApp, Telegram and Messenger are deliberately left out of the defaults, along with YouTube, because they are often needed while you work. You can add any of them yourself.',
        ],
      },
      {
        heading: 'Start a session',
        paragraphs: [
          'Focus Mode has its own tab at the bottom of the app. There is also a round button in the bottom right of the Blocking tab, which jumps straight to the start dialog.',
        ],
        steps: [
          'Open the Focus tab, or tap the round Focus button on the Blocking tab.',
          'Pick a name: Study, Work, Reading, Deep Work, Exercise, Meditation, Sleep, or Other for your own.',
          'Pick a length: 15, 25, 30 or 45 minutes, 1 or 2 hours, a custom number of minutes, or No limit to stop it yourself.',
          'Tap Start. The screen shows the session name and a running clock, with the time left underneath if you set a length.',
        ],
      },
      {
        heading: 'Tune what a session covers',
        paragraphs: [
          'Under the timer, Also block during Focus takes extra sites that are blocked only while a session runs. This is where youtube.com, a news site or a forum belongs if it is your particular weak spot.',
          'Allow during Focus does the opposite for one site. If your course materials live on a domain that the defaults catch, add it there and it stays reachable during sessions. It has no effect on your permanent Blocklist, which keeps working either way.',
        ],
      },
      {
        heading: 'Stop yourself from cutting a session short',
        paragraphs: [
          'By default you can stop a session whenever you like. If that is too easy, switch on Protect Focus Mode in the Advanced Blocking card on the Blocking tab. Stopping then needs your accountability partner, so a session you committed to cannot be abandoned on an impulse.',
          'While a session runs, a red banner sits at the top of every tab and a notification stays in your shade, so you always know it is on and can get back to it in one tap.',
        ],
      },
      {
        heading: 'If a session ever seems to outlast its timer',
        paragraphs: [
          'A timed session ends on its own. Android can be unreliable about running scheduled work on time, so Blockerflow checks the deadline from two places independently rather than trusting one. Opening the Focus tab is always enough to settle it.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does Focus Mode block the Lite versions of apps?',
        answer:
          'Yes. Facebook Lite, Instagram Lite and TikTok Lite are blocked by the same defaults as the full apps.',
      },
      {
        question: 'Can I stop a session early?',
        answer:
          'Yes, unless you switch on Protect Focus Mode, which makes stopping need your accountability partner first.',
      },
      {
        question: 'Does Focus Mode block YouTube?',
        answer:
          'Not by default, since it is often needed for work or study. Add youtube.com under Also block during Focus if you want it blocked during sessions.',
      },
      {
        question: 'What if I need one blocked site for my work?',
        answer:
          'Add it under Allow during Focus. That exempts it for sessions only and leaves your permanent Blocklist untouched.',
      },
    ],
    related: [
      'block-any-app-or-website-on-android',
      'block-instagram-reels-on-android',
      'accountability-partner-porn-blocker',
    ],
  },
  {
    slug: 'accountability-partner-porn-blocker',
    title: 'Accountability Partner App for Porn Blocking on Android',
    description:
      'Add an accountability partner to your Android blocker. Choose a friend approving by email, a 24 hour delay, a typing challenge or a strict AI coach.',
    h1: 'Use an accountability partner with your porn blocker',
    intro:
      'Blockers fail at the moment you decide to turn one off. An accountability partner puts something between the urge and the switch. Blockerflow gives you four ways to do that, so you can pick the one that fits your life rather than the one the app prefers.',
    media: { kind: 'video', video: 'accountability', caption: 'The four ways to hold the off switch: Friend, Myself, Time Delay and AI Coach.' },
    sections: [
      {
        heading: 'Why a partner works',
        paragraphs: [
          'Turning a blocker off takes two taps. An urge rarely survives a real obstacle, but it comfortably survives two taps. Putting a person, a wait or a piece of effort in the way changes an impulse into a decision, and most impulses do not make it that far.',
        ],
      },
      {
        heading: 'The four options',
        paragraphs: [
          'Open the Blocking tab, find the Accountability Partner card near the top, and tap Edit. Choose Save Partner when you are done.',
        ],
        steps: [
          'Friend: a trusted person gets an email with approve and deny links and a six digit PIN. You either wait for them to approve or type in the PIN they read out to you. Your phone never knows the PIN, so it cannot be found on the device. Needs you to be signed in.',
          'Myself: a typing challenge. You retype a sentence exactly as shown, with accuracy and progress displayed as you go, and the Verify button stays disabled until it matches.',
          'Time Delay: every change waits 24 hours. You start the timer, the countdown runs, and only then can you unlock. Urges rarely last that long.',
          'AI Coach: you type your reason and a strict coach decides. It is free, with ten checks a day, and needs you to be signed in. If it cannot be reached, it offers you the 24 hour timer instead rather than letting you through.',
        ],
      },
      {
        heading: 'Not every decision is weighted the same',
        paragraphs: [
          'Each challenge shows a strictness badge, because disabling the adult content blocker and disabling Facebook Reels are not the same decision. Strict covers the things the app exists for and the ways it could be removed: adult content, known piracy sites, uninstall protection, factory reset, uninstalling, deleting your account, and the unsupported browser block.',
          'Lenient covers the single platform distraction switches, like Reels, Shorts, Snapchat and WhatsApp channels, where you could get the same content another way in seconds. Everything else sits at Moderate. The AI Coach uses this grading too, so a plausible reason that clears a Lenient toggle will not clear a Strict one.',
        ],
      },
      {
        heading: 'Changing your partner is itself a challenge',
        paragraphs: [
          'Otherwise the whole system would be one tap deep: switch the partner to Myself, then let yourself through. Changing partner goes through your current partner first. Moving to a stronger option is allowed straight away, since that only tightens things.',
        ],
      },
      {
        heading: 'Choosing well',
        paragraphs: [
          'Friend is the strongest, and also the biggest ask of someone else, so choose a person who will not simply approve everything. Time Delay is the strongest option that involves nobody else. Myself is the lightest, good for distraction toggles and weak for the things that matter most. AI Coach sits in between and is useful if you want to be argued with rather than simply stopped.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does my friend need the app installed?',
        answer:
          'No. They get an email with approve and deny links and a PIN, so anything that reads email works.',
      },
      {
        question: 'Can I find the PIN on my own phone?',
        answer:
          'No. The PIN is generated and checked on the server, and your device never receives it.',
      },
      {
        question: 'What if I do not want to involve another person?',
        answer:
          'Pick Time Delay for a 24 hour wait, Myself for a typing challenge, or AI Coach, none of which involve anyone else.',
      },
      {
        question: 'What happens if the AI Coach is unavailable?',
        answer:
          'It offers the 24 hour timer instead. An outage never becomes a way through.',
      },
    ],
    related: [
      'how-to-stop-uninstalling-your-porn-blocker',
      'how-to-stop-porn-urges-at-night',
      'how-to-block-porn-on-android',
    ],
  },
  {
    slug: 'how-to-stop-uninstalling-your-porn-blocker',
    title: 'Stop Uninstalling Your Porn Blocker: Uninstall Protection',
    description:
      'Keep a porn blocker from being deleted in a weak moment. Blockerflow Uninstall Protection puts a partner check or typing challenge before removal.',
    h1: 'How to stop yourself uninstalling your porn blocker',
    intro:
      'The easiest way around any blocker is to delete it, and most apps do nothing to stop that. Uninstall Protection turns removal into a deliberate process instead of a two tap impulse.',
    media: { kind: 'video', video: 'challenge', caption: 'The typing challenge that appears when you try to disable protection.' },
    sections: [
      {
        heading: 'Why blockers get deleted',
        paragraphs: [
          'Deleting is the lowest effort way out. If the blocker can be removed with a long press on the home screen, it will be removed at exactly the wrong moment, and reinstalled an hour later with a worse opinion of yourself attached.',
        ],
      },
      {
        heading: 'Turn on Uninstall Protection',
        paragraphs: [
          'There is a card for it on the Blocking tab, and the same switch appears under General in the Settings tab. Either one works.',
        ],
        steps: [
          'Open the Blocking tab and scroll to the Uninstall Protection card, or open Settings and find it under General.',
          'Switch it on. Android will ask you to approve Blockerflow as a device admin.',
          'Approve the request. The switch only shows as on once Android confirms it, so you cannot end up with a switch that says protected while nothing is.',
        ],
      },
      {
        heading: 'How it holds',
        paragraphs: [
          'While device admin is active, Android refuses to uninstall the app. Turning device admin off is itself guarded by your accountability partner, which is the step that gives the protection its weight. Removing it is graded Strict, the same level as turning off the adult content blocker.',
          'If you genuinely want the app gone, there is a clean route in Settings under Danger Zone. Uninstall App runs the challenge, removes device admin for you once you pass, and hands you to the Android uninstaller. You are never stuck with an app you cannot remove.',
        ],
      },
      {
        heading: 'What the typing challenge looks like',
        paragraphs: [
          'If your partner is set to Myself, you retype this sentence exactly as shown: I acknowledge that I am trying to disable a core productivity feature. I accept the consequences of my actions and will not blame Blockerflow.',
          'Accuracy and progress are shown as you type, and the Verify button stays disabled until the text matches. The effort and the pause are the point, and for many people that is enough to change their mind before the end of the sentence.',
        ],
      },
      {
        heading: 'Close the other side doors too',
        paragraphs: [
          'Uninstalling is not the only shortcut. Two switches in the Advanced Blocking card cover the rest. Block unsupported browsers stops a second browser being installed to get around address checking. Block newly installed apps blocks anything installed after you set Blockerflow up, so a fresh app downloaded in a weak moment is stopped on first launch rather than discovered later.',
          'Apps caught that way appear in your Blocklist tab marked Auto blocked on install, so you can see exactly what was caught and allow anything that was innocent.',
        ],
      },
      {
        heading: 'Be honest about the limits',
        paragraphs: [
          'No app can stop someone truly determined, for example by factory resetting the phone. The goal is to remove the impulsive route, not to build a prison. If you find yourself working around the protection, treat that as the signal it is and talk to someone.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I still uninstall Blockerflow when I no longer need it?',
        answer:
          'Yes. Use Uninstall App under Danger Zone in Settings. It runs your accountability check, removes device admin for you, then opens the Android uninstaller.',
      },
      {
        question: 'Why does the app need Device Admin?',
        answer:
          'Device Admin is the Android feature that lets an app prevent its own removal. It is used for Uninstall Protection only.',
      },
      {
        question: 'What if device admin is revoked from Android settings?',
        answer:
          'Blockerflow re-reads the real state every time you open it, so the switch follows what Android actually reports rather than what was last tapped.',
      },
    ],
    related: [
      'accountability-partner-porn-blocker',
      'how-to-block-porn-on-android',
      'how-to-stop-porn-urges-at-night',
    ],
  },
  {
    slug: 'porn-blocker-privacy-on-device',
    title: 'Is a Porn Blocker Private? On Device Blocking Explained',
    description:
      'Does a porn blocker see your browsing? How Blockerflow checks addresses on your Android phone against 1.1M sites, and exactly what does leave the device.',
    h1: 'Is your porn blocker watching you? How on device blocking works',
    intro:
      'Handing a blocker access to your screen is a big ask, and the fair question is where your browsing goes. For address checks in Blockerflow, the answer is that it goes nowhere.',
    media: { kind: 'video', video: 'privacy', caption: 'Addresses are checked on the phone against the blocklist, not on a server.' },
    sections: [
      {
        heading: 'Two ways a blocker can check a site',
        paragraphs: [
          'Some blockers send every address you visit to a server, which answers allowed or blocked. That is easy to build, and it means a company has a log of your browsing. Others ship the blocklist inside the app and compare on the phone, so there is nothing to send and nothing to log.',
          'Blockerflow does the second. About 1.1 million adult domains are bundled in the app, and each address is compared against them on your device before the page loads.',
        ],
      },
      {
        heading: 'What stays on your phone',
        paragraphs: [
          'Addresses read from your browser stay on the device. So does the on screen content the app inspects to recognise a Reels or Shorts feed, which is examined in memory and never stored. Your blocklist, allowlist and settings are kept locally.',
          'There is no analytics library, no crash reporter and no telemetry upload path in the app, so there is no background channel quietly reporting what you did.',
        ],
      },
      {
        heading: 'What can leave your phone, and only if you choose it',
        paragraphs: [
          'Three optional features use a server, and each one is off until you turn it on. The AI Coach sends the reason you type plus the name of the feature you are trying to disable, and a server passes it to Google Gemini for an approve or reject answer. Choosing a friend as your partner means their email address is sent so the server can email them a PIN. Signing in stores your account and synced settings in the cloud.',
          'None of these carry your browsing history. If you want none of it, you can use the blocker fully signed out with Myself or Time Delay as your partner, and nothing leaves the phone at all.',
        ],
      },
      {
        heading: 'Why on device is better for blocking, not just for privacy',
        paragraphs: [
          'A local comparison is fast enough to stop a page before it loads, where a server round trip would show you the thing you asked not to see. It also keeps working with no connection, on a train or in a dead spot, where a cloud filter quietly fails open.',
        ],
      },
      {
        heading: 'Deleting what you did share',
        paragraphs: [
          'Settings keeps the two kinds of deletion separate, because they are genuinely different. Factory Reset wipes what stayed on the device: your settings, lists and partner choice. Delete Account removes the cloud side, your account and the settings synced to it. Neither one implies the other, and both run your accountability check first.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can Blockerflow see which sites I visit?',
        answer:
          'Addresses are checked on your phone and are not uploaded. There is no analytics or telemetry reporting your browsing.',
      },
      {
        question: 'Does the blocker need the internet to work?',
        answer:
          'No. The blocklist is inside the app, so checks work offline. Only the optional account, AI Coach and friend email features need a connection.',
      },
      {
        question: 'Can I use it without an account?',
        answer:
          'Yes. Signing in only syncs settings. Pick Myself or Time Delay as your partner and the app works fully offline.',
      },
      {
        question: 'How do I delete my data?',
        answer:
          'Factory Reset in Settings erases what is on the device. Delete Account removes your account and anything synced to the cloud.',
      },
    ],
    related: [
      'how-to-block-porn-on-android',
      'accountability-partner-porn-blocker',
      'block-image-and-video-search-android',
    ],
  },
  {
    slug: 'how-to-stop-porn-urges-at-night',
    title: 'How to Stop Porn Urges at Night: Add Friction on Android',
    description:
      'Late night is when blockers get switched off. How a typing challenge and a 24 hour delay give an urge time to pass, set up with Blockerflow on Android.',
    h1: 'How to get through a late night porn urge on Android',
    intro:
      'It is usually late, you are tired, and the phone is already in your hand. Urges feel permanent while they last, and they almost never are. The trick is putting a few seconds of friction between the urge and the off switch.',
    media: { kind: 'video', video: 'urgeTyping', caption: 'At 11 PM, switching protection off means typing a full sentence exactly.' },
    sections: [
      {
        heading: 'Why late night is the hardest time',
        paragraphs: [
          'Tiredness lowers self control, boredom fills the hours, and the phone is within reach in bed. A decision made at midnight is rarely the one you would make at noon, and the blocker is only ever tested at midnight.',
        ],
      },
      {
        heading: 'Friction beats willpower',
        paragraphs: [
          'Planning to be strong in the moment is planning with the resource you have least of. Making the harmful choice slower works better, because a pause is usually all an urge needs to fade.',
          'With Myself as your partner, turning any protection off means retyping a full sentence exactly, with accuracy and progress shown as you go. Every mistake costs time. By the end, plenty of people have decided it is not worth it.',
        ],
      },
      {
        heading: 'Set it up while you feel strong',
        paragraphs: [
          'The right time to choose your friction is a calm afternoon, not the moment you need it. Everything here is on the Blocking tab.',
        ],
        steps: [
          'Open the Blocking tab and tap Edit on the Accountability Partner card.',
          'Choose Myself for the typing challenge, or Time Delay if you want a 24 hour wait that no amount of determination can type through.',
          'Switch on Uninstall Protection so deleting the app is not the easy way out.',
          'In the Advanced Blocking card, leave Block unsupported browsers on so a second browser is not either.',
          'Charge the phone away from your bed.',
        ],
      },
      {
        heading: 'Leave yourself a message',
        paragraphs: [
          'Under Settings, Customize Blocked Screen, you can write a line that appears on the block screen itself. Something in your own words, written by the version of you that set this up, lands differently at 1 AM than a generic refusal does.',
          'The same screen sets an exit delay, which is how many seconds the Exit to Home Screen button stays disabled, up to a minute. Those seconds exist so the block registers instead of being swiped past on reflex.',
        ],
      },
      {
        heading: 'Other things that help',
        paragraphs: [
          'Get up and change rooms when an urge hits, drink some water, message a friend. The physical change of state does more than arguing with yourself does. If the urges feel beyond your control, talking to a doctor or a counsellor is a good next step and not an overreaction.',
        ],
      },
    ],
    faq: [
      {
        question: 'Will a typing challenge really stop me?',
        answer:
          'It does not make anything impossible, it makes it slower. For many people that pause is enough for the urge to pass.',
      },
      {
        question: 'What if I want something stronger?',
        answer:
          'Time Delay makes every change wait 24 hours, and Friend puts a trusted person in the way. Both are harder to get past than typing.',
      },
      {
        question: 'Can I change the message on the block screen?',
        answer:
          'Yes. Settings, Customize Blocked Screen lets you write your own reminder and set how long the exit button stays disabled.',
      },
    ],
    related: [
      'accountability-partner-porn-blocker',
      'how-to-stop-uninstalling-your-porn-blocker',
      'how-to-block-porn-on-android',
    ],
  },
  {
    slug: 'block-image-and-video-search-android',
    title: 'Block Image and Video Search on Android: Full Guide',
    description:
      'Close the image and video tabs on Google, Bing, DuckDuckGo, Yahoo and Yandex on Android, a stronger and harder to undo alternative to SafeSearch.',
    h1: 'How to block image and video search on Android',
    intro:
      'Search engines are the front door. You do not need to find a site when the image tab shows you the same thing in a grid, and SafeSearch is one toggle away from being off. Blocking image and video search closes that door properly.',
    sections: [
      {
        heading: 'Why SafeSearch is not enough',
        paragraphs: [
          'SafeSearch is a preference on one engine, in one browser profile. It can be turned off in seconds, it does not follow you to a different engine, and it is filtering rather than blocking, so it misses plenty on its own.',
          'Blocking the image and video surfaces instead is blunter and much harder to undo, because it is enforced by the blocker rather than requested from the search engine.',
        ],
      },
      {
        heading: 'Switch it on',
        paragraphs: [
          'The switch is on the Blocking tab, in the Content Blocking card, next to Block adult content.',
        ],
        steps: [
          'Install Blockerflow and complete setup, including the Accessibility Service permission.',
          'Stay on the Blocking tab, the screen the app opens on.',
          'In the Content Blocking card, switch on Block image & video search.',
        ],
      },
      {
        heading: 'What it covers',
        paragraphs: [
          'Google is covered through its image and video search addresses, including the modern result tabs and the older image home page. Bing image and video search are covered, as are the image and video modes of DuckDuckGo, and the image and video search of Yahoo and Yandex.',
          'Ordinary web search carries on working. Only the image and video surfaces are blocked, so you can still look things up. When one is blocked you get the Content Blocked screen saying Image and video search is blocked.',
        ],
      },
      {
        heading: 'The other half of search protection',
        paragraphs: [
          'Blocking the image tab does not help if the query itself is the problem, so Blockerflow scores search queries separately whenever Block adult content is on. Explicit searches are stopped on the major engines, with deliberate protection for health and education wording so a genuine medical question is not caught by a word that happens to overlap.',
          'The two work together: query scoring handles what you type, and this switch handles the surface that would show it as a grid of thumbnails.',
        ],
      },
      {
        heading: 'Close the browser loophole',
        paragraphs: [
          'None of this matters if you can open a browser the blocker cannot read. Chrome and Firefox are confirmed to work. Everything else is blocked outright while Block unsupported browsers is on in the Advanced Blocking card, which is where the real protection against a second browser comes from. Leave it on.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I still use normal web search?',
        answer:
          'Yes. Only image and video search are blocked. Ordinary web results keep working.',
      },
      {
        question: 'Which search engines are covered?',
        answer:
          'Google, Bing, DuckDuckGo, Yahoo and Yandex, in a supported browser.',
      },
      {
        question: 'Will it block medical or health searches?',
        answer:
          'Query scoring deliberately protects health and education wording, so a genuine medical search is not caught by an overlapping word.',
      },
    ],
    related: [
      'how-to-block-porn-on-android',
      'porn-blocker-privacy-on-device',
      'block-any-app-or-website-on-android',
    ],
  },
  {
    slug: 'block-any-app-or-website-on-android',
    title: 'How to Block Any App or Website on Android',
    description:
      'Build your own blocklist on Android: block any installed app or domain, auto block newly installed apps, and make unblocking need a partner check.',
    h1: 'How to block any app or website on Android',
    intro:
      'The built in categories cover the usual suspects, but your particular time sink might be a news site, a game or a shopping app. The Blocklist tab is where you add your own, and unblocking goes through the same accountability check as everything else.',
    media: {
      kind: 'screenshot',
      src: '/assets/screenshots/02-blocklist.png',
      alt: 'The Blockerflow Blocklist tab, listing blocked apps with a button to add more',
      caption: 'The Blocklist tab: apps and sites you add yourself, each with its own switch.',
    },
    sections: [
      {
        heading: 'Blocklist is for the things you choose',
        paragraphs: [
          'It is worth being clear about which tab does what, since this is where people most often look in the wrong place. The Blocking tab holds the ready made switches: adult content, Reels, Shorts, Snapchat, browsers and so on. The Blocklist tab is empty until you put something in it, and it is only for apps and sites you pick yourself.',
        ],
      },
      {
        heading: 'Block an app',
        paragraphs: [
          'Apps and websites are separate lists inside the tab, with a counter on each so you can see at a glance what you have.',
        ],
        steps: [
          'Open the Blocklist tab and make sure Blocklist is selected rather than Whitelist.',
          'Choose the Apps list.',
          'Tap the round plus button in the bottom right.',
          'Search your installed apps and switch on the ones to block. Blocked apps are listed newest first, so what you just added is at the top.',
        ],
      },
      {
        heading: 'Block a website',
        paragraphs: [
          'Switch to the Websites list in the same tab and type the exact domain, such as reddit.com, then tap Add. A blocked domain covers its subdomains, so you do not need to add the mobile version separately.',
          'The Whitelist, on the other side of the switch at the top, is the escape valve for a site that is being caught by mistake. Treat it with care: a whitelisted domain skips every other check, including the adult blocker, which is why adding one goes through your accountability partner.',
        ],
      },
      {
        heading: 'Catch apps installed later',
        paragraphs: [
          'A blocklist you wrote today says nothing about an app you install at midnight tomorrow. Block newly installed apps, in the Advanced Blocking card on the Blocking tab, blocks anything installed after you set Blockerflow up, from its first launch.',
          'Anything caught that way shows in your Blocklist tab tagged Auto blocked on install, and the block screen explains why rather than leaving you staring at a refusal for an app you do not remember adding. Apps that were already on the phone before you set the blocker up are never touched by this.',
        ],
      },
      {
        heading: 'Permanent, or only while you work',
        paragraphs: [
          'Everything in your Blocklist stays blocked during a Focus session too. If you only want something gone while you work, the Focus tab has its own Also block during Focus list, which applies for the length of a session and then lifts.',
          'That distinction is worth using. Reserve the permanent Blocklist for things you never want, and put the ones that are only a problem during work hours into the Focus list instead.',
        ],
      },
      {
        heading: 'Removing something is deliberate',
        paragraphs: [
          'Unblocking an app, deleting a domain from the Blocklist and adding a domain to the Whitelist all run your accountability check first. Adding a block is instant, since that only strengthens things. Taking one away is the direction that needs a moment of thought.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I block any installed app?',
        answer:
          'Yes. The plus button in the Blocklist tab lists your installed apps, and you switch on the ones to block.',
      },
      {
        question: 'Do I need to add the mobile version of a site separately?',
        answer:
          'No. A blocked domain covers its subdomains, so adding the main domain is enough.',
      },
      {
        question: 'Can I whitelist apps as well as websites?',
        answer:
          'No. The whitelist is for websites only, which the app tells you on the Apps list.',
      },
      {
        question: 'What happens to apps I install later?',
        answer:
          'With Block newly installed apps on, anything installed after setup is blocked from first launch and tagged Auto blocked on install in your Blocklist.',
      },
    ],
    related: [
      'focus-mode-block-social-media-android',
      'block-youtube-shorts-on-android',
      'how-to-stop-uninstalling-your-porn-blocker',
    ],
  },
  {
    slug: 'how-to-install-blockerflow-on-mac',
    title: 'How to Install Blockerflow on Mac: Step by Step Guide',
    description:
      'Download Blockerflow for Mac, install it from the .dmg and open it past the macOS warning. Includes supported browsers, updating and uninstalling.',
    h1: 'How to install Blockerflow on Mac',
    intro:
      'Blockerflow for Mac blocks adult content, piracy sites, Reels, Shorts and Snapchat Spotlight in your browser, with the same accountability partners and blocklists as the Android app. Installing takes a minute, plus one extra step because macOS does not know the developer.',
    download: {
      label: 'Download Blockerflow for Mac',
      href: MAC_DOWNLOAD_URL,
      note: 'Version 1.0.1, 23 MB, macOS 12 or later, Apple silicon and Intel.',
    },
    sections: [
      {
        heading: 'Install',
        paragraphs: [],
        steps: [
          'Download the .dmg with the button above and open it.',
          'Drag Blockerflow onto the Applications shortcut in the window that opens.',
          'Eject the disk image in Finder. You can delete the .dmg.',
        ],
      },
      {
        heading: 'Open it the first time',
        paragraphs: [
          'Blockerflow is distributed without an Apple Developer licence, so it is not notarized and macOS may refuse a plain double click. You only do this once.',
        ],
        steps: [
          'In Applications, right click Blockerflow and choose Open.',
          'In the warning that appears, choose Open again.',
        ],
        notice: {
          title: 'macOS says "Blockerflow is damaged and can\'t be opened"?',
          body: 'The app is not damaged, macOS just cannot verify it. With Blockerflow in your Applications folder, open Terminal and run:',
          command: 'xattr -cr /Applications/Blockerflow.app',
          after: 'Then open Blockerflow again.',
        },
      },
      {
        heading: 'The first start',
        paragraphs: [
          'Blockerflow installs a certificate called Blockerflow CA in your keychain and sets itself as the system proxy. macOS may ask for your password. Allow it: without the certificate HTTPS sites cannot be filtered. The certificate is created on your Mac and only used to read the address of a few sites, such as YouTube, Instagram and Facebook, so a single Short or Reel can be blocked.',
          'Blockerflow runs from the menu bar and has no Dock icon. The card at the top of the Blocking tab shows whether the filter is really running: if it says Protection is off, press Turn on. Switch on what you want blocked, then choose who approves changes: Myself, Time Delay, a Friend or the AI Coach. Signing in with Google is optional. It is only needed for Friend and AI Coach, and it syncs your settings with the Android app.',
        ],
      },
      {
        heading: 'Supported browsers',
        paragraphs: [
          'Tested and working: Safari, Google Chrome, Firefox, Opera, Vivaldi, DuckDuckGo, Brave, Microsoft Edge, Orion and Yandex. Tor Browser, Maxthon and Arc are not supported, and Block unsupported browsers closes them.',
          'Anything that skips the system proxy skips the blocker too: a built in VPN, DNS over HTTPS settings that bypass the proxy, a Tor window, and apps such as the WhatsApp desktop app. Turn those off if you want the blocker to hold.',
        ],
      },
      {
        heading: 'Update or uninstall',
        paragraphs: [
          'Uninstall Protection locks the app so it cannot be replaced or deleted. Turn it off in Settings first. Your accountability partner may ask you to confirm.',
        ],
        steps: [
          'To update, quit Blockerflow from the menu bar icon, open the new .dmg and drag the app over the old one.',
          'To uninstall, use Uninstall App in Settings. It removes the app, its settings and its background helpers. You can also delete the Blockerflow CA certificate in Keychain Access.',
        ],
      },
    ],
    faq: [
      {
        question: 'Why does macOS warn me when I open Blockerflow?',
        answer:
          'The app is distributed without an Apple Developer licence, so it is not notarized. Right click it and choose Open once. If macOS says the app is damaged, use the Terminal command in the box in the guide above.',
      },
      {
        question: 'Do I need an account?',
        answer:
          'No. You only need to sign in with Google for the Friend and AI Coach partners and to sync with the Android app.',
      },
      {
        question: 'Can I just delete the app to remove it?',
        answer:
          'Not while Uninstall Protection is on. Turn it off in Settings, then use Uninstall App.',
      },
    ],
    support: true,
    related: [
      'how-to-block-porn-on-android',
      'accountability-partner-porn-blocker',
      'how-to-stop-uninstalling-your-porn-blocker',
    ],
  },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}
