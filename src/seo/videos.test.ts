import { describe, expect, it } from 'vitest'
import { ROUTE_VIDEOS } from './routeVideos'
import { VIDEOS, videoSchema, type VideoKey } from './videos'

describe('video structured data', () => {
  it.each(Object.keys(VIDEOS) as VideoKey[])('%s has an uploadDate with a time and a UTC offset', (key) => {
    // Search Console flags a bare date as "missing a timezone".
    expect(videoSchema(key).uploadDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/)
  })

  it('lists a video for the home page, the setup guide and every guide', () => {
    expect(Object.keys(ROUTE_VIDEOS)).toHaveLength(14)
    for (const video of Object.values(ROUTE_VIDEOS)) {
      expect(video.contentUrl).toMatch(/^https:\/\/blockerflow\.net\/assets\/videos\/.+\.mp4$/)
      expect(video.name.length).toBeLessThanOrEqual(100)
    }
  })
})
