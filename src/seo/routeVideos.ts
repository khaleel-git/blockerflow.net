import { ARTICLES } from './articles'
import { videoSchema, type VideoKey } from './videos'

/** Which video each page shows, by route path. Feeds the video entries in the sitemap. */
const KEYS: Record<string, VideoKey> = {
  '/': 'homePitch',
  '/guide': 'setupGuide',
  ...Object.fromEntries(
    ARTICLES.flatMap((a) => (a.media?.kind === 'video' ? [[`/guides/${a.slug}`, a.media.video]] : [])),
  ),
}

export const ROUTE_VIDEOS = Object.fromEntries(Object.entries(KEYS).map(([path, key]) => [path, videoSchema(key)]))
