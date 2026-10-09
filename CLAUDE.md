# Working in this repo

The marketing site for Blockerflow, an Android app that blocks adult content and distracting
social video feeds. Vite + React + Tailwind, prerendered to static HTML, served from Cloudflare
Pages at **blockerflow.net**.

## Where this came from

It lived in the `website/` directory of the `blockerflow_apk` repo until 2026-10-09, when it was
moved here with `git subtree split --prefix=website`. The 35 commits before the README commit are
that history, with paths rewritten to the repo root. `website/` no longer exists in the app repo.

**The Android app source is still in `blockerflow_apk`**, typically at
`~/Documents/blockerflow_apk`. You will need it, see "Guide content" below.

## Commands

```bash
npm install
npm run dev       # local development
npm test          # vitest, 50 tests
npm run build     # type check, client build, SSR build, prerender
npm run deploy    # build and push to Cloudflare Pages by hand
```

## The build is four steps, not one

`npm run build` runs `tsc -b`, then the client build, then an SSR build of `src/entry-server.tsx`
into `dist-ssr`, then `scripts/prerender.mjs`. That last step renders every route to static HTML
and writes `sitemap.xml` and `robots.txt`. Crawlers and link previews get real content rather than
an empty shell, which is the whole point of the setup.

Add a route to `src/seo/routes.ts` and it is prerendered and added to the sitemap automatically.
Currently 16 pages plus the 404.

### Gotcha: the site URL lives in two places

`SITE_URL` is defined in **both** `src/seo/site.ts` and `scripts/prerender.mjs`. The prerender
script cannot import the TS module, so the value is duplicated. Change one, change the other, or
the canonical tags and the sitemap will disagree.

## Deploying

Pushing to `master` runs `.github/workflows/deploy.yml`: test, build, deploy. It needs two repo
secrets, `CLOUDFLARE_API_TOKEN` (an API token with **Account → Cloudflare Pages → Edit**) and
`CLOUDFLARE_ACCOUNT_ID`. Both are already set.

The Pages project is `blockerflow-website`. It was created as a **direct upload** project, and
Cloudflare cannot convert one of those into a Git connected project. That is why the workflow
deploys to it rather than Cloudflare building this repo itself. Recreating it as a Git connected
project would mean moving the custom domains and taking the site down while they move, so do not
do that casually.

## Domains and the Worker

`blockerflow.net` is canonical. `www.blockerflow.net` 301s to it.

`public/_worker.js` does those redirects. A Pages `_redirects` file matches on path only and
explicitly does not support host level redirects, so this is a Worker instead. Putting a
`_worker.js` in the output directory turns on Pages **advanced mode**: the Worker sees every
request, and anything it does not answer must be handed to `env.ASSETS.fetch(request)`.

If you touch that file, deploy to a preview branch first and check all four of these, because
advanced mode is where static serving quietly breaks:

```bash
npx wrangler pages deploy dist --project-name blockerflow-website --branch=test --commit-dirty=true
# then against the preview URL:
#   /                      200
#   /guide                 308 -> /guide/      (trailing slash still works)
#   /guides/<some-slug>/   200                 (directory index still resolves)
#   /nope                  404                 (custom 404 page, real 404 status)
```

**The old address, `blockerflow.khaleel.eu`, is gone.** It was detached from the project and its
DNS record removed on 2026-10-09, so it does not resolve and nothing redirects from it. Any
search ranking it had is lost and has to be re-earned here. Adding `blockerflow.net` to Google
Search Console and submitting `https://blockerflow.net/sitemap.xml` is still an open task.

## Guide content: verify against the app, never from memory

`src/seo/articles.ts` holds all 11 guides as data, not JSX. They describe the Android app screen
by screen, so **a wrong claim here is a wrong instruction to a real user.**

Every guide was rewritten on 2026-10-09 after the previous versions turned out to be wrong in a
way that mattered. The short version of the app's layout, which the old guides got backwards:

- **Blocking** is the tab the app opens on and holds **every feature switch**, grouped into the
  Content Blocking, Social Blocking, Uninstall Protection and Advanced Blocking cards, with the
  Accountability Partner card above them.
- **Blocklist** is only for apps and sites the user adds themselves. The old guides sent people
  here to switch features on. They are not here.
- **Focus** is Focus Mode. **Settings** is general settings plus the Danger Zone.

Before changing a factual claim, read the source in `blockerflow_apk`, under
`android/app/src/main/java/eu/khaleel/blockerflow/`. The files that answer most questions:

| Question | File |
|---|---|
| What switches exist, what are they called | `ui/MainScreen.kt` |
| The user's own lists | `ui/BlocklistScreen.kt` |
| Focus Mode, session names and durations | `ui/FocusModeScreen.kt`, `data/FocusModeDefaults.kt` |
| Setup steps and permissions | `ui/OnboardingScreen.kt` |
| The four accountability partners | `ui/components/ChallengeModals.kt` |
| How strict each action is | `data/AccountabilitySensitivity.kt` |
| Which browsers actually work | `detector/BrowserRegistry.kt` |
| What is blocked and in what order | `services/PolicyEngine.kt`, `detector/NativeContentDetector.kt` |

Known claim worth re-checking on a device: the toggle is called "Block Facebook reels", but the
detector matches `"tap to show video controls"`, which fires for any video opening in the
Facebook app, not only Reels. The guide says so; confirm it still behaves that way.

### Style rules

- **No hyphens or dashes as punctuation in user-facing text.** Rewrite the sentence instead.
  Code comments are fine.
- Page titles must be 65 characters or fewer and descriptions 160 or fewer. A test enforces this,
  so an over-long title fails the build rather than silently truncating in search results.

## Videos

`src/seo/videos.ts` is the registry. `DemoVideo` renders one on a guide page; `HeroShowcase` and
`HeroDemoVideo` render the autoplaying one on the home page.

**The masters are not in this repo.** They live in `blockerflow_apk/Media Promotions/demo-videos/`,
alongside a `youtube.md` per clip with its copy and notes. What is committed here is the
compressed web version, around 1 to 2.5 MB each, plus a poster frame.

To add one, from the master:

```bash
ffmpeg -i IN.mp4 -vf scale=720:1280 -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p \
  -r 30 -c:a aac -b:a 96k -movflags +faststart public/assets/videos/NAME.mp4
ffmpeg -ss <seconds> -i public/assets/videos/NAME.mp4 -frames:v 1 -vf scale=540:-1 -q:v 3 \
  public/assets/videos/NAME.jpg
```

Use `scale=1280:720` and a 960px poster for landscape clips. Pick the poster timestamp from a
frame where the on-screen headline is fully drawn, not mid-animation; generate a contact sheet
(`-vf "fps=0.8,scale=220:-1,tile=6x2"`) and look at it rather than guessing.

**Aspect ratios are per file and must be declared**, or the video gets cropped. `videos.ts` has
`landscape` for the 16:9 clips and `aspect` for anything that is neither 16:9 nor 9:16. The real
app screen recordings are 9:20; the promos are 9:16.

## Home page

The hero video autoplays muted and loops, pauses when scrolled out of view, and has a sound
toggle, because browsers block autoplay with sound. The two proof chips sit **below** the video.
They were tried above and the user preferred below, so leave them there.

`ScrollToTop` in `src/AppRoutes.tsx` resets scroll on navigation, skipping in-page `#hash` links.
Without it, a new page opens at the previous page's scroll position.

## Open items

- `actions/setup-node@v4` in the deploy workflow targets Node 20, which GitHub is deprecating.
  Bump to v5.
- Add `blockerflow.net` to Google Search Console and submit the sitemap.
