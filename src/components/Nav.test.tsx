import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Nav } from './Nav'

describe('Nav', () => {
  it('links the wordmark to home', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Blockerflow home' })).toHaveAttribute('href', '/')
  })

  it('links to the guide, privacy, and terms routes', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Setup' })).toHaveAttribute('href', '/guide')
    expect(screen.getByRole('link', { name: 'Guides' })).toHaveAttribute('href', '/guides')
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms')
  })

  it('links the Google Play badge to the store listing', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('link', { name: 'Get Blockerflow on Google Play' }),
    ).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=eu.khaleel.blockerflow')
  })
})
