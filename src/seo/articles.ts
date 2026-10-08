import type { VideoKey } from './videos'

export interface ArticleSection {
  heading: string
  paragraphs: string[]
  steps?: string[]
}

export interface Article {
  slug: string
  /** Text for the browser tab and search result title. Keep under about 60 characters. */
  title: string
  /** Text for the search result snippet. Keep under about 155 characters. */
  description: string
  h1: string
  intro: string
  video: VideoKey
  videoCaption: string
  sections: ArticleSection[]
  faq: { question: string; answer: string }[]
  /** Slugs of other articles to link to at the bottom. */
  related: string[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'how-to-block-porn-on-android',
    title: 'How to Block Porn on Android: Phone Porn Blocker Guide',
    description:
      'Learn how to block porn on Android in apps and browsers, including image and video search, with a blocklist of 1.1M+ sites checked on your phone.',
    h1: 'How to block porn on Android',
    intro:
      'Switching on SafeSearch is not enough. Adult sites change domains constantly, and a setting you can switch off in ten seconds does not hold up when you are tempted. This guide shows how to block porn on an Android phone in a way that is hard to talk yourself out of.',
    video: 'pornBlocker',
    videoCaption: 'Blockerflow blocks adult content again and again, then sends you home.',
    sections: [
      {
        heading: 'Why browser settings and DNS filters fall short',
        paragraphs: [
          'Most quick fixes protect one place only. SafeSearch covers one search engine. A DNS filter covers one connection and can be changed in the network settings. A browser extension covers one browser. Anyone who is determined, or just tired and tempted, opens a different browser or an app and walks around it.',
          'A porn blocker that works across the whole phone has to watch what is on screen, no matter which app or browser you use. On Android that is done with the Accessibility Service, which is what Blockerflow uses.',
        ],
      },
      {
        heading: 'How to set up a porn blocker with Blockerflow',
        paragraphs: [
          'Setup takes a few minutes. The steps below match what you see in the app.',
        ],
        steps: [
          'Install Blockerflow from Google Play and open it.',
          'Follow the setup screens and turn on the Accessibility Service when asked. This is the permission that lets the app notice an adult site or a blocked feature.',
          'Check that Block adult content is switched on in the Blocking tab. The status card should read Protection active.',
          'Add an accountability partner so that switching protection off needs a second person, a delay, or a challenge. See the guide on accountability below.',
          'Turn on Uninstall Protection in Settings so the app cannot simply be removed.',
        ],
      },
      {
        heading: 'What gets blocked',
        paragraphs: [
          'Blockerflow checks addresses against a blocklist of more than 1.1 million adult domains and a set of keywords. That check happens on your device, so the sites you visit are not uploaded anywhere.',
          'It also catches new mirror domains of known sites, and it blocks image and video search results for adult queries on major search engines, so the front door of the search page is closed too. When something is blocked you see a Content Blocked screen with a button to go back to the home screen.',
        ],
      },
      {
        heading: 'Make it hard to switch off',
        paragraphs: [
          'A blocker only helps if it survives the worst hour of your day. Blockerflow asks for a deliberate step before you can disable a protection: approval from a friend by one time PIN, a timed delay, a typing challenge you must complete word for word, or a conversation with an AI coach. Pick the one that suits you and set it while you are feeling strong.',
        ],
      },
      {
        heading: 'Tips that make blocking work better',
        paragraphs: [
          'A blocker closes doors, but a few habits keep you from looking for windows. Keep the phone out of the bedroom at night, tell one person you trust what you are doing, and fill the gap with something you actually want to do, such as a walk or a call. If you feel that this is bigger than a phone setting, speaking to a doctor or counsellor is a good step.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does a porn blocker work in every browser on Android?',
        answer:
          'Blockerflow reads the address being opened across apps and browsers through the Accessibility Service, so it is not tied to one browser. Results can vary with unusual browsers, so test yours after setup.',
      },
      {
        question: 'Does Blockerflow upload the sites I visit?',
        answer:
          'No. The blocklist check happens on your device. The app has no analytics SDK and no telemetry upload path. Read the Privacy Policy for the few opt in features that do send data.',
      },
      {
        question: 'Can I still turn the blocker off if I really need to?',
        answer:
          'Yes, but it takes a deliberate step: a friend approving, a delay, a typing challenge or an AI coach check, depending on what you chose.',
      },
    ],
    related: [
      'accountability-partner-porn-blocker',
      'how-to-stop-uninstalling-your-porn-blocker',
      'block-instagram-reels-on-android',
    ],
  },
  {
    slug: 'block-instagram-reels-on-android',
    title: 'How to Block Instagram Reels on Android (App and Web)',
    description:
      'Block Instagram Reels and Facebook Reels on Android without deleting the whole app. Works in the apps and in the browser. Step by step guide.',
    h1: 'How to block Instagram Reels on Android',
    intro:
      'Plenty of people want Instagram for messages and friends, but lose an hour to Reels without noticing. Deleting the app is blunt, and Instagram offers no real switch to turn Reels off. Here is how to block Reels and keep the rest.',
    video: 'reelsShorts',
    videoCaption: 'Reels and Shorts blocked, while messages and DMs stay usable.',
    sections: [
      {
        heading: 'Why you cannot turn Reels off in Instagram',
        paragraphs: [
          'Instagram does not include a setting to remove Reels. You can mute accounts and snooze suggestions, but the Reels tab and the Reels that appear in the feed stay. Willpower alone is a weak defence against a feed designed to keep you scrolling.',
        ],
      },
      {
        heading: 'Block Reels with Blockerflow',
        paragraphs: [
          'Blockerflow can block the short video feeds of several platforms while leaving the rest of the app usable. Reels on Instagram and Facebook are both covered, in the app and in the browser.',
        ],
        steps: [
          'Install Blockerflow and grant the Accessibility Service permission during setup.',
          'Open the Blocklist tab.',
          'Switch on Block Instagram reels and Block Facebook reels.',
          'Open Instagram. Messages and posts still work, and the Reels feed is replaced by the blocked screen.',
        ],
      },
      {
        heading: 'Other short video feeds you can block',
        paragraphs: [
          'The same blocklist covers YouTube Shorts, Snapchat Spotlight and videos on X, also known as Twitter. If your problem is a different app entirely, Focus Mode can block whole apps for a set time.',
        ],
      },
      {
        heading: 'Stop yourself from undoing it',
        paragraphs: [
          'The usual way blocks fail is that you switch them off at 11pm. Add an accountability partner or the typing challenge so that undoing the block takes effort. That small delay is often enough for the urge to pass.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I block Reels but still use Instagram messages?',
        answer:
          'Yes. Blockerflow blocks the Reels feed itself, so you can keep using direct messages and the rest of the app.',
      },
      {
        question: 'Does it also work on instagram.com in a browser?',
        answer:
          'Yes. Social video blocking applies to both the native apps and their websites when opened in a browser.',
      },
      {
        question: 'Does this block Facebook Reels too?',
        answer: 'Yes. Facebook Reels are covered in the same way as Instagram Reels.',
      },
    ],
    related: [
      'block-youtube-shorts-on-android',
      'focus-mode-block-social-media-android',
      'how-to-block-porn-on-android',
    ],
  },
  {
    slug: 'block-youtube-shorts-on-android',
    title: 'How to Block YouTube Shorts on Android (and Keep YouTube)',
    description:
      'Remove the YouTube Shorts rabbit hole on Android. Block Shorts in the app and on the website while keeping regular YouTube videos available.',
    h1: 'How to block YouTube Shorts on Android',
    intro:
      'You open YouTube for one tutorial and surface 40 minutes later, deep in Shorts. YouTube does not let you remove the Shorts shelf. Blockerflow does, and it leaves normal videos alone.',
    video: 'reelsShorts',
    videoCaption: 'Shorts blocked, while the rest of the app stays usable.',
    sections: [
      {
        heading: 'What makes Shorts hard to avoid',
        paragraphs: [
          'Shorts appear on the home page, in search results and as their own tab. Each one is under a minute, so there is never a natural stopping point. YouTube offers a way to see fewer of them, but nothing that removes them for good.',
        ],
      },
      {
        heading: 'How to block YouTube Shorts with Blockerflow',
        paragraphs: ['The steps are the same as for other short video feeds.'],
        steps: [
          'Install Blockerflow and complete setup, including the Accessibility Service permission.',
          'Go to the Blocklist tab.',
          'Turn on Block Youtube Shorts.',
          'Open YouTube. Regular videos and your subscriptions play as usual, and opening a Short shows the blocked screen.',
        ],
      },
      {
        heading: 'Works on the YouTube website too',
        paragraphs: [
          'If you switch to the mobile site to get around an app block, the block follows you. Blockerflow looks at what is on screen in browsers as well as in apps.',
        ],
      },
      {
        heading: 'When you want more than Shorts gone',
        paragraphs: [
          'If YouTube itself is the problem during work or study, start a Focus Mode session. It blocks the distractions you pick for a fixed time and you cannot end it early on a whim.',
        ],
      },
    ],
    faq: [
      {
        question: 'Will regular YouTube videos still work?',
        answer: 'Yes. Only the Shorts feed is blocked. Normal videos and subscriptions are unaffected.',
      },
      {
        question: 'Do I need to be signed in to Blockerflow?',
        answer:
          'No account is needed to block content. Signing in with Google is optional and only used to back up your settings.',
      },
    ],
    related: [
      'block-instagram-reels-on-android',
      'focus-mode-block-social-media-android',
      'how-to-block-porn-on-android',
    ],
  },
  {
    slug: 'focus-mode-block-social-media-android',
    title: 'Focus Mode on Android: Block Social Media While You Study',
    description:
      'Block Instagram, Facebook, TikTok, Reddit, X and more for a set time with Blockerflow Focus Mode. Includes Lite apps and Snapchat. Hard to cut short.',
    h1: 'Block social media on Android with Focus Mode',
    intro:
      'Some days you do not want to block one feed, you want everything quiet until the work is done. Focus Mode in Blockerflow is built for that: name a session, set a time, and the distractions stay blocked until it ends.',
    video: 'focusPromo',
    videoCaption: 'Pick a session, set the time and press start. Distractions stay blocked.',
    sections: [
      {
        heading: 'What Focus Mode blocks',
        paragraphs: [
          'While a session is active, Blockerflow blocks Instagram, Facebook, TikTok, Reddit and X by default. It also blocks their Lite versions and Snapchat. You can also add other apps and sites to block during Focus.',
        ],
      },
      {
        heading: 'How to start a Focus session',
        paragraphs: ['It takes about ten seconds.'],
        steps: [
          'Open the Focus tab.',
          'Pick a session name such as Study, Work, Reading, Deep Work, Exercise, Meditation or Sleep, or write your own.',
          'Choose a duration from 15 minutes up to 2 hours, or No limit, or enter a custom time.',
          'Tap Start. A red banner shows the session is active and how much time is left.',
        ],
      },
      {
        heading: 'Why it is harder to cheat than app timers',
        paragraphs: [
          'Normal app timers let you tap Ignore. Blockerflow protects Focus Mode settings with the same accountability options as the rest of the app, so ending a session early needs a deliberate step rather than one tap.',
        ],
      },
      {
        heading: 'Good uses for Focus Mode',
        paragraphs: [
          'Study blocks before exams, a work sprint, prayer or reading time, and the hour before bed. Many people use a short daily session at a fixed time so it becomes routine.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does Focus Mode block Snapchat and Lite apps?',
        answer:
          'Yes. Focus Mode covers Snapchat and the Lite versions of the social apps as well as the main apps.',
      },
      {
        question: 'Can I use my phone for calls during a session?',
        answer:
          'Yes. Focus Mode blocks the apps and sites it is set to block. Phone calls and messages are not part of that list.',
      },
    ],
    related: [
      'block-instagram-reels-on-android',
      'block-youtube-shorts-on-android',
      'how-to-stop-uninstalling-your-porn-blocker',
    ],
  },
  {
    slug: 'accountability-partner-porn-blocker',
    title: 'Accountability Partner App for Porn Blocking on Android',
    description:
      'Add an accountability partner to your porn blocker on Android. Choose a friend with a one time PIN, a time delay, a typing challenge or an AI coach.',
    h1: 'Use an accountability partner with your porn blocker',
    intro:
      'Blockers fail at the moment you decide to turn them off. An accountability partner puts something between the urge and the switch. Blockerflow offers four ways to do that, so you can choose the one that fits your life.',
    video: 'accountability',
    videoCaption: 'The four ways to hold your blocker: Friend, Myself, Time Delay and AI Coach.',
    sections: [
      {
        heading: 'Why accountability works',
        paragraphs: [
          'Urges are strongest in short bursts. Anything that adds a few minutes of friction, or involves another person, gives the urge time to fade. That is the idea behind every option below.',
        ],
      },
      {
        heading: 'The four options in Blockerflow',
        paragraphs: [
          'Friend. A trusted person gets a one time PIN by email whenever you want to unlock something. You cannot proceed without them reading it out to you.',
          'Myself. You must type a long sentence exactly as shown before the protection is disabled. It is designed to be tedious enough to make you stop and think.',
          'Time Delay. You request the change and then wait 24 hours before it takes effect.',
          'AI Coach. An honest second opinion that questions why you want to disable a protection. The AI Coach is optional and only used when you ask for it.',
        ],
      },
      {
        heading: 'How to set it up',
        paragraphs: ['Do this when you are calm, not when you are tempted.'],
        steps: [
          'Open Settings and find Accountability Partner.',
          'Pick Friend, Myself, Time Delay or AI Coach.',
          'For Friend, enter their email address. They only need to be able to read an email and pass on a PIN.',
          'Tap Save Partner.',
        ],
      },
      {
        heading: 'What your partner can and cannot see',
        paragraphs: [
          'Your partner receives a PIN by email and nothing else. They do not see your browsing history, because it never leaves your phone. Read the Privacy Policy for exactly what leaves the device.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does my accountability partner need to install the app?',
        answer: 'No. They only need an email address that can receive the one time PIN.',
      },
      {
        question: 'What if I do not want to involve anyone else?',
        answer:
          'Choose Myself for a typing challenge, Time Delay for a 24 hour wait, or AI Coach for a second opinion, none of which involve another person.',
      },
    ],
    related: [
      'how-to-stop-uninstalling-your-porn-blocker',
      'how-to-block-porn-on-android',
      'focus-mode-block-social-media-android',
    ],
  },
  {
    slug: 'how-to-stop-uninstalling-your-porn-blocker',
    title: 'Stop Uninstalling Your Porn Blocker: Uninstall Protection',
    description:
      'Keep a porn blocker from being removed in a weak moment. Blockerflow Uninstall Protection adds a typing challenge or partner approval before removal.',
    h1: 'How to stop yourself uninstalling your porn blocker',
    intro:
      'The easiest way around any blocker is to delete it. Many apps do nothing to stop that. Uninstall Protection makes removal a deliberate process instead of a two tap impulse.',
    video: 'challenge',
    videoCaption: 'The typing challenge that appears when you try to disable protection.',
    sections: [
      {
        heading: 'Why blockers get deleted',
        paragraphs: [
          'Deleting is the lowest effort way out. If the blocker can be removed in a few taps from the home screen, it will be removed at exactly the wrong time.',
        ],
      },
      {
        heading: 'How Uninstall Protection works',
        paragraphs: [
          'Blockerflow asks for Device Admin permission. While that is active, Android will not let the app be removed until Device Admin is turned off, and Blockerflow guards that step with your chosen verification: friend approval, delay or typing challenge.',
        ],
        steps: [
          'Open Settings in Blockerflow.',
          'Turn on Uninstall Protection under General.',
          'Approve the Device Admin request from Android.',
          'Choose how verification should work in Accountability Partner settings.',
        ],
      },
      {
        heading: 'What the typing challenge looks like',
        paragraphs: [
          'You are asked to type a sentence exactly as shown, including punctuation. Your accuracy and progress are shown on screen as you type. The effort and the pause are the point, and for many people that is enough to change their mind.',
        ],
      },
      {
        heading: 'Be honest about the limits',
        paragraphs: [
          'No app can fully stop someone who is determined, for example by resetting the phone. The goal is to remove the impulsive route, not to build a prison. If you find yourself working around the protection, treat that as a signal to talk to someone.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I still uninstall Blockerflow when I no longer need it?',
        answer:
          'Yes. Complete the verification you chose, turn Uninstall Protection off, then remove the app as usual.',
      },
      {
        question: 'Why does the app need Device Admin?',
        answer:
          'Device Admin is the Android feature that lets an app prevent its own removal. It is used for Uninstall Protection only.',
      },
    ],
    related: [
      'accountability-partner-porn-blocker',
      'how-to-block-porn-on-android',
      'focus-mode-block-social-media-android',
    ],
  },
  {
    slug: 'porn-blocker-privacy-on-device',
    title: 'Is a Porn Blocker Private? On Device Blocking Explained',
    description:
      'Does a porn blocker see your browsing? How Blockerflow checks web addresses on your Android phone against 1.1M+ sites, and what it does send off device.',
    h1: 'Is your porn blocker watching you? How on device blocking works',
    intro:
      'Handing a blocker access to your phone is a big ask, especially when the thing you are blocking is private. The reasonable question is where your browsing goes. For Blockerflow the answer for web address checks is that it goes nowhere.',
    video: 'privacy',
    videoCaption: 'Every web address is checked on your phone against the blocklist, not on a server.',
    sections: [
      {
        heading: 'Two ways a blocker can check a site',
        paragraphs: [
          'Some blockers send each address you visit to a server, which answers allowed or blocked. That is easy to build, but it means a company sees your browsing. Others keep the blocklist on the phone and compare locally, so there is nothing to send.',
          'Blockerflow does the second. The blocklist of more than 1.1 million adult domains is bundled in the app, and each address is checked against it on your device before the page loads.',
        ],
      },
      {
        heading: 'What stays on your phone',
        paragraphs: [
          'Web addresses read from your browser and checked against the blocklist are never uploaded. Neither is the on screen content the app inspects to spot a Reels or Shorts feed. Your blocklist, allowlist and settings are stored on the device.',
          'Blockerflow has no analytics SDK, no crash reporter and no telemetry upload path, so there is no background channel reporting what you do.',
        ],
      },
      {
        heading: 'What can leave your phone, and only if you choose it',
        paragraphs: [
          'Three optional features use a server. The AI Coach sends the reason you type and the name of the feature to get an approve or reject answer. An email accountability partner means the app sends that address so a one time PIN can be emailed. Signing in to an account stores your account details and synced settings in the cloud.',
          'None of these send your browsing history, and each one only runs when you turn it on. The full detail is in the privacy policy.',
        ],
      },
      {
        heading: 'Why on device is also better for blocking',
        paragraphs: [
          'A local check is fast, so a harmful page is stopped before it loads. It also keeps working with a weak connection, because nothing has to be fetched to decide.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can Blockerflow see which sites I visit?',
        answer:
          'Web addresses are checked on your phone and are not uploaded. Blockerflow has no analytics or telemetry that reports your browsing.',
      },
      {
        question: 'Does the blocker need the internet to work?',
        answer:
          'No. The blocklist is stored in the app, so address checks work without a connection. Only the optional account, AI Coach and email features need one.',
      },
      {
        question: 'Where can I read exactly what is collected?',
        answer:
          'The Privacy Policy page on this site lists what is processed on device, what leaves it and how to delete your data.',
      },
    ],
    related: [
      'how-to-block-porn-on-android',
      'accountability-partner-porn-blocker',
      'how-to-stop-uninstalling-your-porn-blocker',
    ],
  },
  {
    slug: 'how-to-stop-porn-urges-at-night',
    title: 'How to Stop Porn Urges at Night: Add Friction on Android',
    description:
      'Late night is when most blockers get switched off. Learn how a typing challenge and a delay give an urge time to pass, using Blockerflow on Android.',
    h1: 'How to get through a late night porn urge on Android',
    intro:
      'It is usually late, you are tired, and the phone is in your hand. Urges feel permanent while they last, but they rarely do. The trick is to put a few seconds of friction between the urge and the off switch.',
    video: 'urgeTyping',
    videoCaption: 'At 11 PM, switching protection off means typing a full sentence exactly.',
    sections: [
      {
        heading: 'Why late night is the hardest time',
        paragraphs: [
          'Tiredness lowers self control, boredom fills the hours, and the phone is within reach in bed. Decisions made at midnight are rarely the ones you would make at noon.',
        ],
      },
      {
        heading: 'Friction beats willpower',
        paragraphs: [
          'Asking yourself to be strong in the moment is a weak plan. Making the harmful choice slower works better, because a pause is often all it takes for an urge to fade.',
          'In Blockerflow, the Myself option asks you to type a long sentence exactly before any protection can be turned off. Every mistake costs time, and by the end many people have decided not to bother.',
        ],
      },
      {
        heading: 'Set it up while you feel strong',
        paragraphs: [
          'The best time to set a challenge is a calm daytime hour, not during an urge.',
        ],
        steps: [
          'Open Blockerflow and go to Settings, then Accountability Partner.',
          'Choose Myself for the typing challenge, or Time Delay if you prefer a 24 hour wait.',
          'Turn on Uninstall Protection so the app cannot just be deleted.',
          'Keep the phone charging away from your bed at night.',
        ],
      },
      {
        heading: 'Other habits that help',
        paragraphs: [
          'Get up and change your surroundings when an urge hits, drink some water, or message a friend. If the urges feel out of your control, talking to a doctor or counsellor is a good next step.',
        ],
      },
    ],
    faq: [
      {
        question: 'Will a typing challenge really stop me?',
        answer:
          'It does not make it impossible, it makes it slower. For many people that pause is enough for the urge to pass.',
      },
      {
        question: 'What if I want a person involved instead?',
        answer:
          'Choose Friend, and a trusted contact gets a one time PIN by email that you need before anything turns off.',
      },
    ],
    related: [
      'how-to-stop-uninstalling-your-porn-blocker',
      'accountability-partner-porn-blocker',
      'how-to-block-porn-on-android',
    ],
  },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}
