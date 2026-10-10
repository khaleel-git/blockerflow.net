import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Home } from './Home'

describe('Home', () => {
  it('links the Google Play badge to the store listing', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('link', { name: 'Get Blockerflow on Google Play' }),
    ).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=eu.khaleel.blockerflow')
  })

  it('states the app is available now on Google Play', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByText('Available now on Google Play')).toBeInTheDocument()
  })

  it('lists all six features', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByText('Adult content blocking')).toBeInTheDocument()
    expect(screen.getByText('Social video blocking')).toBeInTheDocument()
    expect(screen.getByText('Focus Mode')).toBeInTheDocument()
    expect(screen.getByText('Accountability Partner')).toBeInTheDocument()
    expect(screen.getByText('Uninstall Protection')).toBeInTheDocument()
    expect(screen.getByText('AI Coach')).toBeInTheDocument()
  })

  it('links the privacy callout to the Privacy Policy page', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /Read the full Privacy Policy/ })).toHaveAttribute(
      'href',
      '/privacy',
    )
  })

  it('sets the document title', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(document.title).toBe('Blockerflow: Porn Blocker & Reels Blocker for Android')
  })

  it('links the Mac badge to the install guide', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Get Blockerflow for Mac' })).toHaveAttribute(
      'href',
      '/guides/how-to-install-blockerflow-on-mac',
    )
  })

  it('has a support section that says the app is free and lists what donations pay for', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Blockerflow is free. Help me keep it that way.' })).toBeInTheDocument()
    expect(screen.getByText('Apple Developer ID')).toBeInTheDocument()
    expect(screen.getByText('Windows code signing certificate')).toBeInTheDocument()
    expect(screen.getByText('Running costs')).toBeInTheDocument()
    expect(screen.getByText(/Any amount helps/)).toBeInTheDocument()
  })

  it('links the support section to PayPal and opens it safely in a new tab', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: 'Donate via PayPal' })
    expect(link).toHaveAttribute('href', 'https://www.paypal.com/paypalme/Khaleeleu')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('does not use dash punctuation in the support copy', () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    const text = container.querySelector('#support')?.textContent ?? ''
    expect(text.length).toBeGreaterThan(100)
    expect(text).not.toMatch(/ - | -- |—|–/)
  })

  it('links the support section to the support page for the details', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'See the details' })).toHaveAttribute('href', '/support')
  })

  it('puts the support section above the guides list', () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    const support = container.querySelector('#support')!
    const guides = screen.getByRole('heading', { name: 'Guides' })
    expect(support.compareDocumentPosition(guides) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
