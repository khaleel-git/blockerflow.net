import { OG_IMAGE, SITE_NAME, absoluteUrl } from './site'
import type { RouteMeta } from './routes'

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** The head tags for one page, as an HTML string for the prerender step. */
export function renderHead(meta: RouteMeta): string {
  const url = absoluteUrl(meta.path)
  const type = meta.path.startsWith('/guides/') ? 'article' : 'website'
  const lines = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    meta.noindex
      ? '<meta name="robots" content="noindex, follow">'
      : '<meta name="robots" content="index, follow, max-image-preview:large, max-video-preview:-1">',
  ]
  if (!meta.noindex) {
    lines.push(
      `<link rel="canonical" href="${esc(url)}">`,
      `<meta property="og:url" content="${esc(url)}">`,
    )
  }
  lines.push(
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:image" content="${OG_IMAGE}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(meta.title)}">`,
    `<meta name="twitter:description" content="${esc(meta.description)}">`,
    `<meta name="twitter:image" content="${OG_IMAGE}">`,
  )
  return lines.join('\n  ')
}
