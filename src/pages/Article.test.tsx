import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../AppRoutes'
import { ARTICLES } from '../seo/articles'
import { ROUTE_META } from '../seo/routes'
import { MAC_DOWNLOAD_URL, MAC_GUIDE_PATH } from '../seo/site'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('guide articles', () => {
  it.each(ARTICLES.map((a) => [a.slug, a.h1]))('renders %s with its media', (slug, h1) => {
    const { container } = renderAt(`/guides/${slug}`)
    const media = ARTICLES.find((a) => a.slug === slug)!.media
    expect(screen.getByRole('heading', { level: 1, name: h1 })).toBeInTheDocument()
    if (media?.kind === 'video') {
      expect(container.querySelector('video[src^="/assets/videos/"]')).not.toBeNull()
    } else if (media?.kind === 'screenshot') {
      expect(screen.getByRole('img', { name: media.alt })).toHaveAttribute('src', media.src)
    } else {
      // Guides with no clip and no matching screenshot run full width, with neither.
      expect(container.querySelector('video')).toBeNull()
      expect(container.querySelector('img[src^="/assets/screenshots/"]')).toBeNull()
    }
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull()
  })

  it('describes every piece of media it does show', () => {
    for (const a of ARTICLES) {
      if (!a.media) continue
      expect(a.media.caption, a.slug).not.toHaveLength(0)
      if (a.media.kind === 'screenshot') {
        expect(a.media.src, a.slug).toMatch(/^\/assets\/screenshots\/.+\.png$/)
        expect(a.media.alt, a.slug).not.toHaveLength(0)
      }
    }
  })

  it('sets the document title from the route metadata', () => {
    renderAt('/guides/how-to-block-porn-on-android')
    expect(document.title).toBe(
      ROUTE_META.find((m) => m.path === '/guides/how-to-block-porn-on-android')!.title,
    )
  })

  it('shows not found for an unknown guide', () => {
    renderAt('/guides/does-not-exist')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('keeps titles and descriptions within search result limits', () => {
    for (const m of ROUTE_META) {
      expect(m.title.length, m.path).toBeLessThanOrEqual(65)
      expect(m.description.length, m.path).toBeLessThanOrEqual(160)
    }
  })

  it('does not use dash punctuation in guide copy', () => {
    const text = JSON.stringify(ARTICLES)
    expect(text).not.toMatch(/ - | -- |—|–/)
  })

  it('puts the .dmg download link on the Mac install guide, at the top and at the end', () => {
    renderAt(MAC_GUIDE_PATH)
    const links = screen.getAllByRole('link', { name: 'Download Blockerflow for Mac' })
    expect(links).toHaveLength(2)
    for (const l of links) expect(l).toHaveAttribute('href', MAC_DOWNLOAD_URL)
    expect(MAC_DOWNLOAD_URL).toMatch(/^https:\/\/github\.com\/khaleel-git\/blockerflow\.net\/releases\/download\/mac-v[\d.]+\/Blockerflow-mac-[\d.]+\.dmg$/)
  })

  it('shows no download button on guides that have no file', () => {
    renderAt('/guides/how-to-block-porn-on-android')
    expect(screen.queryByRole('link', { name: 'Download Blockerflow for Mac' })).toBeNull()
  })

  it('shows the macOS damaged app command exactly once, with a copy button', () => {
    renderAt(MAC_GUIDE_PATH)
    const notes = screen.getAllByRole('note')
    expect(notes).toHaveLength(1)
    expect(notes[0]).toHaveTextContent('xattr -cr /Applications/Blockerflow.app')
    expect(screen.getAllByRole('button', { name: 'Copy' })).toHaveLength(1)
    expect(document.body.textContent?.match(/xattr -cr \/Applications\/Blockerflow\.app/g)?.length).toBe(1)
  })
})
