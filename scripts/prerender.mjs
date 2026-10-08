// Turns the client build into static HTML for every route, so crawlers and link previews get
// real content instead of an empty shell. Run after `vite build` and the SSR build.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')
const SITE_URL = 'https://blockerflow.khaleel.eu'

const template = await readFile(join(dist, 'index.html'), 'utf-8')
if (!template.includes('<!--seo-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('dist/index.html is missing the seo-head or app-html placeholder')
}

const { render, renderHead, ROUTE_META, NOT_FOUND_META } = await import(
  pathToFileURL(join(ssrDir, 'entry-server.js')).href
)

function page(meta, url) {
  return template
    .replace('<!--seo-head-->', () => renderHead(meta))
    .replace('<!--app-html-->', () => render(url))
}

for (const meta of ROUTE_META) {
  const html = page(meta, meta.path)
  const file = meta.path === '/' ? join(dist, 'index.html') : join(dist, meta.path, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
}

// Cloudflare Pages serves 404.html with a real 404 status for unknown URLs.
await writeFile(join(dist, '404.html'), page(NOT_FOUND_META, '/404'))

const today = new Date().toISOString().slice(0, 10)
const urls = ROUTE_META.filter((m) => !m.noindex)
  .map((m) => {
    const loc = m.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${m.path}/`
    return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod></url>`
  })
  .join('\n')
await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
await writeFile(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
)

await rm(ssrDir, { recursive: true, force: true })
console.log(`Prerendered ${ROUTE_META.length} pages plus 404, sitemap.xml and robots.txt`)
