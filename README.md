# blockerflow.net

The marketing site for [Blockerflow](https://play.google.com/store/apps/details?id=eu.khaleel.blockerflow),
an Android app that blocks adult content and distracting social video feeds.

Vite + React + Tailwind, prerendered to static HTML and served from Cloudflare Pages.
It moved here from the `website/` directory of the `blockerflow_apk` repo, with its history.

```bash
npm install
npm run dev       # local development
npm test          # the suite
npm run build     # production build into dist/
npm run deploy    # build and ship to Cloudflare Pages by hand
```

## How it is built

`npm run build` does four things in order: type checks, builds the client bundle, builds an SSR
bundle, then runs `scripts/prerender.mjs`. That last step renders every route to static HTML and
writes `sitemap.xml` and `robots.txt`, so crawlers and link previews get real content rather than
an empty shell. Add a route to `src/seo/routes.ts` and it is prerendered and listed in the
sitemap automatically.

Guide content lives in `src/seo/articles.ts` as data, not JSX. Those guides describe the shipped
Android app screen by screen, so check a claim against the app before changing it.

## Deploying

Pushing to `master` runs `.github/workflows/deploy.yml`, which tests, builds and deploys to the
`blockerflow-website` Pages project. It needs two repository secrets:

| Secret | What it is |
|---|---|
| `CLOUDFLARE_API_TOKEN` | An API token with the **Cloudflare Pages: Edit** permission |
| `CLOUDFLARE_ACCOUNT_ID` | The account ID the Pages project belongs to |

The project is a direct-upload one, which Cloudflare cannot convert to a Git-connected project,
so the workflow deploys to it rather than Cloudflare building this repo itself. That keeps the
custom domains already attached to the project.

## Domains

`blockerflow.net` is canonical. `public/_worker.js` permanently redirects `www.blockerflow.net`
and the old `blockerflow.khaleel.eu` address to it, because a Pages `_redirects` file matches on
path only and cannot redirect between hostnames.
