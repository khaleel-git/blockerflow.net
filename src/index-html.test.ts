// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

describe('index.html', () => {
  it('does not declare a page-specific canonical URL or og:url', () => {
    // This one shell is served for every route (/, /privacy, /terms). A hardcoded
    // canonical/og:url here would wrongly claim every route IS the homepage,
    // which breaks search indexing and social-share previews for /privacy and
    // /terms. Per-route values would need to be set client-side; until that
    // exists, omitting them is correct -- a missing canonical is far less wrong
    // than one that lies.
    const path = fileURLToPath(new URL('../index.html', import.meta.url))
    const contents = readFileSync(path, 'utf-8')
    expect(contents).not.toMatch(/rel=["']canonical["']/)
    expect(contents).not.toMatch(/property=["']og:url["']/)
  })
})
