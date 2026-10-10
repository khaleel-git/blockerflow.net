import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Footer } from './Footer'

describe('Footer', () => {
  it('links to guide, privacy, and terms', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Setup' })).toHaveAttribute('href', '/guide')
    expect(screen.getByRole('link', { name: 'Support' })).toHaveAttribute('href', '/support')
    expect(screen.getByRole('link', { name: 'Guides' })).toHaveAttribute('href', '/guides')
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'Terms & Conditions' })).toHaveAttribute('href', '/terms')
  })

  it('links back to khaleel.eu', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Made by Khaleel' })).toHaveAttribute(
      'href',
      'https://khaleel.eu',
    )
  })
})
