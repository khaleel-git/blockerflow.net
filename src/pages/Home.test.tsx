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
    expect(screen.getByRole('link', { name: 'Get it on Google Play' })).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=eu.khaleel.blockerflow',
    )
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
    expect(document.title).toBe('Blockerflow: Block distractions, stay accountable')
  })
})
