// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

describe('index.html', () => {
  it('does not declare a page-specific canonical URL or og:url', () => {
    // This one template is used for every route. A hardcoded canonical/og:url here would
    // claim every page IS the homepage. The prerender step injects the correct per-route
    // values at the seo-head placeholder instead.
    const path = fileURLToPath(new URL('../index.html', import.meta.url))
    const contents = readFileSync(path, 'utf-8')
    expect(contents).not.toMatch(/rel=["']canonical["']/)
    expect(contents).not.toMatch(/property=["']og:url["']/)
  })

  it('has the placeholders the prerender step fills in', () => {
    const path = fileURLToPath(new URL('../index.html', import.meta.url))
    const contents = readFileSync(path, 'utf-8')
    expect(contents).toContain('<!--seo-head-->')
    expect(contents).toContain('<!--app-html-->')
  })
})
