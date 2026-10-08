import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../AppRoutes'
import { ARTICLES } from '../seo/articles'
import { ROUTE_META } from '../seo/routes'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('guide articles', () => {
  it.each(ARTICLES.map((a) => [a.slug, a.h1]))('renders %s with a demo video', (slug, h1) => {
    const { container } = renderAt(`/guides/${slug}`)
    expect(screen.getByRole('heading', { level: 1, name: h1 })).toBeInTheDocument()
    expect(container.querySelector('video[src^="/assets/videos/"]')).not.toBeNull()
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull()
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
})
